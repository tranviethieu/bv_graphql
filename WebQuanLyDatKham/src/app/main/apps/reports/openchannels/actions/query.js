import gql from 'graphql-tag';

export const GET_OPENCHANNEL_REPORT_INDEX = gql`
{
    response:report_integrated_user_index{
      code
      message
      data
    }
  }
`

export const GET_INTEGRAGED_USERS = gql`
query($filtered:[FilteredInput],$sorted:[SortedInput],$page:Int,$pageSize:Int){
  response:integratedUsers(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
    code
    message
    records
    pages
    data{
      _id
      avatar
      channel{
        name
      }
      gender
      name
      link
      uid
      phone_number
      recent_message{
        createdTime
        body{
          text
        }
      }
      createdTime
    }
  }
}
`