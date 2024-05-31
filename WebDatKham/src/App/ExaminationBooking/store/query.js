import gql from 'graphql-tag'

export const GET_PROVINCES = gql`
{
  response:provinces{
    code
    message
    data{
      code
      name
    }
  }
}
`
export const GET_DISTRICTS = gql`
query($provinceCode:String!){
  response:districts(provinceCode:$provinceCode){
    code
    message
    data{
      code
      name
    }
  }
}
`
export const GET_WARDS = gql`
query($districtCode:String!){
  response:wards(districtCode:$districtCode){
    code
    message
    data{
      code
      name
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
      price
      isInactive
      departments{
        _id
        code
        name
      }
    }
  }
}
`

export const QUERY_SERVICE_DEMAND = gql`
query($parentId:String){
  response:service_demand_by_parent(parentId:$parentId){
    code
    message
    data{
      _id
      name
      note
      parentId
      price
      isInactive
      departments{
        _id
        code
        name
      }
    }
  }
}
`

// export const QUERY_SERVICE_DEMAND = gql`
// {
//   response:service_demand_online_graph{
//     code
//     message
//     data{
//       _id
//       name
//       fullName
//       note
//       departments{
//         _id
//         code
//         name
//       }
//       children{
//         _id
//         name
//         fullName
//         note
//         departments{
//           _id
//           code
//           name
//         }
//         children{
//           _id
//           name
//           fullName
//           note
//           departments{
//             _id
//             code
//             name
//           }
//         }
//       }
//     }
//   }
// }
// `

//FOR GET DEPARTMENTS
export const QUERY_GET_DEPARTMENTS = gql`
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

export const QUERY_GET_TIME_FRAMES = gql`
query getTimeFrame($_id: String!, $date: DateTime)
{
  response:department(_id:$_id)
  {
    code
    message
    data{
    servtime_on_date(date:$date)
    }
  }
}
`
//FOR CREATE APPOINMENT UN AUTHORIZE
export const MUTATION_CREATE_APPOINMENT_UNAUTHORIZE = gql`
mutation createApoinmentUnauthorize($data: AppointmentDataInput!, $paymentMethod: String)
{
  response:create_appointment_unauthorize(data: $data, paymentMethod: $paymentMethod)
  {
    code
    message
    data
  }
}
`
export const QUERY_NATIONS = gql`
query{
    response:nations{
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
query{
    response:nationalities{
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
query{
    response:works{
      code
      message
      data{
        code
        name
      }
    }
  }
`
//new update: them query lấy danh sách bác sĩ trực để đặt khám
export const QUERY_SHIFT_DOCTORS = gql`
query getShiftDoctor($departmentId: String!, $date: DateTime!)
{
  response:shiftDoctors(departmentId: $departmentId, date: $date)
  {
    code
    message
    data
    {
      _id
      base{
        fullName
        code
        departmentName
      }
    }
  }
}
`
export const QUERY_BOOKING = gql`
query ($sessionId: String!, $url: String!) {
  response:get_booking_appointment(sessionId: $sessionId, url: $url) {
    code
    message
    data {
      _id
      extraData
    }
  }
}

`