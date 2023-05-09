import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { fetchMoreData } from "../../utils/utils";

import Submission from "./Submission";
import TopProfiles from "../profiles/TopProfiles";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/FeedPages.module.css";

const SubmissionsFeedPage = ({ message, filter = "" }) => {
  const [submissions, setSubmissions] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const currentUser = useCurrentUser();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data } = await axiosReq.get(
          `/submissions/?${filter}search=${query}`
        );
        setSubmissions(data);
        setHasLoaded(true);
      } catch (error) {
        //console.log(error);
      }
    };
    setHasLoaded(false);
    // timer to give grace period for search
    const timer = setTimeout(() => {
      fetchSubmissions();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser]);

  // user filters visible when logged in
  const userFilters = (
    <>
      <Link
        to="/submissions/own"
        className={`${appStyles.Button} m-1 flex-fill ${
          pathname === "/submissions/own" && appStyles.Active
        }`}
      >
        My Submissions
      </Link>
      <Link
        to="/submissions/byfollowed"
        className={`${appStyles.Button} m-1 flex-fill ${
          pathname === "/submissions/byfollowed" && appStyles.Active
        }`}
      >
        by Followed Users
      </Link>
    </>
  );

  return (
    <>
      <h1>
        Submissions/<Link to="/dares">Dares</Link>
      </h1>
      <Row>
        <Col md={9}>
          <TopProfiles mobile />
          <Row className="d-block d-md-none">
            <Col>
              <div className="my-1 flex-fill">
                <i className={`fas fa-search ${styles.SearchIcon}`} />
                <Form onSubmit={(e) => e.preventDefault}>
                  <Form.Control
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    className={styles.SearchInput}
                    placeholder="Search Submissions"
                  />
                </Form>
              </div>
              <h6>Filters</h6>
              <div className="d-flex justify-content-between flex-wrap flex-fill my-1">
                <Link
                  to="/submissions"
                  className={`${appStyles.Button} m-1 flex-fill ${
                    (pathname === "/submissions" || pathname === "/") &&
                    appStyles.Active
                  }`}
                >
                  All
                </Link>
                {currentUser && userFilters}
              </div>
            </Col>
          </Row>
          <Row className="h-100">
            <Col>
              {hasLoaded ? (
                <>
                  {submissions.results.length ? (
                    // submission infite scroll
                    <InfiniteScroll
                      className={styles.Overflow}
                      children={submissions.results.map((submission) => (
                        <Submission
                          key={submission.id}
                          {...submission}
                          setSubmissions={setSubmissions}
                          Feed
                        />
                      ))}
                      dataLength={submissions.results.length}
                      loader={<Asset spinner />}
                      hasMore={!!submissions.next}
                      next={() => fetchMoreData(submissions, setSubmissions)}
                    />
                  ) : (
                    <Container>
                      <Asset message={message} />
                    </Container>
                  )}
                </>
              ) : (
                <Container>
                  <Asset spinner />
                </Container>
              )}
            </Col>
          </Row>
        </Col>
        <Col md={3} className="d-none d-md-block">
          {/* sidebar */}
          <Row>
            <div className="d-flex flex-column px-0 pb-3 ">
              <Link
                to="/dares/create"
                className={`${appStyles.Button} m-0 flex-fill py-2`}
              >
                <h6>Create New Dare</h6>
              </Link>
            </div>
          </Row>
          <Row>
            <Container className={`${appStyles.Box} pb-1 mb-2`}>
              <div>
                <h5 className="mb-0 mt-1">Filter Submissions</h5>
              </div>
              <hr className="m-1"></hr>
              <div className="d-flex flex-column">
                <Link
                  to="/submissions"
                  className={`${appStyles.Button} m-1 flex-fill ${
                    (pathname === "/submissions" || pathname === "/") &&
                    appStyles.Active
                  }`}
                >
                  All
                </Link>
                {currentUser && userFilters}
                <div className="m-1">
                  <i className={`fas fa-search ${styles.SearchIcon}`} />
                  <Form onSubmit={(e) => e.preventDefault}>
                    <Form.Control
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      type="text"
                      className={styles.SearchInput}
                      placeholder="Search Submissions"
                    />
                  </Form>
                </div>
              </div>
            </Container>
          </Row>
          <Row>
            <TopProfiles />
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default SubmissionsFeedPage;
