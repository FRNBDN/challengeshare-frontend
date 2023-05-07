import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import TopProfiles from "./TopProfiles";
import ProfileEditForm from "./ProfileEditForm";
import UsernameForm from "./UsernameForm";
import UserPasswordForm from "./UserPasswordForm";

import appStyles from "../../App.module.css";
import formStyles from "../../styles/Forms.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Asset from "../../components/Asset";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const validateProfile = async () => {
      if (currentUser?.profile_id?.toString() === id) {
        setHasLoaded(true);
      } else {
        navigate(-1);
      }
    };
    const timer = setTimeout(() => {
      validateProfile();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [currentUser, navigate, id]);

  return (
    <>
      <h1 className="pb-2">
        <Link to={`/profiles/${id}`}>Profile</Link> / Edit
      </h1>
      <Row>
        <TopProfiles mobile />
        <Col className="p-0" md={9}>
          {hasLoaded ? (
            <Row>
              <Col xs={12} md={4} className="mt-1 mt-md-0">
                <UsernameForm />
                <UserPasswordForm />
              </Col>

              <Col xs={12} md={8} className="pe-md-4 ps-md-0">
                <ProfileEditForm />
              </Col>
            </Row>
          ) : (
            <Asset spinner />
          )}
        </Col>
        <Col md={3} className="d-none d-md-block">
          <Row>
            <div className="d-flex flex-column px-0 pb-3 ">
              <Link
                to="/dares/create"
                className={`${appStyles.Button} m-0 flex-fill py-2`}
              >
                <h6>Create New Dare</h6>
              </Link>
            </div>
          </Row>
          <Row>
            <TopProfiles />
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default ProfileEditPage;
