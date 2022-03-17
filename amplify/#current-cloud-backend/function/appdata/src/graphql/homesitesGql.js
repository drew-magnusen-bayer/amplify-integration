const gql = require('graphql-tag')

exports.createHomeSite = gql`
mutation CreateHomeSite(
  $input: CreateHomeSiteInput!
  $condition: ModelHomeSiteConditionInput
) {
  createHomeSite(input: $input, condition: $condition) {
    id
    region
    country
    homesiteName
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

exports.updateHomeSite = gql`
mutation UpdateHomeSite(
  $input: UpdateHomeSiteInput!
  $condition: ModelHomeSiteConditionInput
) {
  updateHomeSite(input: $input, condition: $condition) {
    id
    region
    country
    homesiteName
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

exports.listHomeSites = gql`
query ListHomeSites(
  $filter: ModelHomeSiteFilterInput
  $limit: Int
  $nextToken: String
) {
  listHomeSites(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      region
      country
      homesiteName
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
