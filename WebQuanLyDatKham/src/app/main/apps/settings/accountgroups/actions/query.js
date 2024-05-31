import gql from 'graphql-tag';

export const DEPARTMENTS = gql`
{
  response:departments{
    code
    message
    data{
      _id
      fullName
    }
  }
}
`

export const MENU_PERMISSIONS = gql`
{
  response:menus(filtered:[{id:"type",value:"Permissions:{$ne:[]}",operation:"custom"}]){
    code
    message
    data{
      name
      fullName
      permissions
      subPermissions
    }
  }
}
`

export const ALL_PERMISSION = gql`
{
    response:apis(group:true){
        code
        message
        data{
          title
          permission
        }
    } 
}
`

export const ALL_GROUP = gql`
{
    response:accountgroup_permissions{
      code
      message
      records
      pages
      data{
        _id
        name        
        description
        permissions
      }
    }
  }
`

export const GET = gql`
query($_id:String!){
    response:accountgroup_permission(_id:$_id){
      code
      message
      data{
        _id
        name
        description
        permissions
        
      }
    }
  }
`
export const SAVE = gql`
mutation($data:AccountGroupPermissionInput){
    response:save_accountgroup_permission(data:$data){
      code
      message
    }
  }
`
export const REMOVE = gql`
mutation($_id:String!){
    response:remove_accountgroup_permission(_id:$_id){
      code
      message
    }
  }
`