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
export const QUERY_PATIENTCATEGORIES = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:patientCategories(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
      code
      message
      pages
      records
      page
      data{
        code
        name
        _id
        type
      }
    }
  }
`

export const MUTATION_SAVE_PATIENTCATEGORY = gql`
mutation($data:PatientCategoryInput){
  response:savePatientCategory(data:$data){
    code
    message
  }
}
`

export const MUTATION_DELETE_PATIENTCATEGORY = gql`
mutation($_id:String!){
  response:removePatientCategory(_id:$_id){
    code
    message
  }
}
`
