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
        dynamoTables: {
          machineData: `${vaultBasePath}/${process.env.VAULT_ENVIRONMENT}/MACHINE_DATA_TABLE`
        },
        fieldRouteConfig: {
          movementScheduleWithStatusUrl: `${vaultBasePath}/${process.env.VAULT_ENVIRONMENT}/MOVEMENT_SCHEDULE_WITH_STATUS_URL`
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
  MACHINE_DATA_TABLE: '',
  MOVEMENT_SCHEDULE_WITH_STATUS_URL: '',
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
  this.VAULT_CONFIG.MACHINE_DATA_TABLE = config.get('commandCenterConfig.dynamoTables.machineData')
  this.VAULT_CONFIG.MOVEMENT_SCHEDULE_WITH_STATUS_URL = config.get('commandCenterConfig.fieldRouteConfig.movementScheduleWithStatusUrl')
}
