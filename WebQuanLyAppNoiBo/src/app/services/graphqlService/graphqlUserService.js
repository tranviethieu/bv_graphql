import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context'
import elsagaService from '../elsagaService';
import graphqlService from '.';

export const ACCESS_TOKEN = "access_token";

const httpLink = createUploadLink({
  uri: `${process.env.REACT_APP_API_USER_HOST}/graphql`
})

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
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({ addTypename: false }),
  defaultOptions: defaultOptions
})

export const query = (query, variables, dispatch) => {
  var request = client.query({
    query,
    variables
  });

  return request.then(result => elsagaService.handleResponse(result, dispatch));

}
export const mutate = (mutation, variables, dispatch) => {
  var request = client.mutate({
    mutation,
    variables
  });

  return request.then(result => elsagaService.handleResponse(result, dispatch));
}