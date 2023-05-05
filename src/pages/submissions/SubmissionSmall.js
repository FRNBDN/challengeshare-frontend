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
import Asset from "../../components/Asset";
import ReviewCreateForm from "../reviews/ReviewCreateForm";
import appStyles from "../../App.module.css";
import styles from "../../styles/SubmissionSmall.module.css";
import timeStyle from "../../styles/Timestap.module.css";

const SubmissionSmall = (props) => {
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
    Profile,
  } = props;

  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  return (
    <Container
      className={`d-flex align-items-center ${appStyles.Box} justify-content-between px-1`}
    >
      <div className="d-flex align-items-center">
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} height={40} />
        </Link>
        <div>
          <Link to={`/profiles/${profile_id}`}>
            <span className={appStyles.BrandFont}>{owner}</span>
          </Link>
          <div className={`${styles.Date} `}>
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
        </div>
      </div>
      <div className={`d-flex align-items-center`}>
        <span className={` pe-1 ${appStyles.BrandFont} `}>Status: </span>
        {status === 1 ? (
          <span className={`${appStyles.BrandFont} ${styles.Pending}`}>
            {reviews}/3 Reviews
          </span>
        ) : status === 2 ? (
          <span className={`${appStyles.BrandFont} ${styles.Pass}`}>Pass </span>
        ) : (
          <span className={`${appStyles.BrandFont} ${styles.Failed}`}>
            Failed
          </span>
        )}
      </div>
      <Link
        to={`/submissions/${id}`}
        className={`${appStyles.Button} px-2 py-1`}
      >
        View
      </Link>
    </Container>
  );
};

export default SubmissionSmall;
