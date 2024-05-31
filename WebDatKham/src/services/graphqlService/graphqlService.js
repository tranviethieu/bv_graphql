import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context'
import * as BaseControl from '../../utils/VTBaseControl'

export const ACCESS_TOKEN = "access_token";


const httpLink = createUploadLink({
  uri: process.env.REACT_APP_APIHOST
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

export const query = (query,variables,dispatch, showError = true) => {
  var request = client.query({
    query,
    variables
  });
    return request.then(result => handleResponse(result,dispatch,showError));
  
}
export const mutate = (mutation,variables,dispatch, showError = true) => {
  var request = client.mutate({
    mutation,
    variables
  });
  
  return request.then(result => handleResponse(result,dispatch,showError));
  
}
const handleResponse = (result, dispatch, showError) => {
  return new Promise((resolve, reject) => {
    // console.log("==> result: ", result.data)
      if (result.data.response) {
          if (result.data.response.code == 0) {
              resolve(result.data.response);
          } else {
              reject(result.data.response);
              if(showError)
                BaseControl.showErrorToast(result.data.response.message)
              console.log("===> xu ly data loi code: ", result.data.response.code, "  message: ", result.data.response.message)

              // if (result.data.response.code == 2) {
              //     //day ra trang login
              //     if (dispatch) {
              //         dispatch(showMessage({ message: "Bạn không có quyền truy cập chức năng này hoặc phiên truy cập đã kết thúc" }));
              //     }
              //     history.push('/login');
              // } else if (dispatch) {
              //     dispatch(showMessage({ message: result.data.response.message }));
              // }
          }
      } else {
          reject(result.data);
          BaseControl.showErrorToast("Cấu trúc truy vấn chưa đúng định dạng")
          // dispatch(showMessage({ message: "Cấu trúc truy vấn chưa đúng định dạng" }))
          console.log("===> xu ly data loi")
      }
  })

}