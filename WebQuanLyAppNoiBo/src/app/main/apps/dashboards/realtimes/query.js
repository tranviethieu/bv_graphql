import gql from "graphql-tag";//em import sai cho nay nhe

export const GET_APPOINTMENTS = gql`
query($filtered:[FilteredInput],$sorted:[SortedInput],$page:Int,$pageSize:Int){
  response:appointments(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
    code
    message
    data{
      _id
      appointmentDate
      appointmentTime
      patientCode
      patient{
        _id
        fullName
      }
      inputPatient{
        fullName
        phoneNumber
        birthDay
        birthYear
        address
        gender
        nation{
          code
          name
        }
        nationality{
          code
          name
        }
        district{
          code
          name
        }
        province{
          code
          name
        }
        ward{
          code
          name
        }
        street
        insuranceCode
        nationIdentification
      }
      channel
      departmentId
      department{
        name
        code
      }

      note
      state
      createdTime
      followByDoctor
    }
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
        patientCode
        hisCode
        fullName
        phoneNumber
        birthDay
      }
    }
  }
}
`

export const QUERY_REPORT_APPOINTMENT_INDEX = gql`
query(
  $begin: DateTime,
  $end: DateTime,
  $timeFrame: String,
) {
  response: reportAppointmentIndex(
    begin: $begin,
    end: $end,
    timeFrame: $timeFrame,
  ) {
    code
    message
    data
  }
}
`
export const QUERY_USERACTION = gql`
query($_id: String!) {
  response: userAction(_id: $_id) {
    code
    message
    data {
     _id
      action
      data
      modifier{
        _id
        accountId
        account{
          base{
            _id
            userName
            fullName
            address
          }
        }
      }
      userId
      user{
        _id
        fullName
        birthDay
        name
        address
        phoneNumber
      }
    }
  }
}
`

export const MUTATION_SAVE_USERACTION = gql`
mutation($data: UserActionInput!) {
  response: saveUserAction(data: $data) {
    code
    message
    data {
        _id
      action
      data
      modifier{
        _id
        accountId
        account{
          base{
            _id
            userName
            fullName
            address
          }
        }
      }
      userId
      user{
        _id
        fullName
        birthDay
        name
        address
        phoneNumber
      }
    }
  }
}
`
export const MUTATION_REMOVE_USERACTION = gql`
mutation($_id: String!) {
  response: removeUserAction(_id: $_id) {
    code
    message
  }
}
`
