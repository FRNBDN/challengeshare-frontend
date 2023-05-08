import React, { useState } from "react";
import { Link } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Row from "react-bootstrap/Row";
import Tooltip from "react-bootstrap/Tooltip";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";

import Avatar from "../../components/Avatar";
import ReviewEditForm from "./ReviewEditForm";

import appStyles from "../../App.module.css";
import styles from "../../styles/Review.module.css";
import timeStyle from "../../styles/Timestap.module.css";

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
    <Container className={`${appStyles.Box}`}>
      <Row>
        <Col xs={2} xl={1} className="px-0">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={60} />
          </Link>
        </Col>
        <Col>
          <Row>
            <Col className="d-flex justify-content-between px-0 ">
              <div className={``}>
                <Link to={`/profiles/${profile_id}`}>
                  <span className={`${appStyles.BrandFont} pe-1`}>{owner}</span>
                </Link>
                <span className={`pe-1`}>
                  {updated_at !== created_at ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Updated: {updated_at}</Tooltip>}
                    >
                      <span className={timeStyle.Updated}>{created_at}</span>
                    </OverlayTrigger>
                  ) : (
                    <span>{created_at}</span>
                  )}
                </span>
                {is_owner && (
                  <Link onClick={() => setShowEditForm(true)}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                )}
              </div>

              <div className={` ${appStyles.BrandFont}`}>
                <span className="d-none d-sm-inline-block">Voted: </span>
                {vote_pass ? (
                  <span className={styles.Pass}>Pass</span>
                ) : (
                  <span className={styles.Fail}>Fail</span>
                )}
              </div>
              <div>
                {is_owner && (
                  <Link className="px-2" onClick={handleDelete}>
                    <i className="fa-solid fa-x"></i>
                  </Link>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            {" "}
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
              <div
                className={`d-flex align-items-center justify-content-start `}
              >
                {body}
              </div>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Review;
