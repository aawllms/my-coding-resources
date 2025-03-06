import { useQuery } from "@apollo/client";
import { GET_RESOURCES } from "../utils/queries";
import { Card, Col, Container, Row } from "react-bootstrap";
export const Home = () => {
  const { loading, data } = useQuery(GET_RESOURCES);
  //array of objects
  const resourceData = data?.getAllResources || [];
  return (
    <>
      <h2>Resource Data</h2>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <Container>
            <Row>
              {resourceData.map((resource: any) => (
                <Col md="4" key={resource.resourceId}>
                  <Card border="dark">
                    <Card.Body>
                      <Card.Title>{resource.title}</Card.Title>
                      <Card.Text>{resource.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default Home;
