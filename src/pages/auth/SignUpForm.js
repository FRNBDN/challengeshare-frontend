import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import axios from "axios";
import formStyles from "../../styles/Forms.module.css";
import styles from "../../styles/SignInUpForm.module.css";
import appStyles from "../../App.module.css";
import { useRedirect } from "../../hooks/useRedirect";

const SignUpForm = () => {
  useRedirect("loggedIn");
  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  const { username, password1, password2 } = signUpData;

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/dj-rest-auth/registration/", signUpData);
      navigate("/signin");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <Container className={styles.Background}>
      <Row>
        <Col xs={12} md={6} lg={4}>
          <h1 className={`${styles.BackgroundText}`}>
            DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/
          </h1>
          <Container className={`p-4 ${appStyles.Box} ${styles.Box} `}>
            <h1>SIGN UP</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label className="d-none">Username</Form.Label>
                <Form.Control
                  className={formStyles.Input}
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.username?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}

              <Form.Group className="mb-3" controlId="password1">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                  className={formStyles.Input}
                  type="password"
                  placeholder="Password"
                  name="password1"
                  value={password1}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.password1?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))}

              <Form.Group className="mb-3" controlId="password2">
                <Form.Label className="d-none">Confirm Password</Form.Label>
                <Form.Control
                  className={formStyles.Input}
                  type="password"
                  placeholder="Confirm Password"
                  name="password2"
                  value={password2}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.password2?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))}

              <Button className={appStyles.Button} type="submit">
                Sign Up
              </Button>
              <span className="mx-2"> /</span>
              <Link to="/signin">Sign In</Link>
              {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-3">
                  {message}
                </Alert>
              ))}
            </Form>
          </Container>
        </Col>
        <Col xs={0} md={6} lg={8}></Col>
      </Row>
    </Container>
  );
};

export default SignUpForm;
