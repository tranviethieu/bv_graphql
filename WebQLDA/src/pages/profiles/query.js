import gql from 'graphql-tag';

export const MUTATION_CHANGE_PASSWORD = gql`
mutation($oldpw:String!,$newpw:String!){
  response:changePassword(oldpw:$oldpw,newpw:$newpw){
    code
    message
  }
}
`

export const UPDATE_PROFILE = gql`
mutation($account:AccountInput!){
  response:updateProfile(account:$account){
    code
    message
  }
}
`
export const ME = gql`
{
    response:me{
      code
      message
      data{
        _id
        birthday
        address
        createdTime
        department
        {
          _id
          name
        }
        email
        userName
        fullName
        email
        gender
        avatar
        phoneNumber
        title
        roles{
          _id
          project{
            _id
            name
          }
          role
        }
      }
    }
  }
`