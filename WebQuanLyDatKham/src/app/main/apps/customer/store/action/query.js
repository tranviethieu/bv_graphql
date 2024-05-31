
import gql from 'graphql-tag';

export const QUERY_GET_USERS = gql`
    query($page: Int, $pageSize: Int, $filtered:[FilteredInput], $sorted: [SortedInput])
    {
        response:users(page: $page, pageSize: $pageSize, filtered: $filtered, sorted: $sorted)
        {
            code
            message
            page
            pages
            records
            data{
                _id
                address
                appointments
                avatar
                birthDay
                name
                fullName
                phoneNumber
                email
                gender
                appointments
            }
        }
    }
`