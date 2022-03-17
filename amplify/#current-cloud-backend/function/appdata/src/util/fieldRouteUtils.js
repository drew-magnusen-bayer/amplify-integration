const { agent } = require("@monsantoit/superagent-oauth")
const { VAULT_CONFIG } = require('../config/awsConfig')

const CC_KEYS = {
  regions: {
    NORTH_AMERICA: 'North America'
  },
  countries: {
    UNITED_STATES_OF_AMERICA: 'United States of America',
  },
  crops: {
    CORN: 'Corn',
    SOY: 'Soybeans'
  }
}

const FR_KEYS = {
  countries: {
    UNITED_STATES_OF_AMERICA: 'USA'
  },
  crops: {
    CORN: 'corn',
    SOY: 'soy'
  }
}

const normalizeFieldRouteCrop = (crop) => (
  crop === FR_KEYS.crops.CORN ? CC_KEYS.crops.CORN
    : FR_KEYS.crops.SOY
      ? CC_KEYS.crops.SOY : crop
)

exports.getFieldRouteLocations = async () => {
  try {
    console.log('making request')
    const results = await agent
      .get(VAULT_CONFIG.ALL_LOCATIONS_DATA_URL, {
        authProvider: "azure",
        clientId: VAULT_CONFIG.AZURE_CLIENT_ID,
        clientSecret: VAULT_CONFIG.AZURE_CLIENT_SECRET,
        environment: VAULT_CONFIG.AZURE_OAUTH_ENV
      })
      .catch((error) => {
        console.log('e', error)
      })
    return results.body.map(p => ({
      region: CC_KEYS.regions.NORTH_AMERICA,
      country: CC_KEYS.countries.UNITED_STATES_OF_AMERICA,
      homesiteName: p.stationName,
      siteName: p.locationId,
      crop: normalizeFieldRouteCrop(p.crop)
    }))
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(e, null, 2))
    return []
  }
}

exports.getHubs = async () => {
  try {
    const results = await agent
      .get(VAULT_CONFIG.HUBS_URL, {
        authProvider: "azure",
        clientId: VAULT_CONFIG.AZURE_CLIENT_ID,
        clientSecret: VAULT_CONFIG.AZURE_CLIENT_SECRET,
        environment: VAULT_CONFIG.AZURE_OAUTH_ENV
      })
      .catch((error) => {
        console.log(error)
      })
    return results.body.map(p => ({
      country: (p.country === FR_KEYS.countries.UNITED_STATES_OF_AMERICA)
        ? CC_KEYS.countries.UNITED_STATES_OF_AMERICA : p.country,
      homesiteName: p.station
    }))
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(e, null, 2))
    return []
  }
}
