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
export const QUERY_WORKS = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:works(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
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

export const MUTATION_SAVE_WORK = gql`
mutation($data:WorkInput){
  response:saveWork(data:$data){
    code
    message
  }
}
`

export const MUTATION_DELETE_WORK = gql`
mutation($_id:String!){
  response:removeWork(_id:$_id){
    code
    message
  }
}
`
