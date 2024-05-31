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

export const QUERY_DEPARTMENTS = gql`
{
    response:departments{
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

export const QUERY_CLINICS = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:clinics(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
        code
        message
        pages
        page
        records
        data{
          _id
          departmentCode
          allowAppointment
          name
          code
          department{
            name
          }
      }
  }
}
`

export const MUTATION_SAVE_CLINIC = gql`
mutation($data:ClinicInput){
  response:saveClinic(data:$data){
    code
    message
  }
}
`

export const MUTATION_DELETE_CLINIC = gql`
mutation($_id:String!){
  response:removeClinic(_id:$_id){
    code
    message
  }
}
`
