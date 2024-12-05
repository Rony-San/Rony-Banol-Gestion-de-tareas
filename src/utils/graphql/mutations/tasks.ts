import { gql } from '@apollo/client';

export const CREATE_TASK = gql`
  mutation CreateTask(
    $title: String!
    $description: String
    $status: TaskStatus
    $dueDate: String
    $projectId: ID
    $assigneeId: ID
  ) {
    createTask(
      title: $title
      description: $description
      status: $status
      dueDate: $dueDate
      projectId: $projectId
      assigneeId: $assigneeId
    ) {
      id
      title
      status
      assignee {
        id
        name
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $description: String
    $status: TaskStatus
    $dueDate: String
    $assigneeId: ID
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
      dueDate: $dueDate
      assigneeId: $assigneeId
    ) {
      id
      title
      description
      status
      dueDate
      assignee {
        id
        name
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
      title
    }
  }
`;

export const COMPLETE_TASK = gql`
  mutation CompleteTask($id: ID!) {
    updateTask(id: $id, status: COMPLETED) {
      id
      title
      status
    }
  }
`;