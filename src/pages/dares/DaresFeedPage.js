import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import styles from "../../styles/FeedPages.module.css";
import appStyles from "../../App.module.css";
import { Link, useLocation } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Dare from "./Dare";
import Asset from "../../components/Asset";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import TopProfiles from "../profiles/TopProfiles";
// message and filter passed from route,
function DaresFeedPage({ message, filter = "" }) {
  const [dares, setDares] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const currentUser = useCurrentUser();
  // query for search bar
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchDares = async () => {
      try {
        // filters the challenges based on pathname filter and search bar query
        const { data } = await axiosReq.get(
          `/challenges/?${filter}search=${query}`
        );

        if (message === "No dares not submitted to found") {
          const filteredData = data.results.filter(
            (dare) => !dare.has_submitted
          );
          setDares({ results: filteredData });
        } else {
          setDares(data);
        }
        setHasLoaded(true);
      } catch (error) {
        // console.log(error);
      }
    };
    // delay to give a grace period for searching
    const timer = setTimeout(() => {
      fetchDares();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, message, currentUser]);

  // user filters need to be logged in to see these
  const userFilters = (
    <>
      <Link
        to="/dares/nonsub"
        className={`${appStyles.Button} m-1 flex-fill ${
          pathname === "/dares/nonsub" && appStyles.Active
        }`}
      >
        Not Submitted
      </Link>
      <Link
        to="/dares/byfollowed"
        className={`${appStyles.Button} m-1 flex-fill ${
          pathname === "/dares/byfollowed" && appStyles.Active
        }`}
      >
        by Followed Users
      </Link>
      <Link
        to="/dares/bookmarked"
        className={`${appStyles.Button} m-1 flex-fill ${
          pathname === "/dares/bookmarked" && appStyles.Active
        }`}
      >
        Bookmarked
      </Link>
    </>
  );

  return (
    <>
      <h1>
        <Link to="/submissions">Submissions</Link>/Dares
      </h1>
      <Row>
        <Col md={9}>
          {/* top bar starts here */}
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
                    placeholder="Search Dares"
                  />
                </Form>
              </div>
              <h6>Filters</h6>
              <div className="d-flex justify-content-between flex-wrap flex-fill my-1">
                <Link
                  to="/dares"
                  className={`${appStyles.Button} m-1 flex-fill ${
                    pathname === "/dares" && appStyles.Active
                  }`}
                >
                  All
                </Link>
                {/* user filters rendered here */}
                {currentUser && userFilters}
              </div>
            </Col>
          </Row>

          <Row className="h-100">
            <Col>
              {/* feed starts here */}
              {hasLoaded ? (
                <>
                  {dares.results.length ? (
                    // infinte scroll component to avoid overfetching
                    <InfiniteScroll
                      className={styles.Overflow}
                      children={dares.results.map((dare) => (
                        // dare component here with feed prop, which includes some extra links
                        <Dare
                          key={dare.id}
                          {...dare}
                          setDares={setDares}
                          Feed
                        />
                      ))}
                      dataLength={dares.results.length}
                      loader={<Asset spinner />}
                      hasMore={!!dares.next}
                      next={() => fetchMoreData(dares, setDares)}
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
        {/* sidebar starts here */}
        <Col md={3} className="d-none d-md-block">
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
                <h5 className="mb-0 mt-1">Filter Dares</h5>
              </div>
              <hr className="m-1"></hr>
              <div className="d-flex flex-column">
                <Link
                  to="/dares"
                  className={`${appStyles.Button} m-1 flex-fill ${
                    pathname === "/dares" && appStyles.Active
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
                      placeholder="Search Dares"
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
}

export default DaresFeedPage;
