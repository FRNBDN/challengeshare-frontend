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
      <span>Follow</span>
    </OverlayTrigger>
  ) : cfollow_id ? (
    <Button onClick={handleUnfollow}>Followed</Button>
  ) : currentUser ? (
    <Button onClick={handleFollow}>Follow</Button>
  ) : (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>Log in to follow</Tooltip>}
    >
      <span>Follow</span>
    </OverlayTrigger>
  );
  return (
    <Card>
      <Card.Body>
        <Row className="d-flex justify-content-between">
          <Col>
            <Link to={`profiles/${profile_id}`}>
              <Avatar src={profile_image} /> {owner}
            </Link>
          </Col>
          <Col>
            <div className="d-flex align-items-end">
              <span>{updated_at}</span>
              <span>{is_owner && ":)"}</span>
            </div>
          </Col>
        </Row>
      </Card.Body>
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div>{title && <Card.Title>{title} </Card.Title>}</div>
          <div>
            <span>Following: {users_count}</span>
            {follow_btn}
          </div>
        </div>
        <Row className="d-flex justify-content-between">
          <Col>{description && <Card.Text>{description}</Card.Text>}</Col>
          <Col>
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
      </Card.Body>
    </Card>
  );
};

export default Dare;
