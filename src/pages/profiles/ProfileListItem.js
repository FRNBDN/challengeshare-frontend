import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import { axiosReq } from "../../api/axiosDefaults";
import Avatar from "../../components/Avatar";

import styles from "../../styles/ProfileListItem.module.css";
import appStyles from "../../App.module.css";

const ProfileListItem = (props) => {
  const { id } = props;
  const [profile, setProfile] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/${id}`);
        setProfile(data);
        setHasLoaded(true);
      } catch (error) {
        // console.log(error);
      }
    };
    handleMount();
  }, [id]);

  return (
    <Container className={`${appStyles.Box}`}>
      {hasLoaded ? (
        <Row>
          <Col
            xs={4}
            className="d-flex align-items-center px-1 justify-content-start"
          >
            <div>
              <Link className="align-self-center" to={`/profiles/${id}`}>
                <Avatar src={profile?.image} height={30} nomargin />
                <span className={`${appStyles.BrandFont} ps-1`}>
                  {profile?.owner}
                </span>
              </Link>
            </div>
          </Col>

          <Col
            xs={2}
            className={`d-flex align-items-center px-0 justify-content-center`}
          >
            <div className="text-center">
              <div className={`text-center ${appStyles.BrandFont}`}>
                {profile?.submissions_interactions}
              </div>
              <div className={styles.Date}>Sub Points</div>
            </div>
          </Col>

          <Col
            xs={2}
            className={`d-flex align-items-center px-0 justify-content-center`}
          >
            <div className="text-center">
              <div className={`text-center ${appStyles.BrandFont}`}>
                {profile?.challenges_interactions}
              </div>
              <div className={styles.Date}>Dare Points</div>
            </div>
          </Col>

          <Col
            xs={2}
            className={`d-flex align-items-center px-0 justify-content-center`}
          >
            <div className="text-center">
              <div className={`text-center ${appStyles.BrandFont}`}>
                {profile?.followers_count}
              </div>
              <div className={styles.Date}>Followers</div>
            </div>
          </Col>

          <Col xs={2} className="px-0 d-flex justify-content-center">
            <div className="text-center">
              <div className={`text-center ${appStyles.BrandFont}`}>
                {profile?.following_count}
              </div>
              <div className={styles.Date}>Following</div>
            </div>
          </Col>
        </Row>
      ) : (
        <div className="text-center">
          <Spinner />
        </div>
      )}
    </Container>
  );
};

export default ProfileListItem;
