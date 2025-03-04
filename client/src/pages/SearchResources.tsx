import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";
import Auth from "../utils/Auth";
import { useQuery, useMutation } from "@apollo/client";
import { SEARCH_RESOURCES } from "../utils/queries"; 
import { SAVED_RESOURCE } from "../utils/mutations"; 

import { saveResourceIds, getSavedResourceIds } from "../utils/localStorage";
import type { Resource } from "../models/Resource";

const SearchResources = () => {
  const [savedResourceIds, setSavedResourceIds] = useState(
    getSavedResourceIds()
  ); 
  const [searchedResource, setSearchedResource] = useState<Resource[]>([]);
  const [searchInput, setSearchInput] = useState("");

  
  const { loading, data, error } = useQuery(SEARCH_RESOURCES, {
    variables: { searchTerm: searchInput },
    skip: !searchInput, 
  });

 
  const [saveResource] = useMutation(SAVED_RESOURCE);

  useEffect(() => {
    if (data && data.searchResources) {
      setSearchedResource(data.searchResources); 
    }
  }, [data]);

  useEffect(() => {
    saveResourceIds(savedResourceIds); 
  }, [savedResourceIds]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchInput) {
      return;
    }

   
  };

  const handleSaveResource = async (resourceId: string) => {
    const resourceToSave = searchedResource.find(
      (resource) => resource.resourceId === resourceId
    )!;

    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }

    try {
      await saveResource({
        variables: {
          description: resourceToSave.description,
          resourceId: resourceToSave.resourceId,
          title: resourceToSave.title,
          url: resourceToSave.url,
        },
      });
      setSavedResourceIds((prevIds: any) => [
        ...prevIds,
        resourceToSave.resourceId,
      ]);
    } catch (err) {
      console.error("Error saving resource:", err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Resources!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a resource"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Submit Search"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedResource.length
            ? `Viewing ${searchedResource.length} results:`
            : "Search for a resource to begin"}
        </h2>
        {error && <p>Error: {error.message}</p>} {/* Display any errors */}
        <Row>
          {searchedResource.map((resource) => (
            <Col md="4" key={resource.resourceId}>
              <Card border="dark">
                <Card.Body>
                  <Card.Title>{resource.title}</Card.Title>
                  <Card.Text>{resource.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedResourceIds?.some(
                        (savedResourceId: string) =>
                          savedResourceId === resource.resourceId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveResource(resource.resourceId)}
                    >
                      {savedResourceIds?.some(
                        (savedResourceId: string) =>
                          savedResourceId === resource.resourceId
                      )
                        ? "This resource has already been saved!"
                        : "Save this Resource!"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SearchResources;
