import gql from 'graphql-tag';

export const CREATE_APPOINTMENT = gql`
mutation($data:AppointmentDataInput!, $serviceIds:[String]){
    response:createAppointment(data:$data,serviceIds:$serviceIds){
      code
      message
    }
  }
`
export const GET_TIMEFRAME = gql`
query($_id:String!,$date:DateTime!){
  response:department(_id:$_id){
    code
    message
    data{
      timeFrame:servtime_on_date(date:$date)
    }
  }
}
`

export const GET_DEPARTMENTS = gql`
{
  response:departments{
    code
    message
    data{
      _id
      name
      code
      enableTimeFrame
      servingTimes {
        dayOfWeek
        maxProcess
        timeFrame
      }
    }
  }
}
`

export const QUERY_SERVICE_DEMAND_LIST = gql`
{
  response:service_demand_online{
    code
    message
    data{
      _id
      name
      note
      parentId
      departments{
        _id
        code
        name
      }
    }
  }
}
`

export const UPDATE_APPOINTMENT_STATE = gql`
mutation($_id:String!,$state:AppointmentState,$terminateReason:String){
  response:changeAppointmentState(_id:$_id,state:$state,terminateReason:$terminateReason){
    code
    message
    data
  }
}
`

export const GET_PATIENT = gql`
query($patientCode:String!){
  response:patient(patientCode:$patientCode){
      code
      message
      data{
        _id
        fullName
        birthDay
        lastName
        firstName
        middleName
        birthYear
        phoneNumber
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
        gender
        street
        address
        nationIdentification
        insuranceCode
        patientCode
        work{
          code
          name
        }
      }
    }
}
`

export const UPDATE_PATIENT = gql`
mutation($data:UserInput!){
  response:update_patient(data:$data){
    code
    message
    data{
      patientCode
    }
  }
}
`

export const MERGE_PATIENTS = gql `
mutation sync_patient_info($info: PatientInfoInput!, $childIds: [String]!) {
  response:sync_patient_info(childIds: $childIds, info: $info) {
    code
    message
    data {
      _id
      patientCode
      fullName
      birthDay
      address
      phoneNumber
      insuranceCode
      syncType
    }
  }
}
`

export const Get_PATIENTS_TO_MERGE = gql `
query search_sync_patients($data: PatientInfoInput!) {
  response:search_sync_patients(data: $data) {
    code
    message
    data {
      data {
        _id
        patientCode
        fullName
        birthDay
        address
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
        work{
          code
          name
        }
        nationIdentification
        gender
        phoneNumber
        insuranceCode
        syncType
      }
      children {
        _id
        patientCode
        fullName
        birthDay
        address
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
        work{
          code
          name
        }
        nationIdentification
        gender
        phoneNumber
        insuranceCode
        syncMasterId
        syncType
        masterPatient {
          _id
          patientCode
          fullName
          birthDay
          address
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
          work{
            code
            name
          }
          nationIdentification
          gender
          phoneNumber
          insuranceCode
          syncMasterId
          syncType
        }
      }
    }
  }
}
`

export const SEARCH_HIS_PATIENTS = gql`
query($data:PatientInfoInput){
  response:search_his_patients(data:$data){
    code
    message
    records
    data{
      _id
      fullName
      lastName
      firstName
      middleName
      phoneNumber
      birthDay
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
      gender
      street
      address
      nationIdentification
      insuranceCode
      patientCode
      work{
        code
        name
      }
    }
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
      lastName
      firstName
      middleName
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
      nationIdentification
      insuranceCode
    }
  }
}
`

export const QUERY_USER_BY_PHONE = gql`
query($phoneNumber:String!){
    response:patient_by_phone(phoneNumber:$phoneNumber){
      code
      message
      data{
        fullName
        lastName
        firstName
        middleName
        _id
        address
        avatar
        patientCode
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
    response: user(_id:$_id){
      code
      message
      data{
        fullName
        lastName
        firstName
        middleName
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

export const QUERY_WARDS= gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:wards(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
        code
        message
        data{
          name
          code
          districtCode
      }
  }
}
`
export const QUERY_NATIONS = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:nations(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
      code
      message
      data{
        code
        name
      }
    }
  }
`
export const QUERY_WORKS = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:works(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
      code
      message
      data{
        code
        name
      }
    }
  }
`
export const QUERY_NATIONALITYS = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:nationalitys(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
      code
      message
      data{
        code
        name
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
        name
        code
        provinceCode
      }
    }
  }
`

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
          lastName
          firstName
          middleName
          fullName
          birthDay
          address
          phoneNumber
          gender
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
          work{
            code
            name
          }
          nationIdentification
          insuranceCode
        }
        inputPatient{
          lastName
          firstName
          middleName
          fullName
          birthDay
          address
          phoneNumber
          gender
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
          work{
            code
            name
          }
          nationIdentification
          insuranceCode
        }
        channel
        departmentId
        department{
          _id
          code
          name
        }
        serviceDemandId
        note
        state
        followByDoctor
        terminateReason
        sessions{
          _id
        }
      }
    }
  }
`
export const GET_MEDICAL_SESSIONS_BY_PATIENT = gql`
query ($code: String!) {
  response: medical_sessions_by_patient(code: $code) {
    code
    message
    data {
      _id
      code
      appointmentId
      patientInfo{
        patientCode
      }
      createdTime
      appointmentTime
      arrivalTime
      process
      prediagnosis
      reason
      serviceDemandId
      services {
        name
      }
      department {
        name
      }
    }
  }
}
`

export const QUERY_MEDICALSERVICES = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
  response:medicalServices(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
    code
    message
    data{
      code
      name
      _id
      categoryCode
      viewCode
      unit
      info
    }
  }
}
`

export const QUERY_INDICATION_BY_SESSION = gql`
query($code:String!){
  response:indication_by_session(code:$code){
    code
    message
    data {
      _id
      code
      name
    }
  }
}
`

export const CREATE_INDICATION = gql`
mutation($data: IndicationInput){
  response: create_indication(data: $data){
    code
    message
  }
}
`

export const CREATE_MEDICAL_SESSION = gql`
mutation($data:MedicalSessionInput){
  response:create_medical_session(data:$data){
    code
    message
    data
    {
      code
    }
  }
}
`