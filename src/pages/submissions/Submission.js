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
    status,
    reviews,
    created_at,
    setSubmissions,
    updated_at,
    Feed,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const [uploads, setUploads] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const { data } = await axiosReq.get(`/uploads/?submission=${id}`);
        setUploads(data);
        setHasLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    setHasLoaded(false);
    fetchUploads();
  }, [id, pathname]);

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
          <Container>
            {hasLoaded ? (
              <>
                {console.log(uploads)}
                {uploads.results.length ? (
                  <Carousel interval={null} variant="dark">
                    {uploads.results.map((upload) => (
                      <Carousel.Item>
                        <img
                          className="d-block w-100 "
                          src={upload.upload}
                          alt="First slide"
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
          <Container> Review button here</Container>
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
