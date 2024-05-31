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
export const QUERY_PROVINCES = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:provinces(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
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

export const MUTATION_SAVE_PROVINCE = gql`
mutation($data:ProvinceInput){
  response:saveProvince(data:$data){
    code
    message
  }
}
`

export const MUTATION_DELETE_PROVINCE = gql`
mutation($_id:String!){
  response:removeProvince(_id:$_id){
    code
    message
  }
}
`
