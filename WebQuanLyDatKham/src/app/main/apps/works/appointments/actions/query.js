import gql from 'graphql-tag';
//chi goi cac appointment kham vao ngay hom nay va da duoc duyet, luc nay inputPatient chinh la patient trong his
export const GET_APPOINTMENTS = gql`
query($filtered:[FilteredInput],$sorted:[SortedInput],$page:Int,$pageSize:Int){
  response:appointments(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
    code
    message
    records
    pages
    data{
      _id
      appointmentDate
      appointmentTime
      code
      patientCode
      inputPatient{
        fullName
        phoneNumber
        birthDay
        birthYear
        gender
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
      }
      patient{
        _id
      }
      channel
      departmentId
      department{
        name
        code
      }
      note
      terminateReason
      state
      followByDoctor
      createdTime
      approver{
        code
        fullName
      }
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
