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
{
    response:provinces{
      code
      message
      data{
        _id
        name
        code
      }
    }
  }
`

export const QUERY_DISTRICTS = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:districts(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
        code
        message
        pages
        page
        records
        data{
          _id
          provinceCode
          name
          code
          province{
            name
          }
      }
  }
}
`

export const MUTATION_SAVE_DISTRICT = gql`
mutation($data:DistrictInput){
  response:saveDistrict(data:$data){
    code
    message
  }
}
`

export const MUTATION_DELETE_DISTRICT = gql`
mutation($_id:String!){
  response:removeDistrict(_id:$_id){
    code
    message
  }
}
`
