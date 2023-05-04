import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { Button, InputGroup } from "react-bootstrap";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import Avatar from "../../components/Avatar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Criteria from "../dares/Criteria";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import styles from "../../styles/ReviewCreateFrom.module.css";

const ReviewCreateForm = (props) => {
  const {
    submission,
    setSubmission,
    setSubmissions,
    setReview,
    profileImage,
    profile_id,
    dare_id,
    setOpen,
    Feed,
  } = props;
  const [body, setBody] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [votePass, setVotePass] = useState(false);
  const [criteria, setCriteria] = useState({ results: [] });
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        console.log("dare_id:", dare_id);
        const { data: criteria } = await axiosReq.get(
          `/criteria/?challenge=${dare_id}`
        );
        setCriteria(criteria);
        setHasLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    setHasLoaded(false);
    fetchCriteria();
  }, [dare_id, pathname]);

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    const votePass = criteria.results.every(
      (criterion) => document.getElementById(`${criterion.id}`).checked
    );
    setVotePass(votePass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const vote_pass = votePass;
      const { data } = await axiosRes.post("/reviews/", {
        body,
        submission,
        vote_pass,
      });
      {
        Feed
          ? setSubmissions((prevSubmissions) => ({
              results: prevSubmissions.results.map((sub) => {
                if (sub.id === submission) {
                  return {
                    ...sub,
                    has_reviewed: true,
                  };
                }
                return sub;
              }),
            }))
          : setSubmission((prevSubmission) => ({
              results: [
                {
                  ...prevSubmission.results[0],
                  has_reviewed: true,
                },
              ],
            }));
      }

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
                      placeholder="Write additional info about your review decision"
                      as="textarea"
                      value={body}
                      onChange={handleChange}
                      rows={2}
                    />
                  </InputGroup>
                </Form.Group>
                <div className="d-md-none"></div>
              </Container>
            </Col>
            <Col>
              <span className={`${appStyles.BrandFont}  mb-1`}>Criteria:</span>
              {hasLoaded ? (
                <>
                  {criteria.results.length ? (
                    criteria.results.map((criterion) => (
                      <div key={`${criterion.id}`}>
                        <Form.Check
                          type="checkbox"
                          id={`${criterion.id}`}
                          label={`${criterion.text}`}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    ))
                  ) : (
                    <span> No criteria submitted </span>
                  )}
                </>
              ) : (
                <Container>
                  <Asset spinner />
                </Container>
              )}
            </Col>
          </Row>
          <div className="m-3">
            {votePass ? (
              <Button
                className={`${appStyles.Button} ${styles.Complete} ${appStyles.BrandFont}`}
                type="submit"
              >
                Submit / Completed
              </Button>
            ) : (
              <Button
                className={`${appStyles.Button} ${styles.Fail} ${appStyles.BrandFont}`}
                type="submit"
              >
                Submit / Failed
              </Button>
            )}
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default ReviewCreateForm;
