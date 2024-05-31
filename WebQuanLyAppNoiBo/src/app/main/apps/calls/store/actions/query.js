import gql from 'graphql-tag';



export const QUERY_CALL_INS = gql`
query ($page:Int,$pageSize:Int,$filtered:[FilteredInput]){
    response:callLogins(filtered:$filtered,sorted:[{id:"calldate",desc:true}],page:$page,pageSize:$pageSize){
      code
      records
      pages
      page
      message
      data{
        _id
        callid
        calldate
        src
        dst
        phonecode
        phonenumber
        lastapp
        recordingfile
        duration
        timestamp
        channel
        dcontext
        disposition
        account{
          base{
            fullName
          }
        }
        user{
          fullName
        }
        appointments_num
      }
    }
  }
`
export const QUERY_CALL_OUTS = gql`
query ($page:Int,$pageSize:Int,$filtered:[FilteredInput]){
    response:callLogouts(filtered:$filtered,sorted:[{id:"calldate",desc:true}],page:$page,pageSize:$pageSize){
      code
      records
      pages
      message
      data{
        _id
        callid
        calldate
        src
        dst
        phonecode
        phonenumber
        lastapp
        disposition
        recordingfile
        duration
        timestamp
        channel
        dcontext
        campaignId
        campaign{
          name
        }
        account{
          base{
            fullName
          }
        }
        user{
          fullName
        }
        appointments_num
      }
    }
  }
`
// truy vấn tất cả các chiến dịch
export const QUERY_CALL_CAMPAIGNS = gql`
query ($page:Int,$pageSize:Int,$filtered:[FilteredInput]){
    response:customerCampaigns(filtered:$filtered,sorted:[{id:"createdTime",desc:true}],page:$page,pageSize:$pageSize){
      code
      message
      data{
        _id
        createdTime
        direction
        endTime
        finished
        name
        owner{
          _id
          base{
            fullName
          }
        }
        ownerId
        phoneNumbers
        startTime
        description
        updatedTime
      }
    }
  }
`
export const QUERY_CALL_CAMPAIGN = gql`
query ($_id: String!){
    response:customerCampaign(_id: $_id){
      code
      message
      data{
        _id
        createdTime
        direction
        endTime
        finished
        name
        owner{
          _id
          base{
            fullName
          }
        }
        ownerId
        phoneNumbers
        startTime
        updatedTime
        description
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
        createdTime
        direction
        endTime
        finished
        name
        owner{
          _id
          base{
            fullName
          }
        }
        ownerId
        phoneNumbers
        startTime
        description
        updatedTime
      }
    }
  }
`
//Truy vấn danh sách chiến dịch được giao nhiệm vụ tới tôi
export const QUERY_MY_ASSIGNED_CALL_CAMPAIGNS = gql`
query ($page:Int,$pageSize:Int,$filtered:[FilteredInput]){
    response:myAssignedCustomerCampaigns(filtered:$filtered,sorted:[{id:"createdTime",desc:true}],page:$page,pageSize:$pageSize){
      code
      message
      data{
        _id
        createdTime
        direction
        endTime
        finished
        name
        owner{
          _id
          base{
            fullName
          }
        }
        ownerId
        phoneNumbers
        startTime
        description
        updatedTime
      }
    }
  }
`
export const MUTATION_SAVE_CAMPAIGN = gql`
mutation($data: CustomerCampaignInput ){
    response: saveCustomerCampaign(data: $data){
        code
        message
    }
}
`
export const MUTATION_REMOVE_CAMPAIGN = gql`
mutation($_id: String!){
    response: removeCustomerCampaign(_id: $_id){
        code
        message
    }
}
`
export const MUTATION_UPDATE_STATE_CAMPAIGN = gql`
mutation($_id: String!, $finished: Boolean){
    response: updateCustomerCampaignState(_id: $_id, finished: $finished){
        code
        message
    }
}
`
