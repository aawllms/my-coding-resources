const typeDefs = `
type User {
  _id: ID!
  username: String!
  email: String!
  savedResource: [Resource]
}

type Resource {
  resourceId: ID!
  title: String!
  description: String!
  url: String
}

type Category {
  categoryId: ID!
  language: String!
  description: String
}

type Auth {
  token: String!
  user: User
}

type Query {
  getSingleUser: User
  getAllUsers: [User]
  getUserByUsername(username: String!): User

  getResource(resourceId: ID!): Resource
  getAllResources: [Resource]
}

type Mutation {
  createUser(username: String!, email: String!, password: String!): Auth
  login(email: String!, password: String!): Auth
  deleteUser: Auth
  updateUser(username: String, email: String, password: String): User

  deleteResource(resourceId: ID!): Resource
  createResource(title: String!, description: String!, url: String): Resource
  updateResource(resourceId: ID!, title: String, description: String, url: String): Resource
  saveResource(resourceId: String!, title: String!, description: String!, url: String): User
  #removeResource(resourceId: String!): User
  
}
`;
export default typeDefs;
