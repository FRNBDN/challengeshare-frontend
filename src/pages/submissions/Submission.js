import React, { useEffect, useState } from "react";
import Avatar from "../../components/Avatar";
import {
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
  Button,
  Container,
} from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import Collapse from "react-bootstrap/Collapse";
import { Link, useLocation } from "react-router-dom";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import ReviewCreateForm from "../reviews/ReviewCreateForm";
import appStyles from "../../App.module.css";
import styles from "../../styles/Submission.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

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
    updated_at,
    Feed,
    has_reviewed,
  } = props;

  const currentUser = useCurrentUser();
  const curr_user_img = currentUser?.profile_image;
  const is_owner = currentUser?.username === owner;
  const [uploads, setUploads] = useState({ results: [] });
  const [dare, setDare] = useState({});
  const [review, setReview] = useState({ results: [] });
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
        console.log(error);
      }
    };
    setHasLoaded(false);
    fetchUploads();
  }, [id, pathname, challenge]);

  return (
    <Card className={`mb-2 ${appStyles.Card} `}>
      <Card.Body className={`p-1 ${appStyles.CardTop} ${styles.Color}`}>
        <Row className="d-flex justify-content-between align-items-center mt-0">
          <Col>
            {Feed ? (
              <Link to={`/submissions/${id}`}>
                <span className={appStyles.BrandFont}>SUB</span>
              </Link>
            ) : (
              <span className={appStyles.BrandFont}>SUB</span>
            )}
            <Link to={`/profiles/${profile_id}`}>
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
        <div className="d-flex justify-content-between align-items-center mt-0">
          {Feed ? (
            <Link to={`/submissions/${id}`}>
              <Card.Text>{text}</Card.Text>
            </Link>
          ) : (
            <Card.Text>{text}</Card.Text>
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
                  setSubmission={setSubmission}
                  setReview={setReview}
                  dare_id={dare.id}
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
