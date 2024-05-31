import gql from 'graphql-tag';

//Danh sách tất cả các công việc (Admin quản lý)
export const QUERY_ALL_JOBS = gql`
query ($page:Int,$pageSize:Int,$filtered:[FilteredInput]){
    response:job_assigments(filtered:$filtered,sorted:[{id:"createdTime",desc:true}],page:$page,pageSize:$pageSize){
      code
      records
      pages
      page
      message
      data{
        _id
        comments
        members{
          _id
          name
          type
        }
        completeTime
        createdTime
        deathline
        description
        linkedCampaign{
          _id
          link
          type
        }
        customerCampaign{
          name
          _id
          phoneNumbers
        }
        name
        owner{
          base{
            fullName
          }
        }
        state
        ownerId
        process
        startTime
      }
    }
  }
`
//Danh sách giao việc tạo bởi tôi
export const QUERY_JOBS_BY_ME = gql`
query ($page:Int,$pageSize:Int,$filtered:[FilteredInput]){
    response:jobs_assigned_by_me(filtered:$filtered,sorted:[{id:"createdTime",desc:true}],page:$page,pageSize:$pageSize){
      code
      records
      pages
      page
      message
      data{
        _id
        comments
        members{
          _id
          name
          type
        }
        completeTime
        createdTime
        deathline
        description
        linkedCampaign{
          _id
          link
          type
        }
        customerCampaign{
          name
          _id
          phoneNumbers
        }
        name
        owner{
          base{
            fullName
          }
        }
        state
        ownerId
        process
        startTime
      }
    }
  }
`
//Danh sách công việc được giao cho tôi
export const QUERY_JOBS_TO_ME = gql`
query ($page:Int,$pageSize:Int,$filtered:[FilteredInput]){
    response:jobs_assigned_to_me(filtered:$filtered,sorted:[{id:"createdTime",desc:true}],page:$page,pageSize:$pageSize){
      code
      records
      pages
      page
      message
      data{
        _id
        comments
        completeTime
        members{
          _id
          name
          type
        }
        createdTime
        deathline
        description
        linkedCampaign{
          _id
          link
          type
        }
        customerCampaign{
          name
          _id
          phoneNumbers
        }
        name
        owner{
          base{
            fullName
          }
        }
        state
        ownerId
        process
        startTime
      }
    }
  }
`
// Chi tiết công việc
export const QUERY_JOB_DETAIL = gql`
query ($_id: String!){
    response:job_assignment(_id: $_id){
      code
      message
      data{
        _id
        comments
        completeTime
        createdTime
        deathline
        description
        linkedCampaign{
          _id
          link
          type
        }
        members{
          _id
          name
          type
        }
        customerCampaign{
          name
          _id
          phoneNumbers
        }
        name
        owner{
          base{
            fullName
          }
        }
        state
        ownerId
        process
        startTime
      }
    }
  }
`
//Truy vấn danh sách chiến dịch được tạo bởi tôi
export const QUERY_MY_CALL_CAMPAIGNS = gql`
query ($page:Int,$pageSize:Int,$filtered:[FilteredInput]){
    response:myAssigningCustomerCampaigns(filtered:$filtered,sorted:[{id:"createdTime",desc:true}],page:$page,pageSize:$pageSize){
      code
      message
      data{
        _id
        name
      }
    }
  }
`
export const QUERY_CALL_CAMPAIGN = gql`
query($_id: String!){
    response: customerCampaign(_id: $_id){
        code
        message
        data{
          _id
          name
          startTime
          endTime
          phoneNumbers
        }
    }
}
`
// Danh sách nhân viên của tôi phục vụ việc giao việc
export const QUERY_MY_STAFF = gql `
query{
  response: myStaffAccounts{
    code
    message
    data{
      _id
      base{
        fullName
      }
    }
  }
}
`
// Lưu thông tin công việc giao bởi tôi qua campaignID
export const MUTATION_SAVE_JOB_CAMPAIGN = gql`
mutation($campaignId: String!, $members: [AssignmentMemberInput]!, $jobId: String){
    response: assign_job_for_customer_campaign(campaignId: $campaignId, members: $members, jobId: $jobId){
        code
        message
    }
}
`
// Lưu thông tin công việc giao bởi tôi tự tạo mới
export const MUTATION_SAVE_JOB_NEW = gql`
mutation($data: CustomerCampaignInput ){
    response: saveCustomerCampaign(data: $data){
        code
        message
    }
}
`
//Cập nhật trạng thái công việc
export const MUTATION_UPDATE_STATE_JOB = gql`
mutation($_id: String!, $state: JobAssignmentState ){
    response: update_job_state(_id: $_id, state: $state){
        code
        message
    }
}
`
//Cập nhật tiến trình công việc
export const MUTATION_UPDATE_PROCESS_JOB = gql`
mutation($_id: String!, $process: Int ){
    response: update_job_process(_id: $_id, process: $process){
        code
        message
    }
}
`
//Hủy công việc
export const MUTATION_TERMINATE_JOB = gql`
  mutation($_id: String!){
    response: terminateJobAssignment(_id: $_id){
      code
      message
    }
  }
`
// Tạo mới/ Chỉnh sửa thông tin công việc
export const MUTATION_SAVE_JOB = gql`
mutation($data: JobAssignmentInput ){
    response: saveJobAssignment(data: $data){
        code
        message
    }
}
`
// remove member của công việc
export const MUTATION_REMOVE_MEMBER = gql`
  mutation($_id: String!, $accountIds: [String]!){
    response: remove_member_from_assigned_job(_id: $_id, accountIds: $accountIds){
      code
      message
    }
  }
`
// theem member của công việc
export const MUTATION_ADD_MEMBER = gql`
  mutation($_id: String!, $members: [AssignmentMemberInput]!){
    response: add_member_from_assigned_job(_id: $_id, members: $members){
      code
      message
    }
  }
`
