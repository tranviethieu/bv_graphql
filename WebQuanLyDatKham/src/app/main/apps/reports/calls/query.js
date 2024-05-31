import gql from "graphql-tag";//em import sai cho nay nhe

export const QUERY_CALLOUT_REPORT_BYAGENT = gql`
query(
  $begin: DateTime,
  $end: DateTime,
  $sipPhones: [String]
) {
  response: calloutReportDailyByAgent(
    begin: $begin
    end: $end
    sipPhones: $sipPhones
  ) {
    code
    message
    data {
      fullname
      call_productivity
      avg_duration
      min_duration
      max_duration
      misses
      served
      sipphone
      time_productivity
      total
      total_duration
      user_actions
    }
  }
}
`

export const QUERY_CALLIN_REPORT_BYAGENT = gql`
query(
  $begin: DateTime,
  $end: DateTime,
  $sipPhones: [String]
) {
  response: callinReportDailyByAgent(
    begin: $begin
    end: $end
    sipPhones: $sipPhones
  ) {
    code
    message
    data {
      fullname
      call_productivity
      avg_duration
      min_duration
      max_duration
      misses
      served
      sipphone
      time_productivity
      total
      total_duration
      user_actions
    }
  }
}
`

export const QUERY_CALLIN_REPORT_BYRINGGROUP = gql`
query(
  $begin: DateTime,
  $end: DateTime,
  $ringGroups: [String]
) {
  response: callinReportDailyByRingGroup(
    begin: $begin
    end: $end
    ringGroups: $ringGroups
  ) {
    code
    message
    data {
      fullname
      call_productivity
      avg_duration
      min_duration
      max_duration
      misses
      served
      sipphone
      time_productivity
      total
      total_duration
      user_actions
    }
  }
}
`

export const QUERY_RINGGROUPS = gql`
query ringGroups {
  response: ringGroups {
    code
    message
    data {
      _id
      name
      phoneCode
      createdTime
    }
  }
}
`

export const QUERY_GET_ACCOUNTS = gql`
query(
  $filtered: [FilteredInput]
  $sorted: [SortedInput]
  $page: Int
  $pageSize: Int
) {
  response: accounts(
    filtered: $filtered
    sorted: $sorted
    page: $page
    pageSize: $pageSize
  ) {
    code
    message
    data {
      _id
      base{
        name
        fullName
        address
        gender
      }
      sipPhone
    }
  }
}
`
