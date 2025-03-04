// import React from "react";
// import { gql, useMutation } from "@apollo/client";
// import { useAuth } from "../utils/Auth"; 
// import { Link } from "react-router-dom";

// interface Resource {
//   _id: string;
//   title: string;
//   description: string;
//   url: string;
// }

// interface ResourceCardProps {
//   resource: Resource;
// }

// const SAVE_RESOURCE = gql`
//   mutation SaveResource($resourceId: ID!) {
//     saveResource(resourceId: $resourceId) {
//       _id
//       username
//       email
//       savedResource {
//         _id
//       }
//     }
//   }
// `;

// const DELETE_RESOURCE = gql`
//   mutation DeleteResource($resourceId: ID!) {
//     deleteResource(resourceId: $resourceId) {
//       _id
//     }
//   }
// `;

// const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
//   // Pull the isAuthenticated boolean from the hook
//   const { isAuthenticated } = useAuth();

//   const [saveResource, { loading: saveLoading, error: saveError }] = useMutation(SAVE_RESOURCE);
//   const [deleteResource, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_RESOURCE);

//   const handleSaveResource = async () => {
//     if (!isAuthenticated) {
//       console.error("You must be logged in to save resources.");
//       return;
//     }

//     try {
//       await saveResource({ variables: { resourceId: resource._id } });
//       console.log("Resource saved!");
//     } catch (err) {
//       console.error("Error saving resource:", err);
//     }
//   };

//   const handleDeleteResource = async () => {
//     if (!isAuthenticated) {
//       console.error("You must be logged in to delete resources.");
//       return;
//     }

//     try {
//       await deleteResource({ variables: { resourceId: resource._id } });
//       console.log("Resource deleted!");
//     } catch (err) {
//       console.error("Error deleting resource:", err);
//     }
//   };

//   return (
//     <div className="resource-card">
//       <h3>{resource.title}</h3>
//       <p>{resource.description}</p>
//       <a href={resource.url} target="_blank" rel="noopener noreferrer">
//         Learn More
//       </a>

//       {isAuthenticated ? (
//         <>
//           <button onClick={handleSaveResource} disabled={saveLoading}>
//             {saveLoading ? "Saving..." : "Save"}
//           </button>
//           <button onClick={handleDeleteResource} disabled={deleteLoading}>
//             {deleteLoading ? "Deleting..." : "Delete"}
//           </button>
//           {saveError && <p>Error saving: {saveError.message}</p>}
//           {deleteError && <p>Error deleting: {deleteError.message}</p>}
//         </>
//       ) : (
//         <Link to="/login">Login to Save</Link>
//       )}
//     </div>
//   );
// };

// export default ResourceCard;