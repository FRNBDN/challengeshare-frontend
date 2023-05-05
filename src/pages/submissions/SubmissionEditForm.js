import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Alert,
  Row,
  Col,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import TagField from "../../components/TagField";
import appStyles from "../../App.module.css";
import Avatar from "../../components/Avatar";
import { upload } from "@testing-library/user-event/dist/upload";
import TopProfiles from "../profiles/TopProfiles";

function DareEditForm() {
  const [deleteUpload, setDeleteUpload] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [text, setText] = useState("");
  const fileInput = useRef(null);

  const [submissionData, setSubmissionData] = useState({
    text: "",
    profile_id: "",
    profile_image: "",
    dare: "",
  });

  const { profile_id, profile_image, dare } = submissionData;

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/submissions/${id}`);
        const {
          text,
          uploads,
          is_owner,
          profile_id,
          profile_image,
          challenge,
        } = data;

        const uploadsDataReq = uploads.map((upload) => {
          return axiosReq.get(`/uploads/${upload}`);
        });

        const uploadsData = await Promise.all(uploadsDataReq);
        const updateUploads = uploadsData.map((upload, index) => {
          const imgUrl = upload.data.upload.toString();
          const imgNameStart = imgUrl.indexOf("uploads/") + "uploads/".length;
          const imgNameEnd = imgUrl.indexOf("_");
          const imgName = imgUrl.substring(imgNameStart, imgNameEnd);
          return {
            key: index,
            upload: upload.data.upload,
            eid: upload.data.id,
            name: imgName,
          };
        });

        if (is_owner) {
          setSubmissionData({ profile_id, profile_image, dare: challenge });
          setText(text);
          setUploads(updateUploads);
        } else {
          navigate(-1);
        }
      } catch (error) {
        console.log(error);
      }
    };
    handleMount();
  }, [navigate, id]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleUpload = (e) => {
    setUploads([...uploads, ...e.target.files]);
    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosRes.put(`/submissions/${id}`, { text, challenge: dare });

      uploads.forEach((upload) => {
        const formData = new FormData();
        formData.append("submission", id);
        formData.append("upload", upload);
        if (!upload.eid) {
          axiosReq.post(`/uploads/`, formData);
        }
      });

      await Promise.all(
        deleteUpload.map((upload) => axiosRes.delete(`/uploads/${upload}`))
      );
      navigate(`/submissions/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/submissions/${id}`);

      navigate("/submissions/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Row>
      <Col>
        <Row>
          <TopProfiles mobile />
        </Row>
        <Form onSubmit={handleSubmit}>
          <Container className={appStyles.Box}>
            <Row>
              <Col>
                <Container>
                  <Form.Group>
                    <InputGroup>
                      <Link to={`/profiles/${profile_id}`}>
                        <Avatar src={profile_image} />
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
                      <Form.Label>
                        {" "}
                        Uploads {`${uploads.length}/5`}:{" "}
                      </Form.Label>
                      <ListGroup>
                        {uploads.map((upload, index) => (
                          <ListGroup.Item key={index}>
                            {upload.name}
                            <Button
                              className={`${appStyles.BrandFont} ${appStyles.Button}`}
                              size="sm"
                              onClick={() => {
                                setUploads(
                                  uploads.filter((_, i) => i !== index)
                                );
                                if (uploads[index].eid) {
                                  setDeleteUpload((prevDeleteUpload) => [
                                    ...prevDeleteUpload,
                                    uploads[index].eid,
                                  ]);
                                }
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
                              if (uploads[index].eid) {
                                setDeleteUpload((prevDeleteUpload) => [
                                  ...prevDeleteUpload,
                                  uploads[index].eid,
                                ]);
                              }
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
          </Container>
          <div className="m-3">
            <Button
              className={`${appStyles.BrandFont} ${appStyles.Button} `}
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button
              className={`${appStyles.BrandFont} ${appStyles.Button}`}
              type="submit"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Col>
      <Col md={3} className="d-none d-md-block">
        <Row>
          <div className="d-flex flex-column px-0 pb-3 ">
            <Link
              to="/dares/create"
              className={`${appStyles.Button} m-0 flex-fill py-2`}
            >
              <h6>Create New Dare</h6>
            </Link>
          </div>
        </Row>
        <Row>
          <TopProfiles />
        </Row>
      </Col>
    </Row>
  );
}
export default DareEditForm;
