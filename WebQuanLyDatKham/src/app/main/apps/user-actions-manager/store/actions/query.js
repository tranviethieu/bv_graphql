import gql from 'graphql-tag';

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
        state
        data
        modifier
        {
          _id
          account{
            base{
              fullName
            }
          }
        }
        user{
          _id
          fullName
          address
          phoneNumber
          birthDay
        }
      }
    }
  }
`
export const QUERY_USERACTION = gql`
query($_id: String!){
    response:userAction(_id: $_id){
      code
      message
      data{
        _id
        action
        createdTime
        state
        data
        modifier
        {
          _id
          account{
            base{
              fullName
            }
          }
        }
        user{
          _id
          gender
          email
          work
          mariage
          fullName
          phoneNumber
          address
          birthDay
        }
      }
    }
  }
`
export const MUTATION_REMOVE_USERACTION = gql`
mutation($_id:String!){
    response:removeUserAction(_id:$_id){
        code
        message
    }
}
`
