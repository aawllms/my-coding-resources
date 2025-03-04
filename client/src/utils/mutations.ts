import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        saveResource {
          resourceId
          title
          description
          url
        }
      }
    }
  }
`;

export const SAVED_RESOURCE = gql`
  mutation savedRESOURCE(
    $description: String!
    $resourceId: String!
    $title: String!
    $url: String
  ) {
    saveResource(
      description: $description
      resourceId: $bookId
      title: $title
      url: $url
    ) {
      _id
      username
      email
      savedResources {
        resourceId
        title
        description
        url
      }
    }
  }
`;

export const DELETE_RESOURCE = gql`
  mutation DeleteBook($bookId: String!) {
    deleteRESOURCE(bookId: $bookId) {
      _id
      username
      email
      saveResource {
        resourceId
        title
        description
        url
      }
    }
  }
`;
