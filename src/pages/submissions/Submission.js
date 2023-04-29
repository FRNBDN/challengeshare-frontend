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
