import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation CreateProject($name: String!, $description: String) {
    createProject(name: $name, description: $description) {
      id
      name
      description
      createdAt
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $name: String, $description: String) {
    updateProject(id: $id, name: $name, description: $description) {
      id
      name
      description
      updatedAt
    }
  }
`;


export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
      name
    }
  }
`;