import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Form, Button, Col, Row, Container, Alert } from "react-bootstrap";
import axios from "axios";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import formStyles from "../../styles/Forms.module.css";
import styles from "../../styles/SignInUpForm.module.css";
import appStyles from "../../App.module.css";
import { useRedirect } from "../../hooks/useRedirect";

const SignInForm = () => {
  const setCurrentUser = useSetCurrentUser();
  useRedirect("loggedIn");

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      navigate(-1);
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <Container className={styles.Background}>
      <Row>
        <Col xs={12} md={6} lg={4}>
          <h1 className={styles.BackgroundText}>
            DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/DARE/SHARE/
          </h1>
          <Container className={`p-4 ${appStyles.Box} ${styles.Box} `}>
            <h1>SIGN IN</h1>
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
              <Form.Group className="mb-3" controlId="password">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control
                  className={formStyles.Input}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.password?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))}
              <Button className={appStyles.Button} type="submit">
                Sign In
              </Button>
              <span className="mx-2"> /</span>
              <Link to="/signup">Sign Up</Link>
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

export default SignInForm;
