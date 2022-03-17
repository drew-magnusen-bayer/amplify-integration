const { agent } = require("@monsantoit/superagent-oauth")
const { BigQuery } = require('@google-cloud/bigquery')
const _ = require('lodash')
const AWS = require('aws-sdk')
const { wipeTable } = require("@monsantoit/dynamoutil")
const { initVaultConfig, VAULT_CONFIG } = require('./config/awsConfig')
const { hydrateRegionRecords } = require('./util/regionsUtil')
const { hydrateCountryRecords } = require('./util/countriesUtil')
const { hydrateHomesiteRecords } = require('./util/homesitesUtil')
const { hydrateSiteRecords } = require('./util/sitesUtil')
const { rollUpGeography } = require('./util/rollUpUtil')
const { idMap } = require('./util/modelFactoryUtil')
const { hydratePlantedDates } = require('./util/plantedDatesUtil')
const { getFieldRouteLocations, getHubs } = require('./util/fieldRouteUtils')

AWS.config.logger = console

let queryResults,
  structuredPlantedDates

const regions = [],
  countries = [],
  homeSites = [],
  sites = []

const queryBQ = async () => {
  // Create BQ object
  const bigquery = new BigQuery({
    projectId: 'bcs-breeding-datasets',
    credentials: {
      client_email: VAULT_CONFIG.BIG_QUERY.client_email,
      private_key: VAULT_CONFIG.BIG_QUERY.private_key
    }
  })

  const targetColumns = ['region', 'country', 'homesiteName', 'siteName', 'growingYear',
    'season', 'crop', 'plantedDate', 'harvestType', 'trialType', 'experimentName', 'planted as plantedPlot', 'total_plots as totalPlots']
  const baseQuery = `select ${targetColumns.join(', ')} from bcs-breeding-datasets.breeding_operations.command_center_base where plantedDate is not null and homesiteName is not null and siteName is not null`

  const queryOptions = {
    query: baseQuery,
    location: 'US',
  }

  try {
    [queryResults] = await bigquery.query(queryOptions)
    // eslint-disable-next-line no-return-assign
    queryResults = queryResults.map(r => r = { ...r, plantedDate: new Date(r.plantedDate) })
    let fieldRouteLocations = await getFieldRouteLocations()
    const hubs = await getHubs()
    // eslint-disable-next-line max-len
    fieldRouteLocations = fieldRouteLocations.map((i) => {
      const homesiteMatch = hubs.find((h) => (h.homesiteName === i.homesiteName))
      if (homesiteMatch) {
        i.country = homesiteMatch.country
      }
      return i
    })
    let resultsToFilter
    if (fieldRouteLocations.length) {
      resultsToFilter = [...queryResults, ...fieldRouteLocations]
    } else {
      resultsToFilter = [...queryResults]
    }
    _.forOwn(_.groupBy(resultsToFilter, 'region'), (value) => regions.push(rollUpGeography(value)))
    _.forOwn(_.groupBy(resultsToFilter, 'country'), (value) => countries.push(rollUpGeography(value)))
    _.forOwn(_.groupBy(resultsToFilter, 'homesiteName'), (value) => homeSites.push(rollUpGeography(value)))
    _.forOwn(_.groupBy(resultsToFilter, 'siteName'), (value) => sites.push(rollUpGeography(value)))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    await agent.post(
      VAULT_CONFIG.TEAMS_HOOK_URL,
      {
        authProvider: "azure",
        clientId: VAULT_CONFIG.AZURE_CLIENT_ID,
        clientSecret: VAULT_CONFIG.AZURE_CLIENT_SECRET,
        environment: VAULT_CONFIG.AZURE_OAUTH_ENV
      },
      { text: `App Data-${process.env.ENV} Hydration Failure: ${e}` }
    )
  }
}

const wipeEverything = async () => {
  console.log('wiping tables')
  console.log(`wiping ${VAULT_CONFIG.REGION_TABLE}`)
  await wipeTable(VAULT_CONFIG.REGION_TABLE)
  console.log(`wiping ${VAULT_CONFIG.COUNTRY_TABLE}`)
  await wipeTable(VAULT_CONFIG.COUNTRY_TABLE)
  console.log(`wiping ${VAULT_CONFIG.HOMESITE_TABLE}`)
  await wipeTable(VAULT_CONFIG.HOMESITE_TABLE)
  console.log(`wiping ${VAULT_CONFIG.SITE_TABLE}`)
  await wipeTable(VAULT_CONFIG.SITE_TABLE)
  console.log(`wiping ${VAULT_CONFIG.PLANTED_DATE_TABLE}`)
  await wipeTable(VAULT_CONFIG.PLANTED_DATE_TABLE)
}
exports.handler = async (event, resolver) => {
  await initVaultConfig()
  await wipeEverything()
  await queryBQ(event)

  await Promise.all(regions.map(async (r) => {
    await hydrateRegionRecords(r)
  }))
  await Promise.all(countries.map(async (c) => {
    await hydrateCountryRecords(c)
  }))
  await Promise.all(homeSites.map(async (h) => {
    await hydrateHomesiteRecords(h)
  }))
  await Promise.all(sites.map(async (s) => {
    await hydrateSiteRecords(s)
  }))

  structuredPlantedDates = queryResults.map(p => ({
    ...p,
    regionID: idMap.get(p.region),
    countryID: idMap.get(p.country),
    homesiteID: idMap.get(p.homesiteName),
    siteID: idMap.get(p.siteName)
  }))

  await Promise.all(structuredPlantedDates.map(async (pd) => {
    await hydratePlantedDates([pd])
  }))

  await agent.post(
    VAULT_CONFIG.TEAMS_HOOK_URL,
    {
      authProvider: "azure",
      clientId: VAULT_CONFIG.AZURE_CLIENT_ID,
      clientSecret: VAULT_CONFIG.AZURE_CLIENT_SECRET,
      environment: VAULT_CONFIG.AZURE_OAUTH_ENV
    },
    { text: `App Data-${process.env.ENV} Hydration Success` }
  )
}
