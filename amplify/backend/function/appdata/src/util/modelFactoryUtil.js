const crypto = require('crypto')
const moment = require('moment')

exports.idMap = new Map()
exports.baseModel = (bqItem, level) => {
  const hash = crypto.randomBytes(16).toString('hex')
  switch (level) {
    case ('REGION'):
      this.idMap.set(bqItem.region, hash)
      break
    case ('COUNTRY'):
      this.idMap.set(bqItem.country, hash)
      break
    case ('HOMESITE'):
      this.idMap.set(bqItem.homeSite, hash)
      break
    case ('SITE'):
      this.idMap.set(bqItem.site, hash)
      break
    default:
      break
  }

  return {
    id: hash,
    crops: bqItem.crops,
    experimentNames: bqItem.experimentNames,
    harvestTypes: bqItem.harvestTypes,
    seasons: bqItem.seasons,
    regionNames: bqItem.regionNames,
    countryNames: bqItem.countryNames,
    homeSiteNames: bqItem.homeSiteNames,
    siteNames: bqItem.siteNames,
    trialTypes: bqItem.trialTypes,
    growingYears: bqItem.growingYears,
    createdAt: moment().format(),
    updatedAt: moment().format()
  }
}
