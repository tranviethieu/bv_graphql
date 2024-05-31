import gql from 'graphql-tag';

export const QUERY_ACCOUNTS = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:accounts(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
        code
        message
        pages
        page
        records
        data{
          _id      
          score    
          department            
          base{
            code
            fullName
            userName
            address
            birthday
            gender
            phoneNumber
            email
            work
            isRoot
            name
            departmentId
            departmentName
          }
        }
      }
  }
`
export const QUERY_GET_RATTING = gql`
query getRatting($page: Int, $pageSize: Int, $sorted: [SortedInput], $filtered:[FilteredInput])
{
  response:rattings(page: $page, pageSize: $pageSize, sorted: $sorted, filtered: $filtered)
  {
    code
    message
    pages
    page
    records
    data{
      _id
      comment
      createdTime
      doctor{
        code
        name
      }
      name
      phoneNumber
      rattingTarget
      score
      targetCode
    }
  }
}
`