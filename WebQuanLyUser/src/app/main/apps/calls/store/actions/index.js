import graphqlService from 'app/services/graphqlService';
import { QUERY_CALL_INS, QUERY_CALL_OUTS,QUERY_CALL_CAMPAIGNS, MUTATION_SAVE_CAMPAIGN, MUTATION_REMOVE_CAMPAIGN, MUTATION_UPDATE_STATE_CAMPAIGN, QUERY_CALL_CAMPAIGN, QUERY_MY_CALL_CAMPAIGNS, QUERY_MY_ASSIGNED_CALL_CAMPAIGNS } from './query';

export function getCallIns(variables, dispatch) {
    return graphqlService.query(QUERY_CALL_INS, variables, dispatch);
}

export function getCallOuts(variables, dispatch) {
    return graphqlService.query(QUERY_CALL_OUTS, variables, dispatch);
}
// tìm kiếm tất cả các callCampaign
export function getCallCampaigns(variables, dispatch){
  return graphqlService.query(QUERY_CALL_CAMPAIGNS, variables, dispatch);
}
// Truy vấn các callCampaign được tạo bởi tôi
export function getMyCallCampaigns(variables, dispatch){
  return graphqlService.query(QUERY_MY_CALL_CAMPAIGNS, variables, dispatch);
}
// Truy vấn các callCampaign tôi được giao nhiệm vụ
export function getMyAssignedCallCampaigns(variables, dispatch){
  return graphqlService.query(QUERY_MY_ASSIGNED_CALL_CAMPAIGNS, variables, dispatch);
}
export function getCallCampaign(_id, dispatch){
  return graphqlService.query(QUERY_CALL_CAMPAIGN, { _id }, dispatch);
}
export function saveCallCampaign(data, dispatch){
  return graphqlService.mutate(MUTATION_SAVE_CAMPAIGN, { data }, dispatch);
}
export function removeCallCampaign(_id, dispatch){
  return graphqlService.mutate(MUTATION_REMOVE_CAMPAIGN, { _id }, dispatch);
}
export function updateStateCampaign(_id, finished, dispatch){
  return graphqlService.mutate(MUTATION_UPDATE_STATE_CAMPAIGN, { _id, finished }, dispatch);
}
