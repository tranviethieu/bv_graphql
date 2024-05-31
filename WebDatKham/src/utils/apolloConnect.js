import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context'
// import {AUTH_TOKEN as COMPANY_AUTH_TOKEN} from 'Constants'

  const httpLink = createUploadLink ({
    // uri: window.env.apiHost
    uri: 'http://api.dms.benhvienphusanhanoi.vn/graphql'
  })
   const authLink = setContext((_, { headers }) => {
    //   var tokenStr='';
      
    //   tokenStr=localStorage.getItem(COMPANY_AUTH_TOKEN);
    //    try{
    //      if(tokenStr){
    //        const token = JSON.parse(tokenStr);
    //        return {
    //            headers: {
    //            ...headers,
    //            authorization: token ? `Bearer ${token.accessToken}` : ''
    //            }
    //        }
    //      }
    //    }catch(err){
    //      localStorage.setItem(COMPANY_AUTH_TOKEN,undefined);
    //    }
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
     cache: new InMemoryCache({addTypename:false}),
     defaultOptions: defaultOptions
   })
  