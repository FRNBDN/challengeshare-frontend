import React from "react";
import { Col, Row } from "react-bootstrap";
import TopProfiles from "./TopProfiles";
import ProfileEditForm from "./ProfileEditForm";
import UsernameForm from "./UsernameForm";
import UserPasswordForm from "./UserPasswordForm";

import appStyles from "../../App.module.css";
import { Link } from "react-router-dom";

const ProfileEditPage = () => {
  return (
    <>
      <h1>Profile</h1>
      <Row>
        <TopProfiles mobile />
        <Col className="p-0 " md={9}>
          <Row>
            <Col>
              <UsernameForm />
            </Col>

            <Col>
              <UserPasswordForm />
            </Col>
          </Row>

          <Row>
            <ProfileEditForm />
          </Row>
        </Col>
        <Col md={3} className="d-none d-md-block ps-2 ">
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
