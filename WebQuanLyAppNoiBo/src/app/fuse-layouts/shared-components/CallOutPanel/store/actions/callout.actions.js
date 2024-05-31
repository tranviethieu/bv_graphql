import { QUERY_CALL_CAMPAIGNS } from "./query";
import graphqlService from 'app/services/graphqlService';

export const TOGGLE_CALL_PANEL = '[CALL PANEL] TOGGLE CALL PANEL';

export function toggleCallPanel(phoneNumber)
{
    return {
        type: TOGGLE_CALL_PANEL,
        phoneNumber
    }
}
export function getCallCampaign(variables, dispatch){
  return graphqlService.query(QUERY_CALL_CAMPAIGNS, variables, dispatch)
}
