import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Asset from "../../components/Asset";

import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";

import TopProfiles from "./TopProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import { Button, Card, Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

function ProfilePage() {
  return (
    <Row>
      <Col className="p-0" md={9}>
        <TopProfiles mobile />
        <Container>
          {hasLoaded ? (
            <>
              <Row>
                <Col xs={4} className="px-0">
                  {mainProfile}
                </Col>
                <Col xs={8}>{mainProfileContent}</Col>
              </Row>
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
      <Col md={3} className="d-none d-md-block ps-2">
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
  );
}

export default ProfilePage;
