import React, { useEffect, useState } from "react";

import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { Link, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { Col } from "react-bootstrap";

import appStyles from "../../App.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Submission from "./Submission";
import Review from "../reviews/Review";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import TopProfiles from "../profiles/TopProfiles";

function SubmissionPage() {
  const { id } = useParams();
  const [submission, setSubmission] = useState({ results: [] });
  const [reviews, setReviews] = useState({ results: [] });
  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: submission }, { data: reviews }] = await Promise.all([
          axiosReq.get(`/submissions/${id}`),
          axiosReq.get(`/reviews/?submission=${id}`),
        ]);
        setSubmission({ results: [submission] });
        setReviews(reviews);
      } catch (error) {
        console.log(error);
      }
    };
    handleMount();
  }, [id, reviews, submission]);

  return (
    <Row>
      <h1 className={appStyles.BrandFont}>
        <Link to={"/submissions"}>Submissions</Link>/Detail
      </h1>
      <Col md={9}>
        <TopProfiles mobile />
        <Row className="h-100">
          <Col>
            <Container className="px-0">
              <Submission
                {...submission.results[0]}
                setSubmission={setSubmission}
              />
            </Container>
            <Container className="px-0 ">
              {reviews.results.length ? (
                <InfiniteScroll
                  children={reviews.results.map((review) => (
                    <Review
                      key={review.id}
                      {...review}
                      setSubmission={setSubmission}
                      setReviews={setReviews}
                      submission={id}
                    />
                  ))}
                  dataLength={reviews.results.length}
                  loader={<Asset spinner />}
                  hasMore={!!reviews.next}
                  next={() => fetchMoreData(reviews, setReviews)}
                />
              ) : currentUser ? (
                <span>No reviews yet, be the first to review!</span>
              ) : (
                <span>No reviews... yet</span>
              )}
            </Container>
          </Col>
        </Row>
      </Col>
      <Col md={3} className="d-none d-md-block">
        <Row>
          <Container className={`${appStyles.Box} pb-1 mb-2`}>
            <div>
              <h5 className="mb-0 mt-1">
                <i className="fa-solid fa-fire-flame-curved"></i> Dares
              </h5>
            </div>
            <hr className="m-1"></hr>
            <div className="d-flex flex-column"></div>
          </Container>
        </Row>
        <Row>
          <TopProfiles />
        </Row>
      </Col>
    </Row>
  );
}

export default SubmissionPage;
