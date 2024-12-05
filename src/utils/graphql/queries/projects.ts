import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      tasks {
        id
        status
        assignee {
          id
          name
        }
      }
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      tasks {
        id
        title
        status
        assignee {
          id
          name
        }
      }
      createdAt
      updatedAt
    }
  }
`;