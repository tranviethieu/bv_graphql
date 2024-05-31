
import gql from 'graphql-tag';


export const QUERY_MY_CALL_LOGS = gql`
query($filtered:[FilteredInput],$sorted:[SortedInput],$page:Int,$pageSize:Int){
  response:myCallLogs(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
    code
    message
    pages
    page
    records
    data{
      _id
      calldate
      callid
      channel
      createdTime
      dcontext
      recordingfile
      user{
        _id
        phoneNumber
        fullName
        birthDay
        gender
        work{
          code
          name
        }
        address
      }
      src
      dst
      disposition
      duration
      lastapp
      lastdata
      callin
    }

  }
}
`
