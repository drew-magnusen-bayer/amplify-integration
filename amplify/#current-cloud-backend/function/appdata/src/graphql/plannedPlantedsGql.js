const gql = require('graphql-tag')

exports.updateRegion = gql`
mutation CreatePlannedPlanted(
  $input: CreatePlannedPlantedInput!
  $condition: ModelPlannedPlantedConditionInput
) {
  createPlannedPlanted(input: $input, condition: $condition) {
    id
    plannedCount
    plantedCount
    percentagePlanted
    regionID
    countryID
    homesiteID
    createdAt
    updatedAt
  }
}
`

exports.updateRegion = gql`
mutation UpdatePlannedPlanted(
  $input: UpdatePlannedPlantedInput!
  $condition: ModelPlannedPlantedConditionInput
) {
  updatePlannedPlanted(input: $input, condition: $condition) {
    id
    plannedCount
    plantedCount
    percentagePlanted
    regionID
    countryID
    homesiteID
    createdAt
    updatedAt
  }
}
`

exports.listPlannedPlanteds = gql`
query ListPlannedPlanteds(
  $filter: ModelPlannedPlantedFilterInput
  $limit: Int
  $nextToken: String
) {
  listPlannedPlanteds(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      plannedCount
      plantedCount
      percentagePlanted
      regionID
      countryID
      homesiteID
      createdAt
      updatedAt
    }
    nextToken
  }
}
`
