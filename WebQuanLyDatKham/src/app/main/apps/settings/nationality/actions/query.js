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
export const QUERY_NATIONALITY = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:nationalitys(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
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

export const MUTATION_SAVE_NATIONALITY = gql`
mutation($data:NationalityInput){
  response:saveNationality(data:$data){
    code
    message
  }
}
`

export const MUTATION_DELETE_NATIONALITY = gql`
mutation($_id:String!){
  response:removeNationality(_id:$_id){
    code
    message
  }
}
`
