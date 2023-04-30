  return (
    <>
      <h1>
        <span>Submissions</span>
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
                    placeholder="Search Submissions"
                  />
                </Form>
              </div>
              <h6>Filters</h6>
              <div className="d-flex justify-content-between flex-wrap flex-fill my-1">
                <Link
                  to="/submissions"
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
                  {submissions.results.length ? (
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
                  to="/submissions"
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
                      placeholder="Search Submissions"
                    />
                  </Form>
                </div>
              </div>
            </Container>
          </Row>
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
            <Container className={`${appStyles.Box} pb-1 mb-2`}>
              <div>
                <h5 className="mb-0 mt-1">
                  <i className="fa-solid fa-fire-flame-curved"></i> Profiles
                </h5>
              </div>
              <hr className="m-1"></hr>
              <div className="d-flex flex-column"></div>
            </Container>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default SubmissionsFeedPage;
