import gql from 'graphql-tag';

export const CHANGE_PASSWORD = gql`
mutation($old_password:String!,$new_password:String!){
    response:change_password(old_password:$old_password,new_password:$new_password){
        code
        message
        data
    }
}
`