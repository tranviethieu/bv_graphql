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
export const QUERY_MEDICALCATEGORIES = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:medicalServiceCategorys(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
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

export const MUTATION_SAVE_MEDICALCATEGORY = gql`
mutation($data:MedicalServiceCategoryInput){
  response:saveMedicalServiceCategory(data:$data){
    code
    message
  }
}
`

export const MUTATION_DELETE_MEDICALCATEGORY = gql`
mutation($_id:String!){
  response:removeMedicalServiceCategory(_id:$_id){
    code
    message
  }
}
`
