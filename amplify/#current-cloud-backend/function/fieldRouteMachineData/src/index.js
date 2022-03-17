const { agent } = require("@monsantoit/superagent-oauth")
const { batchUtil, batchTypes, wipeTable } = require("@monsantoit/dynamoutil")
const { initVaultConfig, VAULT_CONFIG } = require('./config/awsConfig')
const moment = require('moment')
const crypto = require('crypto')

const hydrateMachineData = async () => {
    const results = await agent
        .get(VAULT_CONFIG.MOVEMENT_SCHEDULE_WITH_STATUS_URL, {
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
                    combine: p.combine,
                    movementDate: p.movementDate ? moment(p.movementDate).format() : null,
                    fromStation: p.fromStation,
                    toStation: p.toStation,
                    drivingDistance: p.drivingDistance,
                    compliance: p.compliance,
                    crop: p.crop,
                    acceptedDate: p.acceptedDate ? moment(p.acceptedDate).format() : null,
                }
            }
        }))
        await batchUtil(putRequests, VAULT_CONFIG.MACHINE_DATA_TABLE)
        await agent.post(
            VAULT_CONFIG.TEAMS_HOOK_URL,
            {
                authProvider: "azure",
                clientId: VAULT_CONFIG.AZURE_CLIENT_ID,
                clientSecret: VAULT_CONFIG.AZURE_CLIENT_SECRET,
                environment: VAULT_CONFIG.AZURE_OAUTH_ENV
            },
            { "text": `Machine Data-${process.env.ENV} Hyrdation Success` }

        )
    } catch (e) {
        console.log('error writing to machineData', e)
        // curl -H 'Content-Type: application/json' -d '{"text": "Hello World"}' <YOUR WEBHOOK URL>
        await agent.post(
            VAULT_CONFIG.TEAMS_HOOK_URL,
            {
                authProvider: "azure",
                clientId: VAULT_CONFIG.AZURE_CLIENT_ID,
                clientSecret: VAULT_CONFIG.AZURE_CLIENT_SECRET,
                environment: VAULT_CONFIG.AZURE_OAUTH_ENV
            },
            { "text": `Machine Data-${process.env.ENV} Hydration Failure: ${e}` }
        )
    }
}


exports.handler = async (event) => {
    await initVaultConfig()
    console.log(`wiping ${VAULT_CONFIG.MACHINE_DATA_TABLE}`)
    await wipeTable(VAULT_CONFIG.MACHINE_DATA_TABLE)
    console.log('Hydrating Field Route Machine Data')
    await hydrateMachineData()
    return 'Field Route Machine Data hydration completed'
}
