import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { DELETE_RESOURCE } from "../utils/mutations";
import { useQuery } from "@apollo/client";
import { GET_SINGLE_USER } from "../utils/queries";
import Auth from "../utils/Auth";
import { removeResourceId } from "../utils/localStorage";

const SavedResources = () => {
  const [deleteResource] = useMutation(DELETE_RESOURCE);

  const { loading, data } = useQuery(GET_SINGLE_USER);

  const userData = data?.getSingleUser || {};

  const handleDeleteResource = async (resourceId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteResource({
        variables: {
          resourceId: resourceId,
        },
      });

      removeResourceId(resourceId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved resources!</h1>
          ) : (
            <h1>Viewing saved resources!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedResources.length
            ? `Viewing ${userData.savedResources.length} saved ${
                userData.savedResources.length === 1 ? "resource" : "resources"
              }:`
            : "You have no saved resources!"}
        </h2>
        <Row>
          {userData.savedResources.map((resource: any) => {
            return (
              <Col md="4">
                <Card key={resource.resourceId} border="dark">
                  <Card.Body>
                    <Card.Title>{resource.title}</Card.Title>
                    <Card.Text>{resource.description}</Card.Text>
                    <p>{resource.url}</p>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteResource(resource.resourceId)}
                    >
                      Delete this resource!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedResources;
