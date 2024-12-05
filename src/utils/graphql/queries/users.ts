import {gql} from "@apollo/client";

export const GET_ALL_USERS_QUERY = gql`
    query AllUsers {
        users {
            id
            name
            email
            role
        }
    }
`;

export const GET_USER_QUERY = gql`
    query GetUserById($id: ID!) {
        user(id: $id) {
            id
            name
            email
            role
        }
    }
`;
