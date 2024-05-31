import gql from 'graphql-tag';

export const IMPORT_ACCOUNTS = gql`
mutation($data:[AccountInput]){
  response:importAccounts(data:$data){
    code
    message
    data
  }
}
`
export const QUERY_ARTICLES = gql`
query($page:Int,$pageSize:Int,$filtered:[FilteredInput],$sorted:[SortedInput]){
    response:articles(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
      code
      message
      pages
      records
      page
      data{
        _id
        active
        coverImageId
        thumbImageId
        title
        createdTime
        creator{
          fullName
        }
        content
        type
        shortDesc
        name
      }
    }
  }
`

export const MUTATION_SAVE_ARTICLE = gql`
mutation($data:ArticleInput){
  response:save_article(data:$data){
    code
    message
  }
}
`

export const MUTATION_DELETE_ARTICLE = gql`
mutation($_id:String!){
  response:remove_article(_id:$_id){
    code
    message
  }
}
`
