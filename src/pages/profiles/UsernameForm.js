import React, { useEffect, useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

import { useNavigate, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

import appStyles from "../../App.module.css";
import formStyles from "../../styles/Forms.module.css";
import styles from "../../styles/UsernameForm.module.css";

// username update form component that is on the profile edit page
const UsernameForm = () => {
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();

  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  useEffect(() => {
    if (currentUser?.profile_id?.toString() === id) {
      setUsername(currentUser.username);
    }
  }, [currentUser, navigate, id]);

  // updates individually
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put("/dj-rest-auth/user/", {
        username,
      });
      setCurrentUser((prevUser) => ({
        ...prevUser,
        username,
      }));
      navigate(`/profiles/${id}`);
    } catch (error) {
      //console.log(error);
      setErrors(error.response?.data);
    }
  };

  return (
    <Container className={`${formStyles.Relative} ${formStyles.ThickBorder}`}>
      <Form onSubmit={handleSubmit} className="my-2 ">
        <Form.Group>
          <Form.Label
            className={`${formStyles.BorderText} ${styles.TextPosition} ${appStyles.BrandFont}`}
          >
            Change Username:
          </Form.Label>
          <div className="d-flex ">
            <Form.Control
              className={formStyles.Input}
              placeholder="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Button className={appStyles.Button} type="submit">
              Update
            </Button>
          </div>
        </Form.Group>
        {errors?.username?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}
      </Form>
    </Container>
  );
};

export default UsernameForm;
