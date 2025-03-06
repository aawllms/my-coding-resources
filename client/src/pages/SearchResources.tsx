import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row,
  Modal,
} from "react-bootstrap";
import Auth from "../utils/Auth";
import { useQuery, useMutation } from "@apollo/client";
import { SEARCH_RESOURCES } from "../utils/queries";
import { SAVED_RESOURCE } from "../utils/mutations";

import { saveResourceIds, getSavedResourceIds } from "../utils/localStorage";
import type { Resource } from "../models/Resource";
import CreateResourceForm from "../components/CreateResource";

import Home from "../pages/Home";

const SearchResources = () => {
  const [showModal, setShowModal] = useState(false);

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
    // const { data } = useQuery(SEARCH_RESOURCES, {
    //   variables: {
    //     searchTerm: searchInput,
    //   },
    // });
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

      const updatedSavedResourceIds = [
        ...savedResourceIds,
        resourceToSave.resourceId,
      ];
      setSavedResourceIds(updatedSavedResourceIds);

      saveResourceIds(updatedSavedResourceIds);
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
              <Col xs={12} md={4} className="d-flex gap-1">
                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Submit Search"}
                </Button>
                <Button
                  onClick={() => setShowModal(true)}
                  type="button"
                  variant="light"
                  size="lg"
                >
                  Create Resource
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
            : ""}
        </h2>
        {error && <p>Error: {error.message}</p>} {/* Display any errors */}
        <Row>
          {searchedResource.map((resource) => (
            <Col md="4" key={resource.resourceId}>
              <Card border="primary" bg="dark" text="light">
                <Card.Body>
                  <Card.Title style={{ fontSize: "1.5rem" }}>
                    {resource.title}
                  </Card.Title>
                  <Card.Text>Category: {resource.category}</Card.Text>
                  <br />
                  <Card.Text>{resource.description}</Card.Text>
                  {resource.url ? (
                    <Card.Link
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Resource Link
                    </Card.Link>
                  ) : null}
                  <br />
                  <br />
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedResourceIds?.some(
                        (savedResourceId: string) =>
                          savedResourceId === resource.resourceId
                      )}
                      className="btn-block btn-primary"
                      onClick={() => handleSaveResource(resource.resourceId)}
                    >
                      {savedResourceIds?.some(
                        (savedResourceId: string) =>
                          savedResourceId === resource.resourceId
                      )
                        ? "Resource Saved!"
                        : "Save this Resource!"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Home />
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="resource-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="resource-modal">Create Resource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateResourceForm handleModalClose={() => setShowModal(false)} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SearchResources;
