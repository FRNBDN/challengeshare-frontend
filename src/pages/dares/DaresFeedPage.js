import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import styles from "../../App.module.css";
import { Link, useLocation } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Dare from "./Dare";
import Asset from "../../components/Asset";

function DaresFeedPage({ message, filter = "" }) {
  const [dares, setDares] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchDares = async () => {
      try {
        const { data } = await axiosReq.get(`/challenges/?${filter}`);
        setDares(data);
        setHasLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    setHasLoaded(false);
    fetchDares();
  }, [filter, pathname]);

  return (
    <>
      <h1 className={styles.BrandFont}>Dares</h1>
      <Row>
        <Col md={10}>
          <Row className="d-block d-md-none">
            <Col className="d-flex justify-content-between">
              <Link to="/dares">All</Link>
              <Link to="/dares/incomplete">Incomplete</Link>
              <Link to="/dares/byfollowed">Followed Users</Link>
              <Link to="/dares/following">Followed Dares</Link>
            </Col>
          </Row>
          <Row className="h-100">
            <Col>
              {hasLoaded ? (
                <>
                  {dares.results.length ? (
                    dares.results.map((dare) => (
                      <Dare key={dare.id} {...dare} setDares={setDares} />
                    ))
                  ) : (
                    <Container>
                      <Asset message={message} />
                    </Container>
                  )}
                </>
              ) : (
                <Container>
                  <Asset spinner />
                </Container>
              )}
            </Col>
          </Row>
        </Col>
        <Col md={2} className="d-none d-md-block">
          <Row>
            <Link to="/dares">All</Link>
          </Row>
          <Row>
            <Link to="/dares/incomplete">Incomplete</Link>
          </Row>
          <Row>
            <Link to="/dares/byfollowed">By Followed</Link>
          </Row>
          <Row>
            <Link to="/dares/following">Followed</Link>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default DaresFeedPage;
