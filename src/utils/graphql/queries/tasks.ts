import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      status
      dueDate
      project {
        id
        name
      }
      assignee {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      dueDate
      project {
        id
        name
      }
      assignee {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_TASKS_BY_PROJECT = gql`
  query GetTasksByProject($projectId: ID!) {
    tasksByProject(projectId: $projectId) {
      id
      title
      description
      status
      dueDate
      assignee {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;