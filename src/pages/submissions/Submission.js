import React from "react";
import Avatar from "../../components/Avatar";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Submission = (props) => {
  const {
    owner,
    text,
    is_owner,
    profile_id,
    profile_image,
    status,
    reviews,
    uploads,
    created_at,
    updated_at,
  } = props;

  return (
    <div>
      <Card>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Card.Body className="align-self-center ml-2">
          <span>{owner}</span>
          <span>{updated_at}</span>
          <span>{status}</span>
          <p>{text}</p>
          <span>{reviews}</span>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Submission;
