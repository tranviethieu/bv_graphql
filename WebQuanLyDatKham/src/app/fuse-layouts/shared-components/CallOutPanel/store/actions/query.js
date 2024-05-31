import gql from "graphql-tag"

export const QUERY_CALL_CAMPAIGNS = gql`
query ($page:Int,$pageSize:Int,$filtered:[FilteredInput]){
    response:myAssignedCustomerCampaigns(filtered:$filtered,sorted:[{id:"createdTime",desc:true}],page:$page,pageSize:$pageSize){
      code
      message
      data{
        _id
        name
      }
    }
  }
`
