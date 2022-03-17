const gql = require('graphql-tag')

exports.listPlantedDates = gql`
    query ListPlantedDates(
    $filter: ModelPlantedDateFilterInput
    $limit: Int
    $nextToken: String
    ) {
    listPlantedDates(filter: $filter, limit: $limit, nextToken: $nextToken) {
        items {
        id
        plantedDate
        plantedPlot
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
exports.createPlantedDate = gql`
  mutation CreatePlantedDate(
    $input: CreatePlantedDateInput!
    $condition: ModelPlantedDateConditionInput
  ) {
    createPlantedDate(input: $input, condition: $condition) {
      id
      plantedDate
      plantedPlot
      regionID
      countryID
      homesiteID
      createdAt
      updatedAt
    }
  }
`
exports.updatePlantedDate = gql`
    mutation UpdatePlantedDate(
    $input: UpdatePlantedDateInput!
    $condition: ModelPlantedDateConditionInput
    ) {
    updatePlantedDate(input: $input, condition: $condition) {
        id
        plantedDate
        plantedPlot
        createdAt
        updatedAt
    }
}
`
exports.deletePlantedDate = gql`
  mutation DeletePlantedDate(
    $input: DeletePlantedDateInput!
    $condition: ModelPlantedDateConditionInput
  ) {
    deletePlantedDate(input: $input, condition: $condition) {
      id
      plantedDate
      plantedPlot
      regionID
      countryID
      homesiteID
      createdAt
      updatedAt
    }
  }
`
