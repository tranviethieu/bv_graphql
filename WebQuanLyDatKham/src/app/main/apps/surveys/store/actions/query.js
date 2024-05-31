import gql from 'graphql-tag'

export const QUERY_GET_SURVEYS = gql`
query($filtered:[FilteredInput],$sorted:[SortedInput],$page:Int,$pageSize:Int){
    response: surveys(filtered: $filtered, sorted: $sorted, page:$page, pageSize: $pageSize){
        code
        message
        page
        pages
        records
        data{
            _id
            name
            questionIds
            title
            createdTime
            disable
            target
        }
    }
}
`
export const QUERY_GET_SURVEY = gql`
query($_id: String!){
    response: survey(_id: $_id){
        code
        message
        data{
            _id
            name
            questionIds
            title
            disable
            target
            questions{
                _id
                hasOther
                instruction
                name
                polls{
                    display
                    image
                    label
                    other
                    value
                }
                require
                starNumb
                title
                type
                userField
            }
        }
    }
}
`
export const MUTATION_SAVE_SURVEY = gql`
mutation($data: SurveyInput!, $questions: [QuestionInput]){
    response: saveSurvey(data: $data, questions: $questions){
        code
        message
    }
}
`
export const MUTATION_REMOVE_SURVEY = gql`
mutation($_id: String!){
    response: removeSurvey(_id: $_id){
        code
        message
    }
}
`
//mutation thực hiện khảo sát thay khách hàng
export const MUTATION_SUBMIT_SURVEY_RESULT = gql`
mutation($userId: String!, $data: SurveyResultInput){
    response: submitSurveyResult(userId: $userId, data: $data){
        code
        message
    }
}
`
//query lấy thông tin khách hàng nếu có ID
export const QUERY_GET_USERINFO = gql`
query($phoneNumber:String!){
    response: users(filtered:[{id:"phoneNumber",value:$phoneNumber}],pageSize:1){
      code
      message
      data{
        _id
        fullName
        address
        phoneNumber
        name
        birthDay
        email
        mariage
        gender
        work
      }
    }
  }
`
//mutation tạo khách hàng mới nếu không có id tồn tại (bắt buộc nhập 2 thông tin phoneNumber và fullName)
export const MUTATION_CREATE_USER = gql`
mutation($data: UserInput!){
    response: saveUser(data: $data){
        code
        message
        data{
            _id
        }
    }
}
`
