import React from "react";
import { useQuery, gql } from "@apollo/client";
import Auth from "../utils/Auth";

const GET_SAVED_RESOURCES = gql`
  query GetSavedResources {
    getSingleUser {
      savedResource {
        _id
        title
        description
        url
      }
    }
  }
`;

const SavedResources: React.FC = () => {
  const isAuthenticated = Auth.loggedIn();
  const { loading, error, data } = useQuery(GET_SAVED_RESOURCES, {
    skip: !isAuthenticated,
  });

  if (!isAuthenticated) {
    return <p>You need to be logged in to view your saved resources.</p>;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Saved Resources</h1>
      <ul>
        {data.getSingleUser.savedResource.map((resource: any) => (
          <li key={resource._id}>
            <h2>{resource.title}</h2>
            <p>{resource.description}</p>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              {resource.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedResources;
