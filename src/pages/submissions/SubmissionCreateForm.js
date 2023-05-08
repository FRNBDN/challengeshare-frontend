import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";

import { axiosReq } from "../../api/axiosDefaults";

import Avatar from "../../components/Avatar";

import appStyles from "../../App.module.css";
import formStyles from "../../styles/Forms.module.css";

const SubmissionCreateForm = (props) => {
  const { dare, setDares, profileImage, profile_id, setOpen, Feed } = props;
  const [text, setText] = useState("");
  const [uploads, setUploads] = useState([]);
  const fileInput = useRef(null);
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
      //console.log(error);
    }
  };

  return (
    <Row>
      <Col>
        <Form onSubmit={handleSubmit} className="pt-3">
          <Row>
            <Col xs={12} md={7}>
              <Container>
                <Form.Group>
                  <InputGroup>
                    <Link to={`/profiles/${profile_id}`}>
                      <Avatar src={profileImage} />
                    </Link>

                    <Form.Label className="d-none">
                      Additional Comment
                    </Form.Label>
                    <Form.Control
                      className={formStyles.Input}
                      placeholder="Write additional info and context to uploaded proof"
                      as="textarea"
                      value={text}
                      onChange={handleChange}
                      rows={2}
                    />
                  </InputGroup>
                </Form.Group>
              </Container>
            </Col>
            <Col xs={12} md={5}>
              <div className="">
                <Form.Group controlId="fileInput">
                  <Form.Label className={`${appStyles.BrandFont}`}>
                    {" "}
                    Uploads {`${uploads.length}/5`}:{" "}
                  </Form.Label>
                  <ListGroup>
                    {uploads.map((upload, index) => (
                      <ListGroup.Item key={index}>
                        {upload.name}
                        <Button
                          className={`${appStyles.BrandFont} ${appStyles.Button} float-end`}
                          size="sm"
                          onClick={() => {
                            setUploads(uploads.filter((_, i) => i !== index));
                          }}
                        >
                          <span className="d-none d-md-block">x</span>
                          <span className="d-block d-md-none">Remove</span>
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  {uploads.length < 5 && (
                    <Button
                      className={`${appStyles.BrandFont} ${appStyles.Button} w-100`}
                      onClick={() => fileInput.current.click()}
                    >
                      {uploads.length > 0
                        ? "Upload Additional"
                        : "Upload Image"}
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
            <span className="mx-2"> /</span>
            <Link
              onClick={() => {
                setOpen(false);
                setText("");
                setUploads([]);
              }}
            >
              Cancel
            </Link>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default SubmissionCreateForm;
