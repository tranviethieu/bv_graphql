import gql from 'graphql-tag'


export const MUTATION_UPLOAD = gql`
mutation($file:FileUploadInput){
  response:uploadFile(file:$file){
    code
    message
  	data
  }
}
`