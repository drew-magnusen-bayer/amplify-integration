const { agent } = require("@monsantoit/superagent-oauth")
const { batchUtil, batchTypes, wipeTable } = require("@monsantoit/dynamoutil")
const { initVaultConfig, VAULT_CONFIG } = require('./config/awsConfig')
const moment = require('moment')
const crypto = require('crypto')

const hydrateHarvestProgress = async () => {
    const results = await agent
        .get(VAULT_CONFIG.MOVEMENT_SEQUENCE_BY_LOCATION_URL, {
            authProvider: "azure",
            clientId: VAULT_CONFIG.AZURE_CLIENT_ID,
            clientSecret: VAULT_CONFIG.AZURE_CLIENT_SECRET,
            environment: VAULT_CONFIG.AZURE_OAUTH_ENV
        })
        .catch((error) => {
            console.log(error)
        })
    try {
        const putRequests = results.body.map(p => ({
            [`${batchTypes.PUT_REQUEST}`]: {
                Item: {
                    id: crypto.randomBytes(16).toString('hex'),
                    homeSite: p.hubName,
                    compliance: p.compliance,
                    site: p.loc_id,
                    priority: p.sequence,
                    harvestWindowStart: moment(p.harvestReadyDate, 'YYYY-MM-DD').format(),
                    harvestWindowEnd: moment(p.endWindow, 'YYYY-MM-DD').format(),
                    plots: p.plots,
                    percentHarvested: p.harvestedPercentile,
                    crop: p.crop
                }
            }
        }))
        await batchUtil(putRequests, VAULT_CONFIG.HARVEST_PROGRESS_TABLE)
        await agent.post(
            VAULT_CONFIG.TEAMS_HOOK_URL,
            {
                authProvider: "azure",
                clientId: VAULT_CONFIG.AZURE_CLIENT_ID,
                clientSecret: VAULT_CONFIG.AZURE_CLIENT_SECRET,
                environment: VAULT_CONFIG.AZURE_OAUTH_ENV
            },
            { "text": `Field Route Crops-${process.env.ENV} Harvest Progress Data Hydration Success` }
        )
    } catch (e) {
        console.log('error writing to harvestProgress', e)
        await agent.post(
            VAULT_CONFIG.TEAMS_HOOK_URL,
            {
                authProvider: "azure",
                clientId: VAULT_CONFIG.AZURE_CLIENT_ID,
                clientSecret: VAULT_CONFIG.AZURE_CLIENT_SECRET,
                environment: VAULT_CONFIG.AZURE_OAUTH_ENV
            },
            { "text": `Field Route Crops-${process.env.ENV} Progress Data Hydration Failure: ${e}` }
        )
    }
}

const hydrateHarvestProgressPie = async () => {
    const results = await agent
        .get(VAULT_CONFIG.ALL_LOCATIONS_DATA_URL, {
            authProvider: "azure",
            clientId: VAULT_CONFIG.AZURE_CLIENT_ID,
            clientSecret: VAULT_CONFIG.AZURE_CLIENT_SECRET,
            environment: VAULT_CONFIG.AZURE_OAUTH_ENV
        })
        .catch((error) => {
            console.log(error)
        })
    try {
        const putRequests = results.body.map(p => ({
            [`${batchTypes.PUT_REQUEST}`]: {
                Item: {
                    id: crypto.randomBytes(16).toString('hex'),
                    homeSite: p.stationName,
                    site: p.locationId,
                    compliance: p.compliance,
                    rating: p.rating,
                    plotCount: p.plotCount,
                    harvestPercentile: p.harvestPercentile,
                    ratingDescription: p.ratingDescription,
                    harvestedPlotCount: p.harvestedPlotCount,
                    crop: p.crop
                }
            }
        }))
        await batchUtil(putRequests, VAULT_CONFIG.HARVEST_PROGRESS_PIE_TABLE)
        await agent.post(
            VAULT_CONFIG.TEAMS_HOOK_URL,
            {
                authProvider: "azure",
                clientId: VAULT_CONFIG.AZURE_CLIENT_ID,
                clientSecret: VAULT_CONFIG.AZURE_CLIENT_SECRET,
                environment: VAULT_CONFIG.AZURE_OAUTH_ENV
            },
            { "text": `Field Route Crops-${process.env.ENV} Harvest Progress Pie Data Hydration Success` }
        )
    } catch (e) {
        console.log('error writing to harvestProgressPie', e)
        await agent.post(
            VAULT_CONFIG.TEAMS_HOOK_URL,
            {
                authProvider: "azure",
                clientId: VAULT_CONFIG.AZURE_CLIENT_ID,
                clientSecret: VAULT_CONFIG.AZURE_CLIENT_SECRET,
                environment: VAULT_CONFIG.AZURE_OAUTH_ENV
            },
            { "text": `Field Route Crops-${process.env.ENV} Harvest Progress Pie Data Hydration Failure: ${e}` }
        )
    }
}
exports.handler = async (event) => {
    await initVaultConfig()
    await wipeTable(VAULT_CONFIG.HARVEST_PROGRESS_TABLE)
    await wipeTable(VAULT_CONFIG.HARVEST_PROGRESS_PIE_TABLE)
    await hydrateHarvestProgress()
    await hydrateHarvestProgressPie()
    return 'Field Route Crops hydration completed'
}