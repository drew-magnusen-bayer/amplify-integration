const gql = require('graphql-tag')

exports.createRegion = gql`
mutation CreateRegion(
  $input: CreateRegionInput!
  $condition: ModelRegionConditionInput
) {
  createRegion(input: $input, condition: $condition) {
    id
    region
    crop
    experimentName
    harvestType
    season
    siteName
    trialType
    growingYear
    createdAt
    updatedAt
    PlantedDates {
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
    PlannedPlanteds {
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
}
`

exports.updateRegion = gql`
mutation UpdateRegion(
  $input: UpdateRegionInput!
  $condition: ModelRegionConditionInput
) {
  updateRegion(input: $input, condition: $condition) {
    id
    region
    crop
    experimentName
    harvestType
    season
    siteName
    trialType
    growingYear
    createdAt
    updatedAt
    PlantedDates {
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
    PlannedPlanteds {
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
}
`

exports.listRegions = gql`
query ListRegions(
  $filter: ModelRegionFilterInput
  $limit: Int
  $nextToken: String
) {
  listRegions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      region
      crop
      experimentName
      harvestType
      season
      siteName
      trialType
      growingYear
      createdAt
      updatedAt
      PlantedDates {
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
      PlannedPlanteds {
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
    nextToken
  }
}
`
