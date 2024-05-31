import gql from "graphql-tag";//em import sai cho nay nhe


export const QUERY_SMS_REPORT_BYPHONE = gql`
query(
  $begin: DateTime,
  $end: DateTime,
  $page: Int,
  $pageSize: Int,
  $key: String
) {
  response: smsReportByPhone(
    begin: $begin
    end: $end
    page: $page
    pageSize: $pageSize
    key: $key
  ) {
    code
    message
    pages
    page
    records
    data
  }
}
`

export const QUERY_SMS_QUEUES = gql`
query(
  $filtered: [FilteredInput]
  $sorted: [SortedInput]
  $page: Int
  $pageSize: Int
) {
  response: smsQueues(
    page: $page
    pageSize: $pageSize
    filtered: $filtered
    sorted: $sorted
  ) {
    code
    message
    pages
    records
    data {
    	_id
      account_id
      campaign_id
      createdTime
      last_error
      last_update
      message
      phone_number
      provider
      retry_num
      sign
      state
      telco
    }
  }
}
`

export const QUERY_SMS_HISTORY = gql`
query(
  $filtered: [FilteredInput]
  $sorted: [SortedInput]
  $page: Int
  $pageSize: Int
) {
  response: smsLogs(
    page: $page
    pageSize: $pageSize
    filtered: $filtered
    sorted: $sorted
  ) {
    code
    message
    pages
    page
    records
    data {
    	_id
      account_id
      campaign_id
      createdTime
      last_error
      last_update
      message
      phone_number
      provider
      retry_num
      sign
      state
      telco
    }
  }
}
`
export const QUERY_SMS_REPORTBYINDEX = gql`
query($begin: DateTime, $end: DateTime) {
  response: smsReportIndex(begin: $begin, end: $end) {
    code
    message
    data
  }
}
`

export const MUTATION_SEND_SMS = gql`
mutation($phone_number: String!, $message: String!, $campaign_id: String!) {
  response: sendSms(phone_number: $phone_number, message: $message, campaign_id: $campaign_id) {
    code
    message
    data
  }
}
`
export const MUTATION_SEND_SMSMULTI = gql`
mutation($phone_numbers: [String]!, $message: String!, $campaign_id: String!) {
  response: sendSmsMulti(phone_numbers: $phone_numbers, message: $message, campaign_id: $campaign_id) {
    code
    message
    data
  }
}
`

export const QUERY_SMSCAMPAIGNS = gql`
query(
  $filtered: [FilteredInput]
  $sorted: [SortedInput]
  $page: Int
  $pageSize: Int
) {
  response: smsCampaigns(
    page: $page
    pageSize: $pageSize
    filtered: $filtered
    sorted: $sorted
  ) {
    code
    message
    pages
    page
    records
    data {
      _id
      name
      description
      content
      priority
      createdTime
    }
  }
}
`
export const QUERY_SMSCAMPAIGN = gql`
query($_id: String!) {
  response: smsCampaign(_id: $_id) {
    code
    message
    data {
      _id
      name
      content
      description
      priority
    }
  }
}
`

export const MUTATION_SAVE_SMSCAMPAIGN = gql`
mutation($data: SmsCampaignInput !) {
  response: saveSmsCampaign(data: $data) {
    code
    message
    data {
    	_id
      name
      description
      priority
      createdTime
    }
  }
}
`
export const MUTATION_REMOVE_SMSCAMPAIGN = gql`
mutation($_id: String!) {
  response: removeSmsCampaign(_id: $_id) {
    code
    message
  }
}
`
