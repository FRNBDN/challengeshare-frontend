import React, { useEffect, useState } from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Tooltip from "react-bootstrap/Tooltip";
import Card from "react-bootstrap/Card";

import { Link, useLocation } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import Criteria from "./Criteria";
import Asset from "../../components/Asset";
import appStyles from "../../App.module.css";
import styles from "../../styles/Dare.module.css";
import SubmissionCreateForm from "../submissions/SubmissionCreateForm";
import Collapse from "react-bootstrap/Collapse";
import timeStyle from "../../styles/Timestap.module.css";

const Dare = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    submissions_count,
    has_submitted,
    title,
    cfollow_id,
    description,
    completed_count,
    created_at,
    updated_at,
    users_count,
    setDares,
    Feed,
    category,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const [hasLoaded, setHasLoaded] = useState(false);
  const [criteria, setCriteria] = useState({ results: [] });
  const { pathname } = useLocation();
  const curr_user_img = currentUser?.profile_image;
  const [submission, setSubmission] = useState({ results: [] });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const { data } = await axiosReq.get(`/criteria/?challenge=${id}`);
        setCriteria(data);
        setHasLoaded(true);
      } catch (error) {
        // console.log(error);
      }
    };
    setHasLoaded(false);
    fetchCriteria();
  }, [id, pathname, submission]);

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
      // console.log(error);
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
      // console.log(error);
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
    <Card className={`mb-2 ${appStyles.Card} `}>
      <Card.Body className={`p-1 ${appStyles.CardTop} ${styles.Color}`}>
        <Row className="d-flex justify-content-between align-items-center mt-0">
          <Col>
            <span className={appStyles.BrandFont}>
              DARE/CATEGORY:{category.toUpperCase()}
            </span>
          </Col>
          <Col>
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

      <Card.Body className="pb-0">
        <div className="d-flex justify-content-between align-items-center mt-0">
          {Feed ? (
            <Link to={`/dares/${id}`}>
              <div>
                {title && (
                  <Card.Title className={appStyles.BrandFont}>
                    {title}
                  </Card.Title>
                )}
              </div>
            </Link>
          ) : (
            <div>
              {title && (
                <Card.Title className={appStyles.BrandFont}>{title}</Card.Title>
              )}
            </div>
          )}
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
        <Row>
          <Container>
            {has_submitted ? (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>You can only share one submission</Tooltip>}
              >
                <span>
                  <Button
                    aria-controls="submission-form-collapse"
                    disabled
                    className={`${appStyles.Button} ${appStyles.disabled} ${appStyles.BrandFont}`}
                  >
                    Submitted
                  </Button>
                </span>
              </OverlayTrigger>
            ) : currentUser ? (
              <Button
                onClick={() => setOpen(!open)}
                aria-controls="submission-form-collapse"
                aria-expanded={open}
                className={`${appStyles.Button} ${appStyles.BrandFont}`}
              >
                {!open ? "Share Submission" : "Hide Form"}
              </Button>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Sign in to share your submission</Tooltip>}
              >
                <span>
                  <Button
                    aria-controls="submission-form-collapse"
                    disabled
                    className={`${appStyles.Button} ${appStyles.disabled} ${appStyles.BrandFont}`}
                  >
                    Share Submission
                  </Button>
                </span>
              </OverlayTrigger>
            )}

            <Collapse in={open}>
              <div id="submission-form-collapse">
                <SubmissionCreateForm
                  profile_id={currentUser?.profile_id}
                  profileImage={curr_user_img}
                  dare={id}
                  setDares={setDares}
                  setDare={setSubmission}
                  setSubmission={setSubmission}
                  setOpen={setOpen}
                  {...(Feed && { Feed })}
                />
              </div>
            </Collapse>
          </Container>

          <div
            className={`text-muted d-flex align-items-center justify-content-between p-0 m-0 mt-2 ${styles.ColorFooter} `}
          >
            <Link
              className={`${styles.Smaller} ps-1`}
              to={`/profiles/${profile_id}`}
            >
              <Avatar src={profile_image} height={20} /> {owner}
            </Link>
            <div className="d-flex text-center">
              <div className={`${appStyles.BrandFont} `}>
                <div className={styles.Small}>{submissions_count}</div>
                <div className={styles.Smaller}>SUB</div>
              </div>
              /
              <div className={`${appStyles.BrandFont}`}>
                <div className={`${styles.Pass} ${styles.Small}`}>
                  {completed_count}
                </div>
                <div className={styles.Smaller}>PASS</div>
              </div>
            </div>
            <div>
              {is_owner && (
                <Link to={`/dares/${id}/edit`} className="">
                  <i className="fa-solid fa-pen-to-square"></i>
                </Link>
              )}
            </div>
          </div>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Dare;
