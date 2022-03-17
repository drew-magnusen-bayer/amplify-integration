const AWS = require('aws-sdk')

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" })
const { baseModel } = require('./modelFactoryUtil')
const { VAULT_CONFIG } = require('../config/awsConfig')

const getHomesiteByName = async (name) => {
  try {
    const listParams = {
      TableName: VAULT_CONFIG.HOMESITE_TABLE,
      FilterExpression: '#homesiteName = :homesiteName',
      ExpressionAttributeValues: {
        ':homesiteName': name
      },
      ExpressionAttributeNames: {
        "#homesiteName": "homesiteName"
      }
    }
    // eslint-disable-next-line max-len
    const { Items } = await new Promise((resolve, reject) => docClient.scan(listParams, (e, d) => (e ? reject(e) : resolve(d))))
    return Items.shift()
  } catch (e) {
    console.error('error calling getHomesiteByName', e)
    return null
  }
}

const createHomesiteRecord = async (bqItem) => {
  const params = {
    TableName: VAULT_CONFIG.HOMESITE_TABLE,
    Item: {
      ...baseModel(bqItem, 'HOMESITE'),
      region: bqItem.region,
      country: bqItem.country,
      homeSite: bqItem.homeSite
    },
    ReturnValues: "ALL_OLD"
  }
  await docClient.put(params, (e, d) => e && console.log(e)).promise()
}

const deleteHomesiteRecord = async (homesiteModel) => {
  const params = {
    TableName: VAULT_CONFIG.HOMESITE_TABLE,
    Key: {
      id: homesiteModel.id
    }
  }
  await docClient.delete(params, (e, d) => e && console.log(e)).promise()
}

exports.hydrateHomesiteRecords = async (bqItem) => {
  const homesiteModel = await getHomesiteByName(bqItem.homeSite)
  if (!homesiteModel) {
    /* CREATE */
    console.log(`creating homesite: ${bqItem.homeSite}`)
    await createHomesiteRecord(bqItem)
  } else {
    /* UPDATE */
    await deleteHomesiteRecord(homesiteModel)
    await createHomesiteRecord(bqItem)
  }
}
