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
export const QUERY_SUPPLYCATEGORIES = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:supplyCategorys(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
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

export const MUTATION_SAVE_SUPPLYCATEGORY = gql`
mutation($data:SupplyCategoryInput){
  response:saveSupplyCategory(data:$data){
    code
    message
  }
}
`

export const MUTATION_DELETE_SUPPLYCATEGORY = gql`
mutation($_id:String!){
  response:removeSupplyCategory(_id:$_id){
    code
    message
  }
}
`
