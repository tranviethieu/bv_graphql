import gql from "graphql-tag";


//for survey dashboard
export const SURVEY_GENERAL_REPORT = gql`
    query($begin:DateTime, $end:DateTime, $surveyIds:[String]){
        response:survey_general_report(begin:$begin, end:$end, surveyIds:$surveyIds){
            code
            message
            data
        }
    }
`



///////
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
          fullName
        
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
          _id
          userName
          fullName
          address
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