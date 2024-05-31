import gql from 'graphql-tag'

export const GET_DEPARTMENTS = gql`
{
  response:departments{
    code
    message
    data{
      _id
      name
      code
    }
  }
}
`
export const MUTATION_SAVE_SERVICE_DEMAND = gql`
mutation($data: ServiceDemandOnlineInput){
    response: save_service_demand_online(data: $data){
        code
        message
    }
}
`
export const MUTATION_REMOVE_SERVICE_DEMAND = gql`
mutation($_id: String!){
    response: remove_service_demand_online(_id: $_id){
        code
        message
    }
}
`
export const QUERY_GET_SERVICE_DEMANDS_CHART = gql`
query{
    response: service_demand_online_graph{
        code
        message
        data{
          _id
          priority
          note
          level
          name
          fullName
          parentId 
          departmentIds          
          parent{
            _id
            fullName
            name
          }         
          children{
            _id
            priority
            note
            level
            name
            fullName
            parentId 
            departmentIds
            
            parent{
              _id
              fullName
              name
            }
            children{
              _id
              priority
              note
              level
              name
              fullName
              parentId 
              departmentIds              
              parent{
                _id
                fullName
                name
              } 
              children{
                _id
                priority
                note
                level
                name
                fullName
                parentId 
                departmentIds
                
                parent{
                  _id
                  fullName
                  name
                } 
                
              }
            }
          }
        }
    }
}
`
