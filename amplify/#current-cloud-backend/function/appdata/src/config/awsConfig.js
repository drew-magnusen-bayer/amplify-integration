const { processor, Config } = require('@monsantoit/config')

const vaultBasePath = 'vault://kv/data/command-center'

const awsConfig = {
  sources: [
    () => ({
      commandCenterConfig: {
        oauth: {
          clientId: `${vaultBasePath}/${process.env.VAULT_ENVIRONMENT}/AZURE_CLIENT_ID`,
          clientSecret: `${vaultBasePath}/${process.env.VAULT_ENVIRONMENT}/AZURE_CLIENT_SECRET`,
          env: `${vaultBasePath}/${process.env.VAULT_ENVIRONMENT}/AZURE_OAUTH_ENV`
        },
        bigQueryConfig: `${vaultBasePath}/bigquery/data`,
        graphqlConfig: {
          graphqlEndpoint: `${vaultBasePath}/graphql/graphqlEndpoint`,
          graphqlAPIKey: `${vaultBasePath}/graphql/graphqlAPIKey`
        },
        dynamoTables: {
          region: `${vaultBasePath}/${process.env.VAULT_ENVIRONMENT}/REGION_TABLE`,
          country: `${vaultBasePath}/${process.env.VAULT_ENVIRONMENT}/COUNTRY_TABLE`,
          homeSite: `${vaultBasePath}/${process.env.VAULT_ENVIRONMENT}/HOMESITE_TABLE`,
          site: `${vaultBasePath}/${process.env.VAULT_ENVIRONMENT}/SITE_TABLE`,
          plantedDate: `${vaultBasePath}/${process.env.VAULT_ENVIRONMENT}/PLANTED_DATE_TABLE`,

        },
        fieldRouteConfig: {
          allLocationsDataUrl: `${vaultBasePath}/${process.env.VAULT_ENVIRONMENT}/ALL_LOCATIONS_DATA_URL`,
          hubsUrl: `${vaultBasePath}/${process.env.VAULT_ENVIRONMENT}/HUBS_URL`,
        },
        teamsHookUrl: `${vaultBasePath}/${process.env.VAULT_ENVIRONMENT}/TEAMS_HOOK_URL`
      }
    })
  ],
  processors: [
    processor.readVaultFromConfig({
      enabled: true,
      auth: {
        type: 'awsRole',
        roleName: process.env.LAMBDA_TASK_ROOT === '/var/task' ? 'command-center-dev-lambda-prod' : 'command-center-dev-lambda-local'
      }
    })
  ]
}

const config = new Config(awsConfig)

exports.VAULT_CONFIG = {
  TEAMS_HOOK_URL: '',
  AZURE_CLIENT_ID: '',
  AZURE_CLIENT_SECRET: '',
  AZURE_OAUTH_ENV: '',
  REGION_TABLE: '',
  COUNTRY_TABLE: '',
  HOMESITE_TABLE: '',
  SITE_TABLE: '',
  PLANTED_DATE_TABLE: '',
  ALL_LOCATIONS_DATA_URL: '',
  HUBS_URL: '',
  BIG_QUERY: ''
}
exports.initVaultConfig = async () => {
  try {
    await config.init()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(e, null, 2))
    throw e
  }
  this.VAULT_CONFIG.TEAMS_HOOK_URL = config.get('commandCenterConfig.teamsHookUrl')
  this.VAULT_CONFIG.AZURE_CLIENT_ID = config.get('commandCenterConfig.oauth.clientId')
  this.VAULT_CONFIG.AZURE_CLIENT_SECRET = config.get('commandCenterConfig.oauth.clientSecret')
  this.VAULT_CONFIG.AZURE_OAUTH_ENV = config.get('commandCenterConfig.oauth.env')
  this.VAULT_CONFIG.REGION_TABLE = config.get('commandCenterConfig.dynamoTables.region')
  this.VAULT_CONFIG.COUNTRY_TABLE = config.get('commandCenterConfig.dynamoTables.country')
  this.VAULT_CONFIG.HOMESITE_TABLE = config.get('commandCenterConfig.dynamoTables.homeSite')
  this.VAULT_CONFIG.SITE_TABLE = config.get('commandCenterConfig.dynamoTables.site')
  this.VAULT_CONFIG.PLANTED_DATE_TABLE = config.get('commandCenterConfig.dynamoTables.plantedDate')
  this.VAULT_CONFIG.ALL_LOCATIONS_DATA_URL = config.get('commandCenterConfig.fieldRouteConfig.allLocationsDataUrl')
  this.VAULT_CONFIG.HUBS_URL = config.get('commandCenterConfig.fieldRouteConfig.hubsUrl')
  this.VAULT_CONFIG.BIG_QUERY = JSON.parse(Buffer.from(config.get('commandCenterConfig.bigQueryConfig'), 'base64').toString('utf8'))
}
