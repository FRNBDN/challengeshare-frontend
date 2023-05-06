import React from "react";
import { Col, OverlayTrigger, Row, Tooltip, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import appStyles from "../../App.module.css";
import styles from "../../styles/DareSmall.module.css";
import timeStyle from "../../styles/Timestap.module.css";

const DareSmall = (props) => {
  const {
    id,
    submissions_count,
    title,
    completed_count,
    created_at,
    updated_at,
    users_count,
  } = props;

  return (
    <Container className={`${appStyles.Box}`}>
      <Row>
        <Col
          xs={4}
          className="d-flex align-items-center px-0 justify-content-start"
        >
          <div>
            <div>
              <Link to={`/dares/${id}`} className={appStyles.BrandFont}>
                {title}
              </Link>
            </div>

            <div className={`${styles.Date}`}>
              {updated_at !== created_at ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Updated: {updated_at}</Tooltip>}
                >
                  <span className={timeStyle.Updated}>
                    {"Created on "}
                    {created_at}
                  </span>
                </OverlayTrigger>
              ) : (
                <span>
                  Created on
                  {created_at}
                </span>
              )}
            </div>
          </div>
        </Col>
        <Col
          xs={3}
          className={`d-flex align-items-center px-0 justify-content-center`}
        >
          <div className="text-center">
            <div className={`text-center ${appStyles.BrandFont}`}>
              {submissions_count} /{" "}
              <span className={styles.Pass}>{completed_count}</span>
            </div>
            <div className={styles.Date}>
              Subs / <span className={styles.Pass}>Passed</span>{" "}
            </div>
          </div>
        </Col>
        <Col
          xs={2}
          className={`d-flex align-items-center px-0 justify-content-center `}
        >
          <div className="text-center">
            <div className={appStyles.BrandFont}>{users_count}</div>
            <div className={styles.Date}>Followers</div>
          </div>
        </Col>

        <Col xs={3} className="px-0 d-flex justify-content-end">
          <Link
            to={`/dares/${id}`}
            className={`${appStyles.Button} px-2 py-1 d-flex align-items-center`}
          >
            View
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default DareSmall;
