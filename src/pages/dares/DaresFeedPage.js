import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import styles from "../../styles/FeedPages.module.css";
import appStyles from "../../App.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Dare from "./Dare";
import Asset from "../../components/Asset";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import TopProfiles from "../profiles/TopProfiles";

function DaresFeedPage({ message, filter = "" }) {
  const [dares, setDares] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const currentUser = useCurrentUser();
  const [query, setQuery] = useState("");

  const userFilters = (
    <>
      <Link
        to="/dares/incomplete"
        className={`${appStyles.Button} m-1 flex-fill`}
      >
        Incomplete
      </Link>
      <Link
        to="/dares/byfollowed"
        className={`${appStyles.Button} m-1 flex-fill`}
      >
        By Followed
      </Link>
      <Link
        to="/dares/following"
        className={`${appStyles.Button} m-1 flex-fill`}
      >
        Followed
      </Link>
    </>
  );

  useEffect(() => {
    const fetchDares = async () => {
      console.log("useEffect called with query=", query);
      try {
        const { data } = await axiosReq.get(
          `/challenges/?${filter}search=${query}`
        );
        setDares(data);
        setHasLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchDares();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname]);

  return (
    <>
      <h1>
        <span>Dares</span>
      </h1>
      <Row>
        <Col md={9}>
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
                  className={`${appStyles.Button} m-1 flex-fill`}
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
                  {dares.results.length ? (
                    <InfiniteScroll
                      className={styles.Overflow}
                      children={dares.results.map((dare) => (
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
                  className={`${appStyles.Button} m-1 flex-fill`}
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
