import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import { axiosReq } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

import appStyles from "../../App.module.css";
import formStyles from "../../styles/Forms.module.css";
import styles from "../../styles/ProfileEditForm.module.css";

const ProfileEditForm = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const imageFile = useRef();

  const [profileData, setProfileData] = useState({
    bio: "",
    image: "",
  });
  const { bio, image } = profileData;

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/${id}`);
        const { bio, image } = data;

        setProfileData({ bio, image });
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [currentUser, navigate, id]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("bio", bio);

    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile?.current?.files[0]);
    }

    try {
      const { data } = await axiosReq.put(`/profiles/${id}`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.image,
      }));
      navigate(`/profiles/${id}`);
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  const textFields = (
    <>
      <Form.Group className="mt-3">
        <Form.Label
          className={`${appStyles.BrandFont} ${appStyles.Box} m-0 w-100`}
        >
          Change Bio
        </Form.Label>
        <Form.Control
          className={formStyles.Input}
          as="textarea"
          value={bio}
          onChange={handleChange}
          name="bio"
          rows={6}
        />
      </Form.Group>

      {errors?.bio?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
    </>
  );

  return (
    <Form
      onSubmit={handleSubmit}
      className={`${formStyles.Relative} ${formStyles.ThickBorder} mt-3 mt-md-0 mx-0`}
    >
      <h6 className={`${formStyles.BorderText} ${styles.TextPosition} `}>
        Update Profile:{" "}
      </h6>
      <Row>
        <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
          <Container>
            <Form.Group className={`${appStyles.Box} `}>
              {image && (
                <figure className="m-0">
                  <Image src={image} fluid />
                </figure>
              )}
              {errors?.image?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <div className="d-flex">
                <Form.Label
                  className={`${appStyles.Button} flex-grow-1 m-0`}
                  htmlFor="image-upload"
                >
                  Change Image
                </Form.Label>
              </div>
              <Form.Control
                className={`d-none`}
                type="file"
                id="image-upload"
                ref={imageFile}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length) {
                    setProfileData({
                      ...profileData,
                      image: URL.createObjectURL(e.target.files[0]),
                    });
                  }
                }}
              />
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
          <Container>{textFields}</Container>
        </Col>
      </Row>
      <div className="d-flex">
        <Button className={`${appStyles.Button} text-right`} type="submit">
          save
        </Button>
      </div>
    </Form>
  );
};

export default ProfileEditForm;
