import gql from 'graphql-tag';

export const IMPORT_ACCOUNTS = gql`
mutation($data:[AccountInput]){
  response:importAccounts(data:$data){
    code
    message
    data
  }
}
`
export const QUERY_NATIONS = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:nations(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
      code
      message
      pages
      records
      page
      data{
        code
        name
        _id
      }
    }
  }
`

export const MUTATION_SAVE_NATION = gql`
mutation($data:NationInput){
  response:saveNation(data:$data){
    code
    message
  }
}
`

export const MUTATION_DELETE_NATION = gql`
mutation($_id:String!){
  response:removeNation(_id:$_id){
    code
    message
  }
}
`
