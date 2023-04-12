import React from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";

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
    criteria,
    completed_count,
    created_at,
    updated_at,
    users_count,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const follow_btn = is_owner ? (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>Can't follow own posts</Tooltip>}
    >
      <span>Follow</span>
    </OverlayTrigger>
  ) : cfollow_id ? (
    <span onClick={() => {}}>Followed</span>
  ) : currentUser ? (
    <span onClick={() => {}}>Follow</span>
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
          <Col>{criteria && <Card.Text>Criteria here</Card.Text>}</Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Dare;