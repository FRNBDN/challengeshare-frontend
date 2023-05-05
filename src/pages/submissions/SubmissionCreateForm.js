import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { Button, InputGroup, ListGroup } from "react-bootstrap";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import Avatar from "../../components/Avatar";
import appStyles from "../../App.module.css";
import { Link, useNavigate } from "react-router-dom";

const SubmissionCreateForm = (props) => {
  const {
    dare,
    setDares,
    setSubmission,
    setSubmissions,
    profileImage,
    profile_id,
    setOpen,
    Feed,
  } = props;
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
      const { data } = await axiosReq.post("/submissions/", submissionData);

      const uploadsData = [];
      uploads.forEach((upload) => {
        const formData = new FormData();
        formData.append("submission", data.id);
        formData.append("upload", upload);
        uploadsData.push(formData);
      });

      await Promise.all(
        uploadsData.map((formData) => axiosReq.post("/uploads/", formData))
      );
      Feed
        ? setDares((prevDares) => ({
            results: prevDares.results.map((listDare) => {
              if (listDare.id === dare) {
                return {
                  ...listDare,
                  has_submitted: true,
                  submissions_count: listDare.submissions_count + 1,
                };
              }
              return listDare;
            }),
          }))
        : setDares((prevDare) => ({
            results: [
              {
                ...prevDare.results[0],
                has_submitted: true,
                submissions_count: prevDare.results[0].submissions_count + 1,
              },
            ],
          }));

      setOpen(false);
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
                    <Form.Label> Uploads {`${uploads.length}/5`}: </Form.Label>
                    <ListGroup>
                      {uploads.map((upload, index) => (
                        <ListGroup.Item key={index}>
                          {upload.name}
                          <Button
                            className={`${appStyles.BrandFont} ${appStyles.Button}`}
                            size="sm"
                            onClick={() => {
                              setUploads(uploads.filter((_, i) => i !== index));
                            }}
                          >
                            x
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                    {uploads.length < 5 ? (
                      <Button
                        className={`${appStyles.BrandFont} ${appStyles.Button}`}
                        onClick={() => fileInput.current.click()}
                      >
                        {uploads.length > 0
                          ? "Upload Additional"
                          : "Upload Image"}
                      </Button>
                    ) : (
                      <Button
                        className={`${appStyles.BrandFont} ${appStyles.Button} ${appStyles.Button.disabled}`}
                        disabled
                      >
                        Limit Reached
                      </Button>
                    )}

                    <input
                      type="file"
                      ref={fileInput}
                      onChange={handleUpload}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </Form.Group>
                </div>
              </Container>
            </Col>
            <Col md={5} lg={4} className="d-none d-md-block">
              <div className="d-none d-md-block">
                <Form.Group controlId="fileInput">
                  <Form.Label> Uploads {`${uploads.length}/5`}: </Form.Label>
                  <ListGroup>
                    {uploads.map((upload, index) => (
                      <ListGroup.Item key={index}>
                        {upload.name}
                        <Button
                          className={`${appStyles.BrandFont} ${appStyles.Button}`}
                          size="sm"
                          onClick={() => {
                            setUploads(uploads.filter((_, i) => i !== index));
                          }}
                        >
                          x
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  {uploads.length < 5 ? (
                    <Button
                      className={`${appStyles.BrandFont} ${appStyles.Button}`}
                      onClick={() => fileInput.current.click()}
                    >
                      {uploads.length > 0
                        ? "Upload Additional"
                        : "Upload Image"}
                    </Button>
                  ) : (
                    <Button
                      className={`${appStyles.BrandFont} ${appStyles.Button} ${appStyles.Button.disabled}`}
                      disabled
                    >
                      Limit Reached
                    </Button>
                  )}

                  <input
                    type="file"
                    ref={fileInput}
                    onChange={handleUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </Form.Group>
              </div>
            </Col>
          </Row>
          <div className="m-3">
            <Button
              className={`${appStyles.BrandFont} ${appStyles.Button}`}
              type="submit"
            >
              Submit
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default SubmissionCreateForm;
