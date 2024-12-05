export const typeDefs = /* GraphQL */ `

type Session {
  id: ID!
  token: String!
  userId: ID!
  user: User!
  expiresAt: String!
}

type User {
  id: ID!
  name: String!
  email: String!
  role: Role!
  tasks: [Task!]
  projects: [Project!]
}

type AuthPayload {
  token: String
  user: User
}


type Project {
  id: ID!
  name: String!
  description: String
  owner: User!
  tasks: [Task!]
  createdAt: String!
  updatedAt: String!
}


type Query {
  me: User!
  users: [User!]!
  user(id: ID!): User
  projects: [Project!]!
  project(id: ID!): Project
  tasks: [Task!]!
  task(id: ID!): Task
  tasksByProject(projectId: ID!): [Task!]!

}

type Task {
  id: ID!
  title: String!
  description: String
  status: TaskStatus!
  dueDate: String
  project: Project
  assignee: User
  createdAt: String!
  updatedAt: String!
}

enum Role {
  USER
  ADMIN
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}


type Mutation {
  signup(email: String!, password: String!, name: String!, role: Role): AuthPayload
  login(email: String!, password: String!): AuthPayload
  updateUser(id: ID!, name: String, email: String, password: String, role: Role): User
  deleteUser(id: ID!): User
  logout: Boolean

  createProject(name: String!, description: String): Project
  updateProject(id: ID!, name: String, description: String): Project
  deleteProject(id: ID!): Project

  createTask(
    title: String!,
    description: String,
    status: TaskStatus,
    dueDate: String,
    projectId: ID,
    assigneeId: ID
  ): Task
  updateTask(
    id: ID!,
    title: String,
    description: String,
    status: TaskStatus,
    dueDate: String,
    assigneeId: ID
  ): Task
  deleteTask(id: ID!): Task
}

`;
