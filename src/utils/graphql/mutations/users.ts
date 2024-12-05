import {gql} from "@apollo/client";


export const CREATE_USER_MUTATION = gql`
    mutation CreateUser($name: String!, $email: String!, $password: String!, $role: Role) {
    signup(name: $name, email: $email, password: $password, role: $role) {
        user {
            id
            name
            email
            role
        }
    }
}
`;

export const UPDATE_USER_MUTATION = gql`
    mutation UpdateUser($id: ID!, $name: String!, $email: String!, $role: Role) {
        updateUser(id: $id, name: $name, email: $email, role: $role) {
            id
            name
            email
            role
        }
    }
`;

export const DELETE_USER_MUTATION = gql`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id) {
            id
            
        }
    }
`;