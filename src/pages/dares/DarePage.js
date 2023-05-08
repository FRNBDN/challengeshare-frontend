import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";

import appStyles from "../../App.module.css";

import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Dare from "./Dare";
import TopProfiles from "../profiles/TopProfiles";
import SubmissionSmall from "../submissions/SubmissionSmall";
import Asset from "../../components/Asset";

function DarePage() {
  const { id } = useParams();
  const [dare, setDare] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [submissions, setSubmissions] = useState({ results: [] });
  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: dare }, { data: submissions }] = await Promise.all([
          axiosReq.get(`/challenges/${id}`),
          axiosReq.get(`/submissions/?challenge=${id}`),
        ]);
        setDare({ results: [dare] });
        setSubmissions(submissions);
        setHasLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    handleMount();
  }, [id]);

  return (
    <Row>
      <h1 className={appStyles.BrandFont}>
        <Link to="/dares">Dares</Link> / Detail
      </h1>
      <Col md={9}>
        <TopProfiles mobile />
        <Row className="h-100">
          <Col>
            {hasLoaded ? (
              <>
                <Container className="px-0">
                  <Dare {...dare.results[0]} setDare={setDare} />
                </Container>
                <Container className="px-0">
                  <div>
                    <h5>Submissions:</h5>
                  </div>
                  {submissions.results.length ? (
                    submissions.results.map((submission) => (
                      <SubmissionSmall key={submission.id} {...submission} />
                    ))
                  ) : currentUser ? (
                    <span>Be the first to share a submission! </span>
                  ) : (
                    <span>No submissions for this dare.</span>
                  )}
                </Container>
              </>
            ) : (
              <Asset spinner />
            )}
          </Col>
        </Row>
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

export default DarePage;
