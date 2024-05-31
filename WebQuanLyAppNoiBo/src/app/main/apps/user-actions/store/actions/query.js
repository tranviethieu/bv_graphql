import gql from 'graphql-tag';
export const GET_APPOINTMENT_DETAIL = gql`
query($_id:String!){
    response:appointment(_id:$_id){
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
        user{
          hisCode
          fullName
          birthDay
          address
          ward{
            code
            name
          }
          province{
            code
            name
          }
          nation{
            code
            name
          }
          nationality{
            code
            name
          }
          street
          district{
            code
            name
          }
        }
        channel
        departmentId
        note
        state
        followByDoctor
        
      }
    }
  }
`
export const QUERY_USERACTIONS = gql`
query($filtered:[FilteredInput],$page:Int,$pageSize:Int){
    response:userActions(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:[{id: "createdTime", desc: true}]){
      code
      message
      pages
      records
      data{
        _id
        action
        createdTime
        appointment{
          appointmentDate
          appointmentTime
          channel
          department{
            _id
            name
          }
          departmentId
          note
          state
        }
        data
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
          address
          phoneNumber
          birthDay
        }
      }
    }
  }
`
export const QUERY_USERACTION = gql`
query($_id: String!){
    response:userAction(_id: $_id){
      code
      message
      data{
        _id
        action
        createdTime
        appointment{
          appointmentDate
          appointmentTime
          channel
          department{
            _id
            name
          }
          departmentId
          note
          state
        }
        data
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
          gender
          email
          work
          mariage
          patientCode
          hisCode
          _id
          fullName
          phoneNumber
          address
          birthDay
        }
      }
    }
  }
`
export const MUTATION_REMOVE_USERACTION = gql`
mutation($_id:String!){
    response:removeUserAction(_id:$_id){
        code
        message
    }
}
`

export const MUTATION_SAVE_USER = gql`
mutation($data:UserInput!){
  response:saveUser(data:$data){
    code
    message
    data{
      _id
    }
  }
}
`
export const QUERY_USER_BY_PHONE = gql`
query($phoneNumber:String!){
  response: users(filtered:[{id:"phoneNumber",value:$phoneNumber}],pageSize:1){
    code
    message
    data{
      _id
      fullName
      phoneNumber
      address
      name
      birthDay
      email
      mariage
      gender
      work{
        code
        name
      }
    }
  }
}
`
export const QUERY_DEPARTMENTS = gql`
query{
  response: departments {
    code
    message
    data {
      value: _id
      label: name
    }
  }
}
`
export const QUERY_DEPARTMENT = gql`
query($_id: String!) {
  response: department(_id: $_id) {
    code
    message
    data {
      _id
      name
      description
      servingTimes{
        dayOfWeek
        maxProcess
        timeFrame
      }
    }
  }
}
`
export const MUTATION_CHANGE_STATE_APPOINTMENT = gql`
mutation($_id: String!, $state: AppointmentState){
  response: changeAppointmentState(_id: $_id, state: $state){
    code
    message
  }
}
`
export const MUTATION_CHANGE_STATE_TICKET = gql`
mutation($_id: String!, $state: TicketState){
  response: changeTicketState(_id: $_id, state: $state){
    code
    message
  }
}
`
