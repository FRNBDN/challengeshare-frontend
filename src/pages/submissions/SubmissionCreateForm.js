import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { Button, InputGroup, ListGroup } from "react-bootstrap";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import Avatar from "../../components/Avatar";
import { Link, useNavigate } from "react-router-dom";
import { upload } from "@testing-library/user-event/dist/upload";

const SubmissionCreateForm = (props) => {
  const { dare, setDares, setNewSubmission, profileImage, profile_id } = props;
  const [text, setText] = useState("");
  const [uploads, setUploads] = useState([]);
  const fileInput = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleUpload = (e) => {
    setUploads([...uploads, ...e.target.files]);
    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append("challenge", dare);
    submissionData.append("text", text);
    submissionData.append("status", 1);

    try {
      const { data } = await axiosRes.post("/submissions/", submissionData);

      const uploadsData = [];
      uploads.forEach((upload) => {
        const formData = new FormData();
        formData.append("submission", data.id);
        formData.append("upload", upload);
        uploadsData.push(formData);
      });

      await Promise.all(
        uploadsData.map((formData) => axiosRes.post("/uploads/", formData))
      );
      navigate(`/dares/${dare}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Row>
      <Col>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Container>
                <Form.Group>
                  <InputGroup>
                    <Link to={`/profiles/${profile_id}`}>
                      <Avatar src={profileImage} />
                    </Link>

                    <Form.Label>Additional Comment</Form.Label>
                    <Form.Control
                      placeholder="Write additional info and context to uploaded proof"
                      as="textarea"
                      value={text}
                      onChange={handleChange}
                      rows={2}
                    />
                  </InputGroup>
                </Form.Group>
                <div className="d-md-none">
                  <Form.Group controlId="fileInput">
                    <Form.Label>Upload Proof</Form.Label>
                    <ListGroup>
                      {uploads.map((upload, index) => (
                        <ListGroup.Item key={index}>
                          {upload.name}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setUploads(uploads.filter((_, i) => i !== index));
                            }}
                          >
                            Delete
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                    <Button onClick={() => fileInput.current.click()}>
                      Upload File
                    </Button>
                    <input
                      type="file"
                      ref={fileInput}
                      onChange={handleUpload}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                    {/* <Form.Control type="file" onChange={handleUpload} /> */}
                  </Form.Group>
                </div>
              </Container>
            </Col>
            <Col md={5} lg={4} className="d-none d-md-block">
              <div className="d-none d-md-block">
                <Form.Group controlId="fileInput">
                  <Form.Label> Uploads: </Form.Label>
                  <ListGroup>
                    {uploads.map((upload, index) => (
                      <ListGroup.Item key={index}>
                        {upload.name}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setUploads(uploads.filter((_, i) => i !== index));
                          }}
                        >
                          Delete
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Button onClick={() => fileInput.current.click()}>
                    {uploads.length > 0 ? "Upload Additional" : "Upload Image"}
                  </Button>
                  <input
                    type="file"
                    ref={fileInput}
                    onChange={handleUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  {/* <Form.Control type="file" onChange={handleUpload} /> */}
                </Form.Group>
              </div>
            </Col>
          </Row>
          <div className="m-3">
            <Button type="submit">Submit</Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default SubmissionCreateForm;
