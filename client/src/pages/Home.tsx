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
                  <Card border="primary" bg="dark" text="light">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "1.5rem" }}>
                        {resource.title}
                      </Card.Title>
                      <Card.Text>Category: {resource.category}</Card.Text>
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
