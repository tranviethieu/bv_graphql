import graphqlService from 'app/services/graphqlService';
import { QUERY_JOBS_BY_ME, QUERY_CALL_CAMPAIGN, QUERY_MY_CALL_CAMPAIGNS, QUERY_MY_STAFF, MUTATION_SAVE_JOB_CAMPAIGN, QUERY_JOBS_TO_ME, QUERY_JOB_DETAIL, MUTATION_UPDATE_STATE_JOB, MUTATION_UPDATE_PROCESS_JOB, MUTATION_TERMINATE_JOB, QUERY_ALL_JOBS, MUTATION_SAVE_JOB, MUTATION_REMOVE_MEMBER, MUTATION_ADD_MEMBER } from './query';

// Truy vấn tất cả các công việc
export function getAllJobs(variables, dispatch){
  return graphqlService.query(QUERY_ALL_JOBS, variables, dispatch);
}
// Truy vấn danh sách công việc được giao bởi tôi
export function getJobsByMe(variables, dispatch){
  return graphqlService.query(QUERY_JOBS_BY_ME, variables, dispatch);
}
//Danh sách công việc được giao cho tôi
export function getJobsToMe(variables, dispatch){
  return graphqlService.query(QUERY_JOBS_TO_ME, variables, dispatch);
}
export function getCallCampaign(_id, dispatch){
  return graphqlService.query(QUERY_CALL_CAMPAIGN, { _id }, dispatch);
}
//truy vấn các chiến dịch tạo ra bởi tôi phục vụ giao việc
export function getCallCampaigns(variables, dispatch){
  return graphqlService.query(QUERY_MY_CALL_CAMPAIGNS, variables, dispatch);
}
export function getMyStaff(dispatch){
  return graphqlService.query(QUERY_MY_STAFF, dispatch);
}
// Tạo công việc bởi tôi qua chiến dịch
export function saveJobCampaign(campaignId, members, jobId, dispatch){
  return graphqlService.mutate(MUTATION_SAVE_JOB_CAMPAIGN, { campaignId, members, jobId}, dispatch);
}
//Chi tiết công việc
export function getJobDetail(_id, dispatch){
  return graphqlService.query(QUERY_JOB_DETAIL, { _id }, dispatch);
}
//Cập nhật trạng thái công việc
export function updataStateJob(_id, state, dispatch){
  return graphqlService.mutate(MUTATION_UPDATE_STATE_JOB, { _id, state }, dispatch);
}
//Cập nhật tiến trình công việc
export function updataProcessJob(_id, process, dispatch){
  return graphqlService.mutate(MUTATION_UPDATE_PROCESS_JOB, { _id, process }, dispatch);
}
//Hủy công việc
export function terminateJob(_id, dispatch){
  return graphqlService.mutate(MUTATION_TERMINATE_JOB, { _id }, dispatch);
}
//Lưu công việc
export function saveJobAssiment(data, dispatch){
  return graphqlService.mutate(MUTATION_SAVE_JOB, { data }, dispatch);
}
//Bỏ 1 member trong công việc
export function removeMember(_id, accountIds, dispatch){
  return graphqlService.mutate(MUTATION_REMOVE_MEMBER, { _id, accountIds }, dispatch);
}
//Thêm member trong công việc
export function addMember(_id, members, dispatch){
  return graphqlService.mutate(MUTATION_ADD_MEMBER, { _id, members }, dispatch);
}
