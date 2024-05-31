import gql from 'graphql-tag';
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
      appointment{
        channel
        departmentId
        department{
          name
        }
        appointmentDate
        appointmentTime
        createdTime
      }
      conclusion
      conclusioner{
        _id
        fullName
      }
      conclusionTime
      createdTime
      insuranceCode
      patientCode
      patient{
        _id
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
