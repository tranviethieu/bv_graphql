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
export const QUERY_CATEGORIES = gql`
{
    response:supplyCategorys{
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
export const QUERY_SUPPLIES = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:suppliess(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
      code
      message
      pages
      records
      page
      data{
        code
        name
        _id
        categoryCode
        category{
          name
        }
        viewCode
        unit
        content
      }
    }
  }
`

export const MUTATION_SAVE_SUPPLY = gql`
mutation($data:SuppliesInput){
  response:saveSupplies(data:$data){
    code
    message
  }
}
`

export const MUTATION_DELETE_SUPPLY = gql`
mutation($_id:String!){
  response:removeSupplies(_id:$_id){
    code
    message
  }
}
`
