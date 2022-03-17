/* eslint-disable max-len */
const AWS = require('aws-sdk')
const { baseModel } = require('./modelFactoryUtil')
const { VAULT_CONFIG } = require('../config/awsConfig')

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" })

const getSiteByName = async (name) => {
  try {
    const listParams = {
      TableName: VAULT_CONFIG.SITE_TABLE,
      FilterExpression: '#site = :site',
      ExpressionAttributeValues: {
        ':site': name
      },
      ExpressionAttributeNames: {
        "#site": "site"
      }
    }
    const { Items } = await new Promise((resolve, reject) => docClient.scan(listParams, (e, d) => (e ? reject(e) : resolve(d))))
    return Items.shift()
  } catch (e) {
    console.error('error calling getSiteByName', e)
    return null
  }
}

const createSiteRecord = async (bqItem) => {
  const params = {
    TableName: VAULT_CONFIG.SITE_TABLE,
    Item: {
      ...baseModel(bqItem, 'SITE'),
      region: bqItem.region,
      country: bqItem.country,
      homeSite: bqItem.homeSite,
      site: bqItem.site
    },
    ReturnValues: "ALL_OLD"
  }

  await docClient.put(params, (e, d) => e && console.log(e)).promise()
}

const deleteSiteRecord = async (siteModel) => {
  const params = {
    TableName: VAULT_CONFIG.SITE_TABLE,
    Key: {
      id: siteModel.id
    }
  }
  await docClient.delete(params, (e, d) => e && console.log(e)).promise()
}

exports.hydrateSiteRecords = async (bqItem) => {
  const siteModel = await getSiteByName(bqItem.site)
  if (!siteModel) {
    console.log(`creating site: ${bqItem.site}`)
    await createSiteRecord(bqItem)
  } else {
    await deleteSiteRecord(siteModel)
    await createSiteRecord(bqItem)
  }
}
