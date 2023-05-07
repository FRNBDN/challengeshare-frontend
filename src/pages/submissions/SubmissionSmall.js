import React, { useEffect, useState } from "react";
import Avatar from "../../components/Avatar";
import { OverlayTrigger, Tooltip, Container, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import appStyles from "../../App.module.css";
import styles from "../../styles/SubmissionSmall.module.css";
import timeStyle from "../../styles/Timestap.module.css";
import { axiosReq } from "../../api/axiosDefaults";

const SubmissionSmall = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    status,
    reviews,
    created_at,
    updated_at,
    Profile,
    challenge,
  } = props;

  const [dare, setDare] = useState({ results: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: dare } = await axiosReq.get(`/challenges/${challenge}`);
        setDare({ results: [dare] });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id, challenge]);

  return (
    <Container className={` ${appStyles.Box} ${!Profile && "px-1"}`}>
      <Row>
        <Col
          xs={4}
          className="d-flex align-items-center px-0 justify-content-start"
        >
          {!Profile && (
            <Link to={`/profiles/${profile_id}`}>
              <Avatar src={profile_image} height={40} />
            </Link>
          )}

          <div>
            {Profile ? (
              <Link
                to={`/dares/${challenge}`}
                className={`ps-1 ${appStyles.BrandFont}`}
              >
                {dare.results[0]?.title}
              </Link>
            ) : (
              <Link to={`/profiles/${profile_id}`}>
                <span className={appStyles.BrandFont}>{owner}</span>
              </Link>
            )}

            <div className={`${styles.Date}`}>
              {updated_at !== created_at ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Updated: {updated_at}</Tooltip>}
                >
                  <span className={timeStyle.Updated}>
                    {Profile && "Submitted on "}
                    {created_at}
                  </span>
                </OverlayTrigger>
              ) : (
                <span>
                  {Profile && "Submitted on "}
                  {created_at}
                </span>
              )}
            </div>
          </div>
        </Col>
        <Col
          xs={4}
          className={`d-flex align-items-center px-0 justify-content-center`}
        >
          <span className={` pe-1 ${appStyles.BrandFont} `}>Status: </span>
          {status === 1 ? (
            <span className={`${appStyles.BrandFont} ${styles.Pending}`}>
              {reviews}/3 Reviews
            </span>
          ) : status === 2 ? (
            <>
              <span className={`${appStyles.BrandFont} ${styles.Pass}`}>
                Pass{" "}
              </span>
              <span className={`${appStyles.BrandFont}`}>
                {reviews} Reviews
              </span>
            </>
          ) : (
            <>
              <span className={`${appStyles.BrandFont} ${styles.Failed}`}>
                Failed
              </span>
              <span className={`${appStyles.BrandFont}`}>
                {reviews} Reviews
              </span>
            </>
          )}
        </Col>
        <Col xs={4} className="px-0 d-flex justify-content-end">
          <Link
            to={`/submissions/${id}`}
            className={`${appStyles.Button} px-2 py-1 d-flex align-items-center`}
          >
            View
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default SubmissionSmall;
