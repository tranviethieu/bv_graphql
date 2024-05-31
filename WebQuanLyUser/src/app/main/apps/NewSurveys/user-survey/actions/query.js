import gql from 'graphql-tag';

export const SUBMIT_SURVEY_RESULT = gql`
mutation($data:SurveyResultInput,$phoneNumber:String!){
    response:submit_survey_result(data:$data,phoneNumber:$phoneNumber){
        code
        message
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