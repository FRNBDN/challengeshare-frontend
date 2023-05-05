import React, { useEffect, useState } from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import {
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
  Button,
  Container,
} from "react-bootstrap";
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

const DareSmall = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    submissions_count,
    has_submitted,
    title,
    cfollow_id,
    tags,
    description,
    completed_count,
    created_at,
    updated_at,
    users_count,
  } = props;

  return (
    <Container
      className={`d-flex align-items-center ${appStyles.Box} justify-content-between pe-0`}
    >
      <div className="d-flex align-items-center">

        <div>
          <Link to={`/profiles/${profile_id}`}>
            <span className={appStyles.BrandFont}>{owner}</span>
          </Link>

          <div className={appStyles.BrandFont}>
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
      <div className={`d-flex align-items-center`}></div>
      <Link to={`/dares/${id}`} className={`${appStyles.Button} px-2 py-1`}>
        View
      </Link>
    </Container>
  );
};

export default DareSmall;
