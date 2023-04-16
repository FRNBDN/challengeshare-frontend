import React from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import styles from "../../App.module.css";

function DaresFeedPage() {
  return (
    <>
      <h1 className={styles.BrandFont}>Dares</h1>
      <Row className="h-100">
        <Col>
          <p>List of posts here</p>
        </Col>
      </Row>
    </>
  );
}

export default DaresFeedPage;
