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
          <Row className="d-block d-md-none">Top Bar</Row>
          <Row className="h-100">
            <div>
              <Link to="/dares/byfollowed">Dares by Followed Users</Link>
              <Link to="/dares/following">Followed Dares</Link>
              <Link to="/dares">All</Link>
            </div>
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
          Sidebar
        </Col>
      </Row>
    </>
  );
}

export default DaresFeedPage;
