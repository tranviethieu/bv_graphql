import gql from 'graphql-tag';

export const QUERY_RINGGROUPS = gql`
query ringGroups {
  response: ringGroups {
    code
    message
    data {
      name
      phoneCode
    }
  }
}
`

export const QUERY_ROOT_DEPARTMENTS = gql`
{
  response:rootDepartments{
    code
    message
    data
  }
}
`

export const IMPORT_ACCOUNTS = gql`
mutation($data:[AccountInput]){
  response:importAccounts(data:$data){
    code
    message
    data
  }
}
`

export const ALL_GROUP = gql`
{
    response:accountgroup_permissions{
      code
      message
      data{
        _id
        name
      }
    }
  }
`

export const QUERY_ORGANIZATIONS = gql`
query($filtered:[FilteredInput]){
    response: organizations(filtered: $filtered, sorted: [{id:"level",desc:false}]){
        code
        message
        page
        pages
        records
        data{
          _id
          description
          level
          name
        }
    }
}
`
export const QUERY_DEPARTMENTS = gql`
{
  response: departments {
    code
    message
    data {
      _id
      name
    }
  }
}
`
export const QUERY_ROOT_ACCOUNTS = gql`
query($key:String,$page:Int,$pageSize:Int){
  response:authorizeAccounts(key:$key,page:$page,pageSize:$pageSize){
    code
    message
    data
  }
}
`;

export const QUERY_ACCOUNTS = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:accounts(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
        code
        message
        pages
        page
        records
        data{
          _id
          sipPhone
          sipPhones
          sipPassword
          organizations{
            _id
            description
            level
            name
          }
          department
          accountGroupIds
          groupPermissions{
            _id
            name
          }
          base{
            code
            fullName
            address
            certificate
            nationIdentity
            title
            userName
            address
            birthday
            gender
            phoneNumber
            email
            work
            isRoot
            name
            departmentId
            departmentName
          }
        }
      }
  }
`

export const MUTATION_SAVE_ACCOUNT = gql`
mutation($account:AccountInput!){
  response:saveAccount(account:$account){
    code
    message
    data{
      _id
    }
  }
}
`

export const MUTATION_DELETE_ACCOUNT = gql`
mutation($_id:String!){
  response:removeAccount(_id:$_id){
    code
    message
  }
}
`
export const MUTATION_CHANGE_PASSWORD = gql`
mutation($oldpw:String!,$newpw:String!){
  response:changePassword(oldpw:$oldpw,newpw:$newpw){
    code
    message
  }
}
`
