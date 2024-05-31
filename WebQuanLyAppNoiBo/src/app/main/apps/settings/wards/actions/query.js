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
{
    response:districts{
      code
      message
      data{
        _id
        name
        province{
          name
        }
        code
      }
    }
  }
`
export const QUERY_WARDS= gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:wards(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
        code
        message
        pages
        page
        records
        data{
          _id
          provinceCode
          districtCode
          district{
            name
          }
          name
          code
          province{
            name
          }
      }
  }
}
`

export const MUTATION_SAVE_WARD = gql`
mutation($data:WardInput){
  response:saveWard(data:$data){
    code
    message
  }
}
`

export const MUTATION_DELETE_WARD = gql`
mutation($_id:String!){
  response:removeWard(_id:$_id){
    code
    message
  }
}
`
