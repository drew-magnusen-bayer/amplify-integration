const AWS = require('aws-sdk')
const { baseModel, idMap } = require('./modelFactoryUtil')
const { VAULT_CONFIG } = require('../config/awsConfig')

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" })

const getRegionByName = async (name) => {
  try {
    const listParams = {
      TableName: VAULT_CONFIG.REGION_TABLE,
      FilterExpression: '#region = :region',
      ExpressionAttributeValues: {
        ':region': name
      },
      ExpressionAttributeNames: {
        "#region": "region"
      }
    }
    // eslint-disable-next-line max-len
    const { Items } = await new Promise((resolve, reject) => docClient.scan(listParams, (e, d) => (e ? reject(e) : resolve(d))))
    return Items.shift()
  } catch (e) {
    console.error('error calling getRegionByName', e)
    return null
  }
}

const createRegionRecord = async (bqItem) => {
  const params = {
    TableName: VAULT_CONFIG.REGION_TABLE,
    Item: {
      ...baseModel(bqItem, 'REGION'),
      region: bqItem.region
    },
    ReturnValues: "ALL_OLD"
  }

  await docClient.put(params, (e, d) => e && console.log(e)).promise()
}

const deleteRegionRecord = async (regionModel) => {
  const params = {
    TableName: VAULT_CONFIG.REGION_TABLE,
    Key: {
      id: regionModel.id
    }
  }
  await docClient.delete(params, (e, d) => e && console.log(e)).promise()
}

exports.hydrateRegionRecords = async (bqItem) => {
  const regionModel = await getRegionByName(bqItem.region)
  if (!regionModel) {
    console.log(`creating region: ${bqItem.region}`)
    await createRegionRecord(bqItem)
  } else {
    await deleteRegionRecord(regionModel)
    await createRegionRecord(bqItem)
  }
}
