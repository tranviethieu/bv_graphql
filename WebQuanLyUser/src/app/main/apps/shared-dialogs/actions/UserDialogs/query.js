import gql from 'graphql-tag';
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
export const MUTATION_CHANGE_STATE = gql`
mutation($_id: String!, $state: AppointmentState){
  response: changeAppointmentState(_id: $_id, state: $state){
    code
    message
  }
}
`

export const MUTATION_SAVE_USER = gql`
mutation($data:UserInput!, $offline: Boolean){
  response:saveUser(data:$data, offline: $offline){
    code
    message
    data{
      fullName
      _id
      address
      avatar
      birthDay
      phoneNumber
      email
      gender
      mariage
      name
      work{
        code
        name
      }
    }
  }
}
`

export const QUERY_USER_HISTORY = gql`
query($filtered:[FilteredInput],$page:Int,$pageSize:Int){
  response:userActions(sorted:[{id:"updatedTime",desc:true}],filtered:$filtered,page:$page,pageSize:$pageSize){
  code
  message
  records
  pages
  data{
    _id
    createdTime
    survey_result{
      survey{
        _id
        name
        title
      }
      data{
        channel
        data
        questionId
        required
      }
    }
    appointment{
      appointmentDate
      appointmentTime
      channel
      department{
        name
        _id
      }
      state
      note
    }
    data
    updatedTime
    action
    modifier{
      _id
      action
      account{
        base{
          fullName
          avatar
        }
      }
    }
  }
}}
`

export const QUERY_USER_BY_PHONE = gql`
query($phoneNumber:String!){
    response:userByPhone(phoneNumber:$phoneNumber){
      code
      message
      data{
        fullName
        _id
        address
        avatar
        birthDay
        phoneNumber
        email
        gender
        mariage
        name
        work{
          code
          name
        }
        street
        nationIdentification
        nationality{
          code
          name
        }
        nation{
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
        district{
          code
          name
        }
        insuranceCode
      }
    }
  }
`
export const QUERY_USER_BY_ID = gql`
query($_id:String!){
    user(_id:$_id){
      code
      message
      data{
        fullName
        _id
        address
        avatar
        birthDay
        phoneNumber
        email
        gender
        mariage
        name
        work{
          code
          name
        }
        street
        nationIdentification
        nationality{
          code
          name
        }
        nation{
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
        district{
          code
          name
        }
        insuranceCode
      }
    }
  }
`
export const MUTATION_SAVE_USERACTION = gql`
mutation($data:AppointmentDataInput!, $userId: String!){
    response:createAppointment(data:$data, userId: $userId){
      code
      message
      data{
        appointmentDate
        appointmentTime
        channel
        departmentId
        note
        state
      }
    }
  }
`
export const MUTATION_CREATE_TICKET = gql`
mutation($userId: String!, $data: TicketInput!){
  response: createTicket(userId: $userId, data: $data){
    code
    message
  }
}
`
export const MUTATION_CREATE_PRESCRIPTION = gql`
mutation($userId: String!, $data: PrescriptionInput!){
  response: createPrescription(userId: $userId, data: $data){
    code
    message
  }
}
`
export const MUTATION_CREATE_EXAMINAION_RESULT = gql`
mutation($userId: String!, $data: ExaminationResultInput!){
  response: createExaminationResult(userId: $userId, data: $data){
    code
    message
  }
}
`
export const MUTATION_CREATE_SCAN_RESULT = gql`
mutation($userId: String!, $data: ScanResultInput!){
  response: createScanResult(userId: $userId, data: $data){
    code
    message
  }
}
`
export const MUTATION_CREATE_TEST_RESULT = gql`
mutation($userId: String!, $data: TestResultInput!){
  response: createTestResult(userId: $userId, data: $data){
    code
    message
  }
}
`
export const QUERY_NATIONS = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:nations(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
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
export const QUERY_NATIONALITYS = gql`
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
      data{
        _id
        name
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
        data{
          _id
          name
          code
      }
  }
}
`
