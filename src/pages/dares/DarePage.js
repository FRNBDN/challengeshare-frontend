import React, { useEffect, useState } from "react";

import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { Col } from "react-bootstrap";
import Dare from "./Dare";

function DarePage() {
  const { id } = useParams();
  const [dare, setDare] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: dare }] = await Promise.all([
          axiosReq.get(`challenges/${id}`),
        ]);
        setDare({ results: [dare] });
      } catch (error) {
        console.log(error);
      }
    };
    handleMount();
  }, [id]);

  return (
    <Row>
      <Col md={10}>
        <Row className="d-block d-md-none">Top Bar</Row>
        <Row className="h-100">
          <Col>
            <Container>
              <Dare {...dare.results[0]} setDares={setDare} />
            </Container>
            <Container>Submissions</Container>
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
