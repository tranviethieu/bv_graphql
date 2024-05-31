import gql from 'graphql-tag';

export const QUERY_SURVEY_GENERALREPORT = gql`
query($begin: DateTime = null, $end: DateTime = null){
  response: survey_general_report(begin:$begin,end:$end){
    code
    message
    data
  }
}
`
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
export const MUTATION_DISABLE_SURVEY = gql`
mutation($_id: String!){
    response: disableSurvey(_id: $_id){
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
mutation($phone: String!, $full_name: String!, $data: SurveyResultInput){
    response:submit_survey_result(phone: $phone, full_name: $full_name, data: $data){
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
        work{
          code
          name
        }
      }
    }
  }
`
export const QUERY_USER_SURVEY_HISTORY = gql`
    query($phone:String!)
    {
        response:survey_search_by_phone(phone:$phone)
        {
            code
            message
            page
            pages
            records
            data{
                _id
                answer_num
                createdTime
                modifier
                name
                title
                updatedTime
                questionIds
            }
        }
    }
`
export const QUERY_USER_BY_PHONE = gql`
    query($phone:String!)
    {
        response:userByPhone(phoneNumber:$phone){
            code
            message
            data
            {
                _id
                phoneNumber
                fullName
                email
                address
                birthDay
                gender
            }
        }
    }
`
export const QUERY_USERS_SEARCH_BY_SURVEY = gql`
query($begin:DateTime, $end:DateTime,$page: Int, $pageSize: Int, $sorted: [SortedInput], $filtered:[FilteredInput], $surveyIds:[String], $actionNumFiltered: [FilteredInput])
  {
   response:users_search_by_survey(begin: $begin, end: $end,surveyIds:$surveyIds, filtered:$filtered, sorted: $sorted, page: $page, pageSize: $pageSize)
    {
      code
      message
      page
      pages
      records
      data{
        _id
        phoneNumber
        fullName
        email
        address
        birthDay
        gender
        # action_num(filtered:[{id:"Data.SurveyId",value:"5e18245d2def0d03683fe6aa"}])
        action_num(filtered:$actionNumFiltered)
        last_action(action:SURVEY){
          _id
          action
          createdTime
          user{
            _id
            fullName
            phoneNumber
          }
          survey_result{
            surveyId
            survey{
              _id
              title
              name
              questionIds
              createdTime
            }
            data{
              data
              question{
                _id
                name
                title
                type
                createdTime
                require
                polls{
                  display
                  image
                  label
                  other
                  value
                }
                starNumb
                dataType
                hasOther
                instruction
              }
            }
          }

        }
      }
    }
  }
`
//biểu đồ cho survey detail
export const GET_SURVEY_FREQUENCE_DATA = gql`
    query($begin:DateTime, $end:DateTime, $surveyIds:[String], $rangeNumb:Int)
    {
        response:get_survey_frequence_data(surveyIds: $surveyIds, begin: $begin, end: $end, rangeNumb: $rangeNumb){
            code
            message
            data
        }
    }
`
//biểu đồ cho question
export const GET_QUESTIONS_ANALYSTIC_DATA = gql`
    query($quesids: [String]!, $begin:DateTime, $end:DateTime)
    {
        response:get_questions_analytic(quesids: $quesids, begin:$begin, end: $end)
        {
            code
            message
            data
        }
    }
`
export const QUERY_USER_ACTIONS_SEARCH_BY_SURVEY = gql`
query(
    $page: Int,
    $pageSize: Int,
    $sorted:[SortedInput],
    $filtered: [FilteredInput],
    $phone:String!,
  ){
    response:userActions_search_by_phone(
      phone:$phone,
      page: $page,
      pageSize:$pageSize,
      sorted: $sorted,
      filtered: $filtered,
    ){
    code
      message
      page
      pages
      records
      data{
        _id
        action
        data
        name
        survey_result{
          survey{
            _id
            name
            title
            createdTime
            questionIds
          }
          surveyId
          data{
            data
            question{
              _id
              name
              require
            }
          }
        }
        userId
        user{
          _id
          fullName
          phoneNumber
          email
          gender
          address
        }
      }
    }
  }
  `
export const GET_USER_ACTONS = gql`
  query($filtered:[FilteredInput],$sorted:[SortedInput],$page:Int,$pageSize:Int,$phone:String!){
    response: userActions_search_by_phone(filtered: $filtered, sorted: $sorted, page:$page, pageSize: $pageSize,phone:$phone)
        {
            code
            message
            page
            pages
            records
            data{
                _id
                action
                createdTime
                user{
                    _id
                    fullName
                    phoneNumber
                }
                survey_result{
                    surveyId
                    survey{
                        _id
                        title
                        name
                        questionIds
                        createdTime
                    }
                    data{
                        data
                        question{
                            _id
                            name
                            title
                            type
                            createdTime
                            require
                            polls{
                                display
                                image
                                label
                                other
                                value
                            }
                            starNumb
                            dataType
                            hasOther
                            instruction
                        }
                    }
                }
            }
        }
    }
  `
