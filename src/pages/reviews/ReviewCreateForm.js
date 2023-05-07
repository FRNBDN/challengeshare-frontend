import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { Button, InputGroup } from "react-bootstrap";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import Avatar from "../../components/Avatar";
import { Link, useLocation } from "react-router-dom";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import styles from "../../styles/ReviewCreateFrom.module.css";
import formStyles from "../../styles/Forms.module.css";

const ReviewCreateForm = (props) => {
  const {
    submission,
    setSubmission,
    setSubmissions,
    profileImage,
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
      await axiosRes.post("/reviews/", {
        body,
        submission,
        vote_pass,
      });

      Feed
        ? setSubmissions((prevSubmissions) => ({
            results: prevSubmissions.results.map((sub) => {
              if (sub.id === submission) {
                return {
                  ...sub,
                  has_reviewed: true,
                  reviews: sub.reviews + 1,
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
                reviews: prevSubmission.results[0].reviews + 1,
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
        <Form onSubmit={handleSubmit} className="pt-3">
          <Row>
            <Col>
              <Form.Group>
                <InputGroup>
                  <Form.Label className="d-none">Additional Comment</Form.Label>
                  <Avatar src={profileImage} />

                  <Form.Control
                    className={formStyles.Input}
                    placeholder="Write additional info about your review decision"
                    as="textarea"
                    value={body}
                    onChange={handleChange}
                    rows={5}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col>
              <span className={`${appStyles.BrandFont}  mb-1`}>Criteria:</span>
              {hasLoaded ? (
                <>
                  {criteria.results.length ? (
                    criteria.results.map((criterion) => (
                      <div key={`${criterion.id}`}>
                        <Form.Check
                          className={appStyles.BrandFont}
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
            <span className="mx-2"> /</span>
            <Link
              onClick={() => {
                setBody("");
                setOpen(false);
                criteria.results.forEach((criterion) => {
                  document.getElementById(`${criterion.id}`).checked = false;
                });
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

export default ReviewCreateForm;
