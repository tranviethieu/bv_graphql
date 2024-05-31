import gql from "graphql-tag";//em import sai cho nay nhe

export const QUERY_REPORT_APPOINTMENT_BYDAY = gql`
query(
  $begin: DateTime,
  $end: DateTime,
  $departmentId: String
) {
  response: reportAppointmentByDay(
    begin: $begin
    end: $end
    departmentId: $departmentId
  ) {
    code
    message
    data {
      approves
      cancels
      date
      serves
      total
      waitings
    }
  }
}
`

export const QUERY_REPORT_APPOINTMENT_INDEX = gql`
query(
  $begin: DateTime,
  $end: DateTime,
  $timeFrame: String,
) {
  response: reportAppointmentIndex(
    begin: $begin,
    end: $end,
    timeFrame: $timeFrame,
  ) {
    code
    message
    data
  }
}
`

export const QUERY_DEPARTMENTS = gql`
query departments {
  response: departments {
    code
    message
    data {
      _id
      name
      description
      status
      servingTimes{
        dayOfWeek
        maxProcess
        timeFrame
      }
    }
  }
}
`

export const QUERY_USERACTIONS = gql`
query($filtered:[FilteredInput],$sorted:[SortedInput],$page:Int,$pageSize:Int){
    response:userActions(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
      code
      message
      pages
      records
      page
      data{
        _id
        action
        createdTime
        data
        appointment{
          appointmentDate
          appointmentTime
          channel
          department{
            _id
            name
          }
          note
          state
        }
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
          phoneNumber
          birthDay
        }
      }
    }
  }
`

export const QUERY_USERACTIONS_SURVEY = gql`
query($filtered:[FilteredInput],$sorted:[SortedInput],$page:Int,$pageSize:Int){
  response:userActions(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
    code
    message
    pages
    records
    data{
      _id
      action
      survey_result{
        surveyId
        survey{
          _id
          name
        }
        data{
          channel
          data
          questionId
          question{
            name
            require
            starNumb
            polls{
              display
              image
              value
              label
            }
            title
            type
          }
        }
      }
      createdTime
      user{
        _id
        fullName
        phoneNumber
        birthDay
      }
    }
  }
}
`

// Báo cáo tổng quát tất cả các công việc theo khoảng thời gian
export const QUERY_JOB_GENERALREPORT = gql `
query($begin: DateTime = null, $end: DateTime = null, $ownerIds: [String] = null, $memberIds: [String] = null, $campaignIds: [String] = null){
  response: job_assignment_general_report(begin: $begin, end: $end, ownerIds: $ownerIds, memberIds: $memberIds, campaignIds: $campaignIds){
    code
    message
    data
  }
}
`
// Báo cáo tổng quát tất cả các công việc theo mốc thời gian
export const QUERY_JOB_GENERALREPORT_DETAIL = gql `
query($time: DateTime = null, $ownerIds: [String] = null, $memberIds: [String] = null, $campaignIds: [String] = null){
  response: job_assignment_detail_report(time: $time, ownerIds: $ownerIds, memberIds: $memberIds, campaignIds: $campaignIds){
    code
    message
    data
  }
}
`
//Báo cáo tất cả công việc theo khoảng thời gian (trả về 1 mảng để hiển thị lên line Data)
//Báo cáo công việc của cá nhân theo khoảng thời gian (trả về 1 mảng để hiển thị lên line Data)
// Báo cáo tổng quát công việc của cá nhân người đăng nhập theo khoảng thời gian
export const QUERY_JOB_SELFREPORT = gql `
query($begin: DateTime = null, $end: DateTime = null, $campaignIds: [String] = null){
  response: job_assignment_general_self_report(begin: $begin, end: $end, campaignIds: $campaignIds){
    code
    message
    data
  }
}
`
// Báo cáo tổng quát của cá nhân người đăng nhập theo mốc thời gian
export const QUERY_JOB_SELFREPORT_DETAIL = gql `
query($time: DateTime = null, $campaignIds: [String] = null){
  response: job_assignment_detail_self_report(time: $time, campaignIds: $campaignIds){
    code
    message
    data
  }
}
`
