import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Row from "react-bootstrap/Row";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Carousel from "react-bootstrap/Carousel";
import Collapse from "react-bootstrap/Collapse";

import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import Asset from "../../components/Asset";
import ReviewCreateForm from "../reviews/ReviewCreateForm";
import Avatar from "../../components/Avatar";

import appStyles from "../../App.module.css";
import styles from "../../styles/Submission.module.css";
import timeStyle from "../../styles/Timestap.module.css";

const Submission = (props) => {
  const {
    id,
    owner,
    text,
    profile_id,
    profile_image,
    challenge,
    status,
    reviews,
    created_at,
    setSubmission,
    setSubmissions,
    updated_at,
    Feed,
    has_reviewed,
  } = props;

  const currentUser = useCurrentUser();
  const curr_user_img = currentUser?.profile_image;
  const is_owner = currentUser?.username === owner;
  const [uploads, setUploads] = useState({ results: [] });
  const [dare, setDare] = useState({});
  const [setReview] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const [{ data: uploads }, { data: dare }] = await Promise.all([
          axiosReq.get(`/uploads/?submission=${id}`),
          axiosReq.get(`/challenges/${challenge}`),
        ]);
        setUploads(uploads);
        setDare(dare);
        setHasLoaded(true);
      } catch (error) {
        //console.log(error);
      }
    };
    setHasLoaded(false);
    fetchUploads();
  }, [id, pathname, challenge, reviews, status]);

  return (
    <Card className={`mb-2 ${appStyles.Card} `}>
      <Card.Body className={`p-1 ${appStyles.CardTop} ${styles.Color}`}>
        <Row className="d-flex justify-content-between align-items-center mt-0">
          <Col xs={8}>
            {Feed ? (
              <Link to={`/submissions/${id}`} className={appStyles.BrandFont}>
                <span>SUB/</span>
                {status === 1 ? (
                  <span className={styles.Pending}>
                    PENDING {reviews}/3 REVIWES
                  </span>
                ) : status === 2 ? (
                  <>
                    <span className={styles.Pass}>PASS</span>
                    <span className="ps-2">- {reviews} REVIEWS</span>
                  </>
                ) : (
                  <>
                    <span className={` ${styles.Failed}`}>Failed</span>
                    <span className="ps-2">- {reviews} REVIEWS</span>
                  </>
                )}
              </Link>
            ) : (
              <span className={appStyles.BrandFont}>
                <span>SUB/</span>
                {status === 1 ? (
                  <span>
                    PENDING{" "}
                    <span className={styles.Pending}>{reviews}/3 REVIWES</span>
                  </span>
                ) : status === 2 ? (
                  <span className={styles.Pass}>PASS</span>
                ) : (
                  <span className={` ${styles.Failed}`}>FAILED</span>
                )}
              </span>
            )}
          </Col>
          <Col xs={4}>
            <div className="d-flex justify-content-end me-1">
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
            </div>
          </Col>
        </Row>
      </Card.Body>
      <Card.Body>
        <Link to={`/dares/${dare.id}`}>
          <Container>
            <h6 className={styles.BorderText}>Dare</h6>
            <Row className={styles.ThickBorder}>
              <Col xs={4}>
                <h5>{dare.title}</h5>
              </Col>
              <Col xs={8}>
                <h6>Description:</h6>
                <span>{dare.description}</span>
              </Col>
            </Row>
          </Container>
        </Link>
      </Card.Body>

      <Card.Body>
        <div className="">
          <Link
            to={`/profiles/${profile_id}`}
            className="d-flex align-items-center"
          >
            <Avatar src={profile_image} height={30} />{" "}
            <span className={`${appStyles.BrandFont} ${styles.Owner}`}>
              {owner}
            </span>
          </Link>
          {Feed ? (
            <Link to={`/submissions/${id}`}>
              <Card.Text className="ps-3 py-2">{text}</Card.Text>
            </Link>
          ) : (
            <Card.Text className="ps-3 py-2">{text}</Card.Text>
          )}
        </div>
        <Row>
          <Container className={styles.ImageField}>
            {hasLoaded ? (
              <>
                {uploads.results.length ? (
                  <Carousel
                    interval={null}
                    variant="dark"
                    controls={uploads.results.length === 1 ? false : true}
                    indicators={uploads.results.length === 1 ? false : true}
                  >
                    {uploads.results.map((upload, index) => (
                      <Carousel.Item key={upload.id}>
                        <img
                          className="d-block w-100 "
                          src={upload.upload}
                          alt={`Slide #${index}`}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <Card.Text> No uploads could be displayed </Card.Text>
                )}
              </>
            ) : (
              <Container>
                <Asset spinner />
              </Container>
            )}
          </Container>
        </Row>
        <Row>
          <Container>
            {has_reviewed ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>You can only have one review per submission</Tooltip>
                }
              >
                <span>
                  <Button
                    aria-controls="review-form-collapse"
                    disabled
                    className={`${appStyles.Button} ${appStyles.disabled} ${appStyles.BrandFont}`}
                  >
                    Reviewed
                  </Button>
                </span>
              </OverlayTrigger>
            ) : is_owner ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>You cant review your own submission</Tooltip>}
              >
                <span>
                  <Button
                    aria-controls="review-form-collapse"
                    disabled
                    className={`${appStyles.Button} ${appStyles.disabled} ${appStyles.BrandFont}`}
                  >
                    Review
                  </Button>
                </span>
              </OverlayTrigger>
            ) : currentUser ? (
              <Button
                onClick={() => setOpen(!open)}
                aria-controls="review-form-collapse"
                aria-expanded={open}
                className={`${appStyles.Button} ${appStyles.BrandFont}`}
              >
                {!open ? "Review Submission" : "Hide Form"}
              </Button>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Sign in to leave reviews</Tooltip>}
              >
                <span>
                  <Button
                    aria-controls="review-form-collapse"
                    disabled
                    className={`${appStyles.Button} ${appStyles.disabled} ${appStyles.BrandFont}`}
                  >
                    Review Submission
                  </Button>
                </span>
              </OverlayTrigger>
            )}

            <Collapse in={open}>
              <div id="review-form-collapse">
                <ReviewCreateForm
                  profile_id={currentUser?.profile_id}
                  profileImage={curr_user_img}
                  submission={id}
                  setReview={setReview}
                  dare_id={dare.id}
                  setSubmissions={setSubmissions}
                  setSubmission={setSubmission}
                  setOpen={setOpen}
                  {...(Feed && { Feed })}
                />
              </div>
            </Collapse>
          </Container>
          <span className={`d-flex justify-content-end ${styles.Edit}`}>
            {is_owner && (
              <Link to={`/submissions/${id}/edit`}>
                <i className="fa-solid fa-pen-to-square"></i>
              </Link>
            )}
          </span>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Submission;
