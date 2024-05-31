import gql from "graphql-tag";//em import sai cho nay nhe

export const QUERY_RINGGROUPS = gql`
query ringGroups {
  response: ringGroups {
    code
    message
    pages
    page
    records
    data {
      _id
      name
      phoneCode
      createdTime
    }
  }
}
`
export const QUERY_RINGGROUP = gql`
query($_id: String!) {
  response: ringGroup(_id: $_id) {
    code
    message
    data {
      _id
      name
      phoneCode
      createdTime
    }
  }
}
`

export const MUTATION_SAVE_RINGGROUP = gql`
mutation($data: RingGroupInput!) {
  response: saveRingGroup(data: $data) {
    code
    message
    data {
      _id
      name
      phoneCode
      createdTime
    }
  }
}
`
export const MUTATION_REMOVE_RINGGROUP = gql`
mutation($_id: String!) {
  response: removeRingGroup(_id: $_id) {
    code
    message
  }
}
`
