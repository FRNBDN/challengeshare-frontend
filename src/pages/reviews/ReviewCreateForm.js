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
    setReview,
    profileImage,
    profile_id,
    dare_id,
  } = props;
  const [body, setBody] = useState("");
  const [votePass, setVotePass] = useState(false);
  const [criteria, setCriteria] = useState({ results: [] });
  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    const votePass = criteria.results.every(
      (criterion) => document.getElementById(`${criterion.id}`).checked
    );
    setVotePass(votePass);
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
