import React, { useEffect, useState } from "react";

import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { Col } from "react-bootstrap";
import Dare from "./Dare";

import appStyles from "../../App.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Submission from "../submissions/Submission";

function DarePage() {
  const { id } = useParams();
  const [dare, setDare] = useState({ results: [] });
  const [submissions, setSubmissions] = useState({ results: [] });
  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: dare }, { data: submissions }] = await Promise.all([
          axiosReq.get(`challenges/${id}`),
          axiosReq.get(`/submissions/?challenge=${id}`),
        ]);
        setDare({ results: [dare] });
        setSubmissions(submissions);
      } catch (error) {
        console.log(error);
      }
    };
    handleMount();
  }, [id]);

  return (
    <Row>
      <h1 className={appStyles.BrandFont}>Dares / Detail</h1>
      <Col md={10}>
        <Row className="d-block d-md-none">Top Bar</Row>
        <Row className="h-100">
          <Col>
            <Container className="px-0">
              <Dare {...dare.results[0]} setDares={setDare} />
            </Container>
            <Container>
              {submissions.results.length ? (
                submissions.results.map((submission) => (
                  <Submission key={submission.id} {...submission} />
                ))
              ) : currentUser ? (
                <span>Be the first to share a submission! </span>
              ) : (
                <span>No submissions for this dare.</span>
              )}
            </Container>
          </Col>
        </Row>
      </Col>
      <Col md={2} className="d-none d-md-block">
        Sidebar
      </Col>
    </Row>
  );
}

export default DarePage;
