import gql from 'graphql-tag';
import graphqlService from 'app/services/graphqlService';

export const SET_PHONENUMBER = '[CALL OUT] SET PHONENUMBER';
export const SET_USER = '[CALL OUT] SET USER';
export const CLEAR_CALL = '[CALL OUT] CLEAR CALL';

const MUTATION_CALL = gql`
mutation($phoneNumber:String!, $campaignId: String){
    response:callout(phoneNumber:$phoneNumber, campaignId: $campaignId){
      code
      message
      data
    }
  }
`
export function clearCall() {
    return {
        type: CLEAR_CALL
    }
}
export function callout(phoneNumber, campaignId) {
    return (dispatch) => {
        graphqlService.mutate(MUTATION_CALL, { phoneNumber, campaignId }, dispatch).then(_ =>
            dispatch({
                type: SET_PHONENUMBER,
                data: phoneNumber
            }));
    }
}
export function setUser(data) {
    return {
        type: SET_USER,
        data
    }
}
