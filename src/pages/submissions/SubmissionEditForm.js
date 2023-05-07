import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import appStyles from "../../App.module.css";
import formStyles from "../../styles/Forms.module.css";
import TopProfiles from "../profiles/TopProfiles";

function DareEditForm() {
  const [deleteUpload, setDeleteUpload] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [text, setText] = useState("");
  const fileInput = useRef(null);

  const [submissionData, setSubmissionData] = useState({
    text: "",
    dare: "",
  });

  const { dare } = submissionData;

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
      <h1>
        <Link to={"/submissions"}>Submissions</Link>/Edit
      </h1>
      <Col>
        <Row>
          <TopProfiles mobile />
        </Row>
        <Form onSubmit={handleSubmit}>
          <Container className={appStyles.Box}>
            <Row>
              <Col xs={12} md={7}>
                <Container className="px-0 pb-2">
                  <Form.Group>
                    <Form.Label className={`${appStyles.BrandFont}`}>
                      Additional Comment
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        className={formStyles.Input}
                        placeholder="Write additional info and context to uploaded proof"
                        as="textarea"
                        value={text}
                        onChange={handleChange}
                        rows={4}
                      />
                    </InputGroup>
                  </Form.Group>
                </Container>
              </Col>
              <Col xs={12} md={5}>
                <div>
                  <Form.Group controlId="fileInput">
                    <Form.Label className={appStyles.BrandFont}>
                      {" "}
                      Uploads {`${uploads.length}/5`}:{" "}
                    </Form.Label>
                    <ListGroup>
                      {uploads.map((upload, index) => (
                        <ListGroup.Item key={index}>
                          {upload.name}
                          <Button
                            className={`${appStyles.BrandFont} ${appStyles.Button} float-right`}
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
            <div className="d-flex align-items-center justify-content-between">
              <div className="m-3">
                <Button
                  className={`${appStyles.BrandFont} ${appStyles.Button}`}
                  type="submit"
                >
                  Save Changes
                </Button>
                <span className="mx-2"> /</span>
                <Link
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Cancel
                </Link>
              </div>
              <div>
                <Button
                  className={`${appStyles.BrandFont} ${appStyles.Button} ${formStyles.Delete}`}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Container>
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
