import gql from 'graphql-tag';
export const GET_MEDICAL_SESSION_DETAIL = gql`
query($_id:String!){
  response:medical_session(_id:$_id){
    code
    message
    data{
      _id
      code
      fileIds
      indications{
        createdTime
        service{
          name
        }
        service_detail{
          name
        }
        department{
          name
        }
        clinic{
          name
        }
        doctor{
          fullName
        }
        creator{
          fullName
        }
      }
      appointment{
        channel
        departmentId
        code
        department{
          name
        }
        appointmentDate
        appointmentTime
        createdTime
      }
      prescriptions{
        createdTime
        _id
        creator{
          fullName
        }
        drugs{
          _id
          amount
          code
          instruction
          name
          unit
        }
        images
      }
      conclusions{
        code
        name
      }
      createdTime
      insuranceCode
      department{
        code
        name
      }
      clinic{
        code
        name
      }
      patientInfo{
        _id
        patientCode
        fullName
        birthDay
        phoneNumber
        nationIdentification
        insuranceCode
        ward{
          name
        }
        province{
          name
        }
        district{
          name
        }
        nationality{
          name
        }
        street
        gender
      }
      process
      reason
      doctor{
        code
        name
      }
      sequence
      terminated
      terminateReason
    }
  }
}
`
//chi goi cac appointment kham vao ngay hom nay va da duoc duyet, luc nay inputPatient chinh la patient trong his
export const GET_MEDICAL_SESSIONS = gql`
query($filtered:[FilteredInput],$sorted:[SortedInput],$page:Int,$pageSize:Int){
  response:medical_sessions_following_doctor(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
    code
    message
    records
    pages
    data{
      _id
      code
      indications{
        _id
        code
        name
        state
      }
      createdTime
      appointment{
        channel
        code
        departmentId
        department{
          name
        }
        appointmentDate
        appointmentTime
        createdTime
      }
      conclusions{
        code
        name
      }
      createdTime
      insuranceCode
      department{
        code
        name
      }
      clinic{
        code
        name
      }
      patientInfo{
        _id
        patientCode
        fullName
        birthDay
        phoneNumber
        nationIdentification
        insuranceCode
        ward{
          name
        }
        province{
          name
        }
        district{
          name
        }
        nationality{
          name
        }
        street
        gender
      }
      process
      reason
      doctor{
        code
        name
      }
      sequence
      terminated
      terminateReason
    }
  }
}
`

export const GET_DEPARTMENTS = gql`
query{
  response: departments {
    code
    message
    data {
     _id
     name
     code
    }
  }
}
`
//CHuyển trạng thái phiếu khám từ chờ khám thành đang khám
export const UPDATE_MEDICAL_SESSION_WAITING = gql`
  mutation($code: String!){
    response: update_medical_session_waiting(code: $code){
      code
      message
    }
  }
`
export const UPDATE_MEDICAL_SESSION_CONCLUSION = gql`
  mutation($sessionId: String!, $data: CodeBaseInput){
    response: update_medical_session_conclusion(sessionId: $sessionId, data: $data){
      code
      message
      data{
        code
        name
      }
    }
  }
`
export const REMOVE_MEDICAL_SESSION_CONCLUSION = gql`
  mutation($sessionId: String!, $code: String!){
    response: remove_medical_conclusion(sessionId: $sessionId, code: $code){
      code
      message
    }
  }
`
export const UPDATE_IMAGES_MEDICAL_SESSION_CONCLUSION = gql`
  mutation($sessionId: String!, $fileIds: [String]) {
    response: update_medical_session_conclusion(sessionId: $sessionId, fileIds: $fileIds) {
      code
      message
    }
  }
`
export const CREATE_REAPPOINTMENT = gql`
  mutation($patientCode: String!, $appointmentDate: DateTime, $appointmentTime: String){
    response: create_reappointment(patientCode: $patientCode, appointmentDate: $appointmentDate, appointmentTime: $appointmentTime){
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
export const UPDATE_MEDICAL_SESSION_PRESCRIPTION = gql`
  mutation($data: PrescriptionInput){
    response: save_prescription(data: $data){
      code
      message
      data{
        createdTime
        creator{
          fullName
        }
        drugs{
          _id
          amount
          code
          instruction
          name
          unit
        }
        images
      }
    }
  }
`
export const REMOVE_MEDICAL_SESSION_PRESCRIPTION = gql`
  mutation($_id: String!){
    response: remove_prescription(_id: $_id){
      code
      message
    }
  }
`
