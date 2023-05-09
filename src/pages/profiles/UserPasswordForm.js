import React, { useEffect, useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

import { useNavigate, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import appStyles from "../../App.module.css";
import formStyles from "../../styles/Forms.module.css";
import styles from "../../styles/UserPasswordForm.module.css";

// user password form on the edit profile page
const UserPasswordForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = useCurrentUser();

  const [userData, setUserData] = useState({
    new_password1: "",
    new_password2: "",
  });
  const { new_password1, new_password2 } = userData;

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (currentUser?.profile_id?.toString() !== id) {
      // redirect user if they are not the owner of this profile
    }
  }, [currentUser, navigate, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.post("/dj-rest-auth/password/change/", userData);
      navigate(`/profiles/${id}`);
    } catch (error) {
      //console.log(error);
      setErrors(error.response?.data);
    }
  };

  return (
    <Container
      className={`${formStyles.ThickBorder} ${formStyles.Relative} mt-3`}
    >
      <h6 className={`${formStyles.BorderText} ${styles.TextPosition}`}>
        Change Password:
      </h6>
      <Form onSubmit={handleSubmit} className="d-flex flex-column">
        <Form.Group className={appStyles.ThickBorder}>
          <Form.Label className={appStyles.BrandFont}>New password:</Form.Label>
          <Form.Control
            className={formStyles.Input}
            placeholder="new password"
            type="password"
            value={new_password1}
            onChange={handleChange}
            name="new_password1"
          />
        </Form.Group>
        {errors?.new_password1?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}
        <Form.Group>
          <Form.Label className={appStyles.BrandFont}>
            Confirm password:
          </Form.Label>
          <Form.Control
            className={formStyles.Input}
            placeholder="confirm new password"
            type="password"
            value={new_password2}
            onChange={handleChange}
            name="new_password2"
          />
        </Form.Group>
        {errors?.new_password2?.map((message, idx) => (
          <Alert key={idx} variant="warning">
            {message}
          </Alert>
        ))}
        <Button className={`flex-fill ${appStyles.Button} mt-3`} type="submit">
          Update
        </Button>
      </Form>
    </Container>
  );
};

export default UserPasswordForm;
