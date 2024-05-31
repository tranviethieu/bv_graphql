import gql from "graphql-tag"

export const QUERY_MY_ACTIONS = gql`
  query($page: Int, $filtered: [FilteredInput], $pageSize: Int){
    response: myAccountActions(page: $page, pageSize: $pageSize, filtered: $filtered, sorted: [{ id: "createdTime", desc: true }]){
      code
      message
      pages
      page
      records
      data{
        _id
        accountId
        action
        actionId
        createdTime
        data
      }
    }
  }
`
export const QUERY_CALL_LOGS = gql`
query($filtered:[FilteredInput]){
  response:callLogs(page:0,pageSize:10,filtered:$filtered,sorted:[{id:"calldate",desc:true}]){
    code
    message
    pages
    page
    records
    data{
      _id
      calldate
      createdTime
      uniqueid
      account{
        base{
          fullName
        }
      }
      dcontext
    }

  }
}
`
