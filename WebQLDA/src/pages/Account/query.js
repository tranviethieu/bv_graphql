import gql from 'graphql-tag';

export const UPDATE_UPLOADED_ACCOUNTS = gql`
mutation($data:[RootAccountClaimInput]!){
  response:updateAccounts(data:$data){
    code
    message
    data
    {
      _id
    }
  }
}
`
export const REMOVE_UPLOADED_ACCOUNTS = gql`
mutation($data:[String]){
  response:removeAccounts(data:$data){
    code
    message
    data
  }
}
`

export const QUERY_PREVIEW_UPLOAD = gql`
query($fileId:String!){
  response:account_preview_from_upload_file(fileId:$fileId){
    code
    message
    data{
      userName
      fullName
      address
      work
      title
      birthday
      code
      departmentName
      email
      gender
      mariaged
      phoneNumber
    }
  }
}
`

export const MUTATION_REMOVE_ROLE = gql`
mutation($_id:String!){
  response:deleteGrantPermission(_id:$_id){
    code
    message
  }
}
`;

export const QUERY_PROJECTS = gql`
{
    response:projects{
      code
      message
      data{
        _id
        name
      }
    }
  }
`
export const MUTATION_EDIT = gql`
  mutation ($account: RootAccountInput!) {
    response:updateAccount(account: $account) {
      code
      message
    }
  }
`;
export const MUTATION_CREATE = gql`
  mutation ($account: RootAccountInput!) {
    response:createAccount(account: $account) {
      code
      message
    }
  }
`;
export const QUERY_DEPARTMENTS = gql`
{
  response:departments{
    code
    message
    data{
      _id
      name
    }
  }
}
`
export const DELETE_ACCOUNT=gql`
mutation ($_id:String!){
  response:removeAccount(_id:$_id){
    code
    message
  }
}
`
export const QUERY_ACCOUNT = gql`
  query($_id: String) {
    response:account(_id: $_id) {
      code
      message
      data{
        _id
        userName
        fullName
        email
        phoneNumber
        avatar
        mariaged
        gender
        address
        work
        code
        address
        isRoot
        isActive
        certificate
        nationIdentity
        departmentId
        department{
          _id
          name
        }
        birthday
        title
        roles{
          project{
            name
            _id
          }
          role
          _id
        }
      }
    }
  }
`;
export const QUERY_ACCOUNTS=gql`
query Accounts($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
  response:accounts(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
    page
    pages
    data{
      _id
      title
      userName
      fullName
      birthday
      certificate
      nationIdentity
      address
      departmentId
      department{
        _id
        name
      }
      createdTime
      email
      mariaged
      gender
      isRoot
      isActive
      code
      phoneNumber
      work
      roles{
        projectId
      }
    }
  }
}

`
