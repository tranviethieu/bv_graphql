import gql from 'graphql-tag'

//lấy tất cả accounts cho select tài khoản gửi tin nhắn
export const QUERY_ACCOUNTS = gql`
query{
    response:accounts{
        code
        message
        data{
          _id            
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
export const MUTATION_NOTIFY_SEND_ALL = gql`
mutation sendNotifyAll($data: NotificationQueueInput)
{
	response:send_notify_all(data: $data){
    code
    message
    data{
      _id
      actions
      appId
      title
    }
  }
}
`
export const MUTATION_NOTIFY_SEND_BY_USERIDS = gql`
mutation sendNotifyByUserIds( $userids : [String], $data: NotificationQueueInput)
{
	response:send_notify_multi_by_userid(userids: $userids,data: $data){
    code
    message
    data{
      _id
      actions
      appId
      title
    }
  }
}
`

export const QUERY_NOTIFICATION_QUEUES = gql`
query($page: Int, $pageSize: Int, $sorted: [SortedInput], $filtered:[FilteredInput])
{
   response:notification_queues(filtered:$filtered, sorted: $sorted, page: $page, pageSize: $pageSize)
    {
        code
        message
        page
        pages
        records
        data{
          _id
          actions
          appId
          badge
          body
          title
          createdTime
          data
          receiverId
          retry
          subtitle
        }
    }
}
`
export const QUERY_NOTIFICATION_SENDS = gql`
query($page: Int, $pageSize: Int, $sorted: [SortedInput], $filtered:[FilteredInput])
{
   response:notification_sents(filtered:$filtered, sorted: $sorted, page: $page, pageSize: $pageSize)
    {
        code
        message
        page
        pages
        records
        data{
          _id
          actions
          appId
          badge
          body
          title
          createdTime
          data
          receiverId
          retry
          subtitle
        }
    }
}
`