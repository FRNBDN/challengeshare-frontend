import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import { axiosReq, axiosRes } from "../../api/axiosDefaults";

import Avatar from "../../components/Avatar";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
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
      if (dare_id !== undefined) {
        try {
          // fetches the criteria after making sure that it
          // has gotten a dare_id value
          const { data: criteria } = await axiosReq.get(
            `/criteria/?challenge=${dare_id}`
          );
          setCriteria(criteria);
          setHasLoaded(true);
        } catch (error) {
          //console.log(error);
        }
      }
    };
    setHasLoaded(false);
    fetchCriteria();
  }, [dare_id, pathname]);

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  // checks if all checkboxes have been clicked, if so
  // the vote_pass = true
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
      //console.log(error);
    }
  };

  return (
    <Row>
      <Col>
        <Form onSubmit={handleSubmit} className="pt-3">
          <Row>
            <Col xs={12} md={8}>
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
            <Col xs={12} md={4}>
              <Container className="d-flex  justify-content-around d-md-block flex-wrap">
                <span
                  className={`${appStyles.BrandFont} text-center mb-1 w-100`}
                >
                  Criteria:
                </span>
                {hasLoaded ? (
                  <>
                    {/* render all the criteria */}
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
              </Container>
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
