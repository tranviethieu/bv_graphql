import gql from 'graphql-tag';

export const QUERY_USER_BY_PHONE = gql`
query($phoneNumber:String!){
  response: users(filtered:[{id:"phoneNumber",value:$phoneNumber}],pageSize:1){
    code
    message
    data{
      _id
      fullName
      phoneNumber
    }
  }
}
`