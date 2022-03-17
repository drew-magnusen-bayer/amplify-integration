const AWS = require('aws-sdk')
const _ = require('lodash')
const crypto = require('crypto')
const moment = require('moment')
const { batchUtil, batchTypes } = require("@monsantoit/dynamoutil")
const { VAULT_CONFIG } = require('../config/awsConfig')

const updatePlantedDates = async (plantedDates) => {
  try {
    const putRequests = plantedDates.map(p => ({
      [`${batchTypes.PUT_REQUEST}`]: {
        Item: {
          id: crypto.randomBytes(16).toString('hex'),
          regionID: p.regionID,
          countryID: p.countryID,
          homesiteID: p.homesiteID,
          siteID: p.siteID,
          region: p.region,
          country: p.country,
          homeSite: p.homesiteName,
          site: p.siteName,
          regionNames: [p.region],
          countryNames: [p.country],
          homeSiteNames: [p.homesiteName],
          siteNames: [p.siteName],
          crops: [p.crop],
          experimentNames: [p.experimentName],
          harvestTypes: [p.harvestType],
          seasons: [p.season],
          trialTypes: [p.trialType],
          growingYears: [p.growingYear],
          plantedDate: moment(p.plantedDate, 'YYYY-MM-DDThh:mm:ss.sssZ').format(),
          plantedPlot: p.plantedPlot,
          totalPlots: p.totalPlots,
          createdAt: moment().format(),
          updatedAt: moment().format()
        }
      }
    }))
    await batchUtil(putRequests, VAULT_CONFIG.PLANTED_DATE_TABLE)
  } catch (e) {
    console.log('error in updatePlantedDates', e)
  }
}

exports.hydratePlantedDates = async (plantedDates) => {
  console.log('creating planted dates')
  await updatePlantedDates(plantedDates)
}
