import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context'
import { AUTH_TOKEN } from 'Constants'

const httpLink = createUploadLink({
  uri: `${process.env.REACT_APP_API_HOST}/graphql`
})

const authLink = setContext((_, { headers }) => {
  var tokenStr = '';

  tokenStr = localStorage.getItem(AUTH_TOKEN);
  try {
    if (tokenStr) {
      const token = JSON.parse(tokenStr);
      if (token.access_token)
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token.access_token}` : ''
          }
        }
      else
        throw "invalid token";
    }
  } catch (err) {
    localStorage.setItem(AUTH_TOKEN, undefined);
  }
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
