import React from "react";
import { Link } from "react-router-dom";

import { Form, Button, Image, Col, Row, Container } from "react-bootstrap";

const SignUpForm = () => {
  return (
    <Row>
      <Col className="my-auto">
        <Container className={`p-4`}>
          <h1>SIGN UP</h1>
          <Form>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password1">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password1"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password2">
              <Form.Label className="d-none">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="password2"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </Form>
        </Container>
        <Container className={`mt-3`}>
          <Link to="/signin">
            Already have an account? <span>Sign in</span>
          </Link>
        </Container>
      </Col>
    </Row>
  );
};

export default SignUpForm;
