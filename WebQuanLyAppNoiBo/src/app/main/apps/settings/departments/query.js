import gql from "graphql-tag";//em import sai cho nay nhe

export const QUERY_ROOT_DEPARTMENTS = gql`
{
  response:rootDepartments{
    code
    message
    data
  }
}
`
export const QUERY_DEPARTMENTS = gql`
query departments {
  response: departments {
    code
    message
    page
    pages
    records
    data {
      _id
      name
      description
      status
      code
      servingTimes{
        dayOfWeek
        maxProcess
        timeFrame
      }

    }
  }
}
`
export const QUERY_DEPARTMENT = gql`
query($_id: String!) {
  response: department(_id: $_id) {
    code
    message
    data {
      _id
      name
      code
      description
      status
      servingTimes{
        dayOfWeek
        maxProcess
        timeFrame
      }

    }
  }
}
`

export const MUTATION_SAVE_DEPARTMENT = gql`
mutation($data: DepartmentInput!) {
  response: saveDepartment(data: $data) {
    code
    message
    data {
     _id
      name
      description
      status
      code
      servingTimes{
        dayOfWeek
        maxProcess
        timeFrame
      }

    }
  }
}
`
export const MUTATION_REMOVE_DEPARTMENT = gql`
mutation($_id: String!) {
  response: removeDepartment(_id: $_id) {
    code
    message
  }
}
`
