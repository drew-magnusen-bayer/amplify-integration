const gql = require('graphql-tag')

exports.createCountry = gql`
mutation CreateCountry(
  $input: CreateCountryInput!
  $condition: ModelCountryConditionInput
) {
  createCountry(input: $input, condition: $condition) {
    id
    region
    country
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

exports.updateCountry = gql`
mutation UpdateCountry(
  $input: UpdateCountryInput!
  $condition: ModelCountryConditionInput
) {
  updateCountry(input: $input, condition: $condition) {
    id
    region
    country
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

exports.listCountrys = gql`
query ListCountrys(
  $filter: ModelCountryFilterInput
  $limit: Int
  $nextToken: String
) {
  listCountrys(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      region
      country
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
