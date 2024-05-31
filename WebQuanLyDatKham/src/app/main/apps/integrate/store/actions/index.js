// import graphqlService from 'app/services/graphqlService';
// import { showMessage } from 'app/store/actions'
// import { MUTATION_SAVE_INTEGRATED_ACCOUNT, MUTATION_SAVE_INTEGRATE_CHANNEL, MUTATION_SUBCRIBED_CHANNEL, MUTATION_UNSUBCRIBED_CHANNEL,QUERY_INTEGRATED_ACCOUNTS } from './query';

export * from './facebook.actions';
export * from './integrates.action';
// export function saveIntegratedAccount(data, dispatch) {
//     return graphqlService.mutate(MUTATION_SAVE_INTEGRATED_ACCOUNT, { data }, dispatch);
// }
// export function saveIntegratedChannel(integratedId,data){
//     return graphqlService.mutate(MUTATION_SAVE_INTEGRATE_CHANNEL,  {integratedId, data });
// }

// export function subcribedChannel(_id){
//     return graphqlService.mutate(MUTATION_SUBCRIBED_CHANNEL,  {_id});
// }
// export function unSubcribedChannel(_id){
//     return graphqlService.mutate(MUTATION_UNSUBCRIBED_CHANNEL,  {_id});
// }
// export function getIntegrateAccounts(dispatch) {
//     return graphqlService.query(QUERY_INTEGRATED_ACCOUNTS, {}, dispatch);
// }