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
  const [hasLoaded, setHasLoaded] = useState(false);
  const currentUser = useCurrentUser();
  const { id } = useParams();
  const setProfileData = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }] = await Promise.all([
          axiosReq.get(`/profiles/${id}`),
        ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setHasLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id, setProfileData]);

  const mainProfile = (
    <>
      <Container className={appStyles.Box}>
        <Row noGutters className="px-0 text-center d-flex align-items-center">
          <Col xs={5} className="text-start">
            <Row>
              <Image roundedCircle src={profile?.image} className="px-0 mx-0" />
            </Row>
          </Col>
          <Col xs={7}>
            <Row>
              <h5 className={`text-start ${appStyles.BrandFont}`}>
                {profile?.owner}
              </h5>
              <div className={styles.SubText}>
                user since {profile?.created_at}
              </div>
            </Row>
          </Col>
        </Row>
        <Row className="my-1 d-flex justify-content-center">
          {profile?.bio} asdasd
        </Row>
        <hr />
        <Row>
          <Col xs={6}>
            <div>Submission Points</div>
            <div>{profile?.submissions_interactions}</div>
          </Col>
          <Col xs={6}>
            <div>Dare Points</div>
            <div>{profile?.challenges_interactions}</div>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={6}>
            <div>Followers</div>
            <div>{profile?.followers_count}</div>
          </Col>
          <Col xs={6}>
            <div>Following</div>
            <div>{profile?.following_count}</div>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center mt-2">
          {currentUser &&
            !is_owner &&
            (profile?.following_id ? (
              <Button className={`${appStyles.Button}`} onClick={() => {}}>
                unfollow
              </Button>
            ) : (
              <Button className={`${appStyles.Button}`} onClick={() => {}}>
                follow
              </Button>
            ))}
        </Row>
      </Container>
    </>
  );

  const mainProfileContent = (
    <>
      <Row>
        <Col
          className={`d-flex flex-wrap flex-md-nowrap flex-column flex-md-row`}
        >
          <Button className={`${appStyles.Button} flex-fill`}>
            Sub
            <span className="d-inline-block d-md-none d-lg-inline-block">
              missions
            </span>
          </Button>
          <Button className={`${appStyles.Button} flex-fill `}>Dares</Button>

          <Button className={`${appStyles.Button} flex-fill`}>Followers</Button>
          <Button className={`${appStyles.Button} flex-fill`}>Following</Button>
        </Col>
      </Row>
      <Container className={`${appStyles.Box}`}>
        <Row>
          <Col>Content here</Col>
        </Row>
      </Container>
    </>
  );

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
