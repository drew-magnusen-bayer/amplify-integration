const AWS = require('aws-sdk')

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" })
const { baseModel } = require('./modelFactoryUtil')
const { VAULT_CONFIG } = require('../config/awsConfig')

const getCountryByName = async (name) => {
  try {
    const listParams = {
      TableName: VAULT_CONFIG.COUNTRY_TABLE,
      FilterExpression: '#country = :country',
      ExpressionAttributeValues: {
        ':country': name
      },
      ExpressionAttributeNames: {
        "#country": "country"
      }
    }
    // eslint-disable-next-line max-len
    const { Items } = await new Promise((resolve, reject) => docClient.scan(listParams, (e, d) => (e ? reject(e) : resolve(d))))
    return Items.shift()
  } catch (e) {
    console.error('error calling getCountryByName', e)
    return null
  }
}

const createCountryRecord = async (bqItem) => {
  const params = {
    TableName: VAULT_CONFIG.COUNTRY_TABLE,
    Item: {
      ...baseModel(bqItem, 'COUNTRY'),
      region: bqItem.region,
      country: bqItem.country
    },
    ReturnValues: "ALL_OLD"
  }
  await docClient.put(params, (e, d) => e && console.log(e)).promise()
}

const deleteCountryRecord = async (countryModel) => {
  const params = {
    TableName: VAULT_CONFIG.COUNTRY_TABLE,
    Key: {
      id: countryModel.id
    }
  }
  await docClient.delete(params, (e, d) => e && console.log(e)).promise()
}

exports.hydrateCountryRecords = async (bqItem) => {
  const countryModel = await getCountryByName(bqItem.country)
  if (!countryModel) {
    /* CREATE */
    console.log(`creating country: ${bqItem.country}`)
    await createCountryRecord(bqItem)
  } else {
    /* UPDATE */
    await deleteCountryRecord(countryModel)
    await createCountryRecord(bqItem)
  }
}
