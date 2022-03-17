const _ = require('lodash')

exports.rollUpGeography = (value) => {
  const result = {
    crops: _.uniq(value.map(v => v.crop)),
    experimentNames: _.uniq(value.map(v => v.experimentName)),
    harvestTypes: _.uniq(value.map(v => v.harvestType)),
    seasons: _.uniq(value.map(v => v.season)),
    growingYears: _.uniq(value.map(v => v.growingYear)),
    trialTypes: _.uniq(value.map(v => v.trialType)),
    siteNames: _.uniq(value.map(v => v.siteName)),
    countryNames: _.uniq(value.map(v => v.country)),
    homeSiteNames: _.uniq(value.map(v => v.homesiteName)),
    regionNames: _.uniq(value.map(v => v.region)),

  }
  result.region = _.uniq(value.map(v => v.region)).toString()
  const countries = _.uniq(value.map(v => v.country))
  if (countries.length < 2) result.country = countries.toString()
  const homeSites = _.uniq(value.map(v => v.homesiteName))
  if (homeSites.length < 2) result.homeSite = homeSites.toString()
  const sites = _.uniq(value.map(v => v.siteName))
  if (sites.length < 2) result.site = sites.toString()
  return result
}

exports.rollUpFilters = (value) => {
  const result = {
    regionNames: _.uniq(value.map(v => v.region)),
    countryNames: _.uniq(value.map(v => v.countryNames)),
    homeSiteNames: _.uniq(value.map(v => v.homesiteName)),
    siteNames: _.uniq(value.map(v => v.siteName)),
    crops: _.uniq(value.map(v => v.crop)),
    experimentNames: _.uniq(value.map(v => v.experimentName)),
    harvestTypes: _.uniq(value.map(v => v.harvestType)),
    seasons: _.uniq(value.map(v => v.season)),
    trialTypes: _.uniq(value.map(v => v.trialType)),
    growingYears: _.uniq(value.map(v => v.growingYear)),
  }
  return result
}

exports.rollUpVisualizaion = (value, type) => {
  console.log('rollUpVisualizaion value: ', value[0])
  switch (type) {
    case type === 'PlannedPlanted':
      console.log('Planned Planted Record')
      break
    case type === 'PlantedDate':
      console.log('Planted Date Record')
      break
    default:
      break
  }
}

exports.rollUpCollection = (items, key, value, config) => {
  const filteredItems = items.filter((f) => f[key] === value)
  const rolledUpItem = {}
  Object.keys(config).forEach(k => {
    switch (config[k]) {
      case 'sum':
        rolledUpItem[k] = _.sumBy(filteredItems, i => i[k])
        break
      case 'avg':
        rolledUpItem[k] = _.meanBy(filteredItems, i => i[k])
        break
      default:
        break
    }
  })
  return rolledUpItem
}

exports.rollUpPlannedPlanteds = (items, key, value, config) => {
  const rollUpItem = this.rollUpCollection(items, key, value, config)
  rollUpItem.percentagePlanted = rollUpItem.plantedCount / rollUpItem.plannedCount
  return rollUpItem
}
