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
    response:medicalServiceCategorys{
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
export const QUERY_MEDICALSERVICES = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:medicalServices(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
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
        serviceType
        viewCode
        hisId
        shortName
        min
        max
        unit
        info
        priceOfInsurance
        priceOfSelfService
        price
        isGroup
      }
    }
  }
`

export const MUTATION_SAVE_MEDICALSERVICE = gql`
mutation($data:MedicalServiceInput){
  response:saveMedicalService(data:$data){
    code
    message
  }
}
`

export const MUTATION_DELETE_MEDICALSERVICE = gql`
mutation($_id:String!){
  response:removeMedicalService(_id:$_id){
    code
    message
  }
}
`
