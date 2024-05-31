import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context'
import elsagaService from '../elsagaService';

export const ACCESS_TOKEN = "access_token";

const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_WS_HOST,
    options: {
      reconnect: true
    }
  });

const httpLink = createUploadLink({
  uri: `${process.env.REACT_APP_API_ROOT}/graphql`
})
// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
 const link = split(
   // split based on operation type
   ({ query }) => {
     const { kind, operation } = getMainDefinition(query);
     return kind === 'OperationDefinition' && operation === 'subscription';
   },
   wsLink, 
   httpLink,
);

const authLink = setContext((_, { headers }) => {
  var access_token = localStorage.getItem(ACCESS_TOKEN);  
  if (access_token) {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${access_token}`
      }
    }
  }
  else
    localStorage.removeItem(ACCESS_TOKEN);

  return {};
})
//this defaultOptions will stop apollo from caching?
const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}
export const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache({ addTypename: false }),
  defaultOptions: defaultOptions
})

export const query = (query, variables, dispatch) => {  
  var request = client.query({
    query,
    variables
  });  
  // console.log("client=", client);
  return request.then(result => elsagaService.handleResponse(result,dispatch));

}
export const mutate = (mutation,variables,dispatch) => {
  var request = client.mutate({
    mutation,
    variables
  });

  return request.then(result => elsagaService.handleResponse(result,dispatch));

}
