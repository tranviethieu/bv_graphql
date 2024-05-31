import gql from 'graphql-tag';


export const QUERY_DEPARTMENTS = gql`
query departments {
  response: departments {
    code
    message
    data {
      _id
      name      
    }
  }
}
`

export const QUERY_REPORT_APPOINTMENT_BYDAY = gql`
query(
  $begin: DateTime,
  $end: DateTime,
  $departmentId: String
) {
  response: reportAppointmentByDay(
    begin: $begin
    end: $end
    departmentId: $departmentId
  ) {
    code
    message
    data {
      approves
      cancels
      date
      serves
      total
      waitings
    }
  }
}
`

export const QUERY_REPORT_APPOINTMENT_INDEX = gql`
query(
  $begin: DateTime,
  $end: DateTime,
  $departmentId: String,
) {
  response: reportAppointmentIndex(
    begin: $begin,
    end: $end,
    departmentId: $departmentId,
  ) {
    code
    message
    data
  }
}
`

export const QUERY_USERACTIONS = gql`
query($filtered:[FilteredInput],$sorted:[SortedInput],$page:Int,$pageSize:Int){
    response:userActions(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
      code
      message
      pages
      records
      page
      data{
        _id
        action
        createdTime
        data
        appointment{
          appointmentDate
          appointmentTime
          channel
          department{
            _id
            name
          }
          note
          state
        }
        modifier
        {
          _id
          account{
            base{
              fullName
            }
          }
        }
        user{
          _id
          fullName
          phoneNumber
          birthDay
        }
      }
    }
  }
`