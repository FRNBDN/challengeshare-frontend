import React from "react";
import Avatar from "../../components/Avatar";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Review = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    created_at,
    body,
    vote_pass,
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
          <span>Voted: {vote_pass ? "Pass" : "Fail"}</span>
          <p>{body}</p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Review;
