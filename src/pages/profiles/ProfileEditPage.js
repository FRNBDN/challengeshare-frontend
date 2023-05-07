import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import TopProfiles from "./TopProfiles";
import ProfileEditForm from "./ProfileEditForm";
import UsernameForm from "./UsernameForm";
import UserPasswordForm from "./UserPasswordForm";

import appStyles from "../../App.module.css";
import formStyles from "../../styles/Forms.module.css";
import { Link } from "react-router-dom";

const ProfileEditPage = () => {
  return (
    <>
      <h1 className="pb-2">Profile / Edit</h1>
      <Row>
        <TopProfiles mobile />
        <Col className="p-0" md={9}>
          <Row>
            <Col xs={12} md={4} className="mt-1 mt-md-0">
              <UsernameForm />
              <UserPasswordForm />
            </Col>

            <Col xs={12} md={8} className="pe-md-4 ps-md-0">
              <ProfileEditForm />
            </Col>
          </Row>
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
