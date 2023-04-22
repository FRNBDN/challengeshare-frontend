import React, { useEffect, useState } from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import {
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
  Button,
  Container,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import Criteria from "./Criteria";
import Asset from "../../components/Asset";
import appStyles from "../../App.module.css";
import styles from "../../styles/Dare.module.css";

const Dare = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    submissions_count,
    submissions,
    title,
    cfollow_id,
    tags,
    description,
    completed_count,
    created_at,
    updated_at,
    users_count,
    setDares,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const [hasLoaded, setHasLoaded] = useState(false);
  const [criteria, setCriteria] = useState({ results: [] });
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const { data } = await axiosReq.get(`/criteria/?challenge=${id}`);
        setCriteria(data);
        setHasLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    setHasLoaded(false);
    fetchCriteria();
  }, [id, pathname]);

  const handleFollow = async () => {
    try {
      const { data } = await axiosRes.post("cfollowers/", { challenge: id });
      setDares((prevDares) => ({
        ...prevDares,
        results: prevDares.results.map((challenge) => {
          return challenge.id === id
            ? {
                ...challenge,
                users_count: challenge.users_count + 1,
                cfollow_id: data.id,
              }
            : challenge;
        }),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axiosRes.delete(`cfollowers/${cfollow_id}`);
      setDares((prevDares) => ({
        ...prevDares,
        results: prevDares.results.map((challenge) => {
          return challenge.id === id
            ? {
                ...challenge,
                users_count: challenge.users_count - 1,
                cfollow_id: null,
              }
            : challenge;
        }),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const follow_btn = is_owner ? (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>Can't follow own posts</Tooltip>}
    >
      <span>
        <Button
          disabled
          className={`${appStyles.Button} ${appStyles.disabled} ${styles.Smaller} py-1 px-2`}
        >
          <i className="fa-regular fa-bookmark"></i>
        </Button>
      </span>
    </OverlayTrigger>
  ) : cfollow_id ? (
    <Button
      className={`${styles.Smaller} ${appStyles.Button} ${styles.Followed} py-1 px-2`}
      onClick={handleUnfollow}
    >
      <i className="fa-solid fa-bookmark"></i>
    </Button>
  ) : currentUser ? (
    <Button
      className={` ${appStyles.Button} ${styles.Smaller} py-1 px-2`}
      onClick={handleFollow}
    >
      <i className="fa-regular fa-bookmark"></i>
    </Button>
  ) : (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>Log in to follow</Tooltip>}
    >
      <span>
        <Button
          disabled
          className={`${styles.Smaller} ${appStyles.Button} ${appStyles.disabled} py-1 px-2`}
        >
          <i className="fa-regular fa-bookmark"></i>
        </Button>
      </span>
    </OverlayTrigger>
  );
  return (
    <Card className={`mb-2 ${styles.Card}`}>
      <Card.Body className={`p-1 ${styles.CardTop}`}>
        <Row className="d-flex justify-content-between align-items-center mt-0">
          <Col>
            <Link to={`profiles/${profile_id}`}>
              <Avatar src={profile_image} height={20} /> {owner}
            </Link>
          </Col>
          <Col>
            <div className="d-flex justify-content-end me-1">
              <span>{updated_at}</span>
            </div>
          </Col>
        </Row>
      </Card.Body>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mt-0">
          <div>
            {title && (
              <Card.Title className={appStyles.BrandFont}>{title} </Card.Title>
            )}
          </div>
          <div className="d-flex align-items-center">
            <span className="me-1">
              <i className={`fa-solid fa-user-group`}></i>:{users_count}
            </span>
            {follow_btn}
          </div>
        </div>
        <Row className="d-flex justify-content-between">
          <Col>
            {description && (
              <Card.Text className={`ps-1`}>{description}</Card.Text>
            )}
          </Col>
          <Col>
            <Card.Text className={`${appStyles.BrandFont}  mb-1`}>
              Criteria:
            </Card.Text>
            {hasLoaded ? (
              <>
                {criteria.results.length ? (
                  criteria.results.map((criterion) => (
                    <Criteria
                      key={criterion.id}
                      {...criterion}
                      setCriteria={setCriteria}
                    />
                  ))
                ) : (
                  <Card.Text> No criteria submitted </Card.Text>
                )}
              </>
            ) : (
              <Container>
                <Asset spinner />
              </Container>
            )}
          </Col>
        </Row>
        <span className="d-flex justify-content-end">
          {is_owner && <i className="fa-solid fa-pen-to-square"></i>}
        </span>
      </Card.Body>
    </Card>
  );
};

export default Dare;
