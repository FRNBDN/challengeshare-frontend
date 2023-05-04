import React, { useState } from "react";
import Avatar from "../../components/Avatar";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";
import ReviewEditForm from "./ReviewEditForm";

const Review = (props) => {
  const {
    id,
    profile_id,
    profile_image,
    owner,
    updated_at,
    created_at,
    body,
    vote_pass,
    setSubmission,
    setReviews,
    submission,
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/reviews/${id}`);
      setSubmission((prevSubmission) => ({
        results: [
          {
            ...prevSubmission.results[0],
            reviews: prevSubmission.results[0].reviews - 1,
            has_submitted: false,
          },
        ],
      }));
      setReviews((prevReviews) => ({
        ...prevReviews,
        results: prevReviews.results.filter((review) => review.id !== id),
      }));
    } catch (err) {}
  };

  return (
    <div>
      <Card>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Card.Body className="align-self-center ml-2">
          <span>{owner}</span>
          <span>Voted: {vote_pass ? "Pass" : "Fail"}</span>
          {is_owner && (
            <>
              <Button onClick={() => setShowEditForm(true)}>
                <i className="fa-solid fa-pen-to-square"></i>
              </Button>
              <Button onClick={handleDelete}>
                <i className="fa-solid fa-x"></i>
              </Button>
            </>
          )}
          <span>{updated_at}</span>
          {showEditForm ? (
            <ReviewEditForm
              id={id}
              profile_id={profile_id}
              body={body}
              profileImage={profile_image}
              setReviews={setReviews}
              setShowEditForm={setShowEditForm}
              submission={submission}
              vote_pass={vote_pass}
            />
          ) : (
            <p>{body}</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Review;
