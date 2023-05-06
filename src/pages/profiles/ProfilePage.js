import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Asset from "../../components/Asset";

import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";

import TopProfiles from "./TopProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import { Button, Card, Form, Image, NavLink } from "react-bootstrap";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import Profile from "./Profile";
import SubmissionSmall from "../submissions/SubmissionSmall";
import DareSmall from "../dares/DareSmall";
import ProfileListItem from "./ProfileListItem";

function ProfilePage({ message, model, filter }) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);
  const currentUser = useCurrentUser();
  const { id } = useParams();
  const { setProfileData, handleFollow, handleUnfollow } = useSetProfileData();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;
  const [profileModels, setProfileModels] = useState({ results: [] });
  const [profileId, setProfileId] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setHasLoadedData(false);
      profileId !== id && setHasLoaded(false);
      try {
        const [{ data: pageProfile }, { data: profileModels }] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}`),
            axiosReq.get(`/${model}/?${filter}=${id}`),
          ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfileModels(profileModels);
        setProfileId(id);
        setHasLoaded(true);
        setHasLoadedData(true);
        console.log("models fetch data", profileModels);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id, setProfileData, message, model, filter]);

  const mainProfile = (
    <>
      <Container className={appStyles.Box}>
        <Row className="px-0 text-center d-flex align-items-center">
          <Col xs={5} className="text-start">
            <Row>
              <Image roundedCircle src={profile?.image} className="px-0 mx-0" />
            </Row>
          </Col>
          <Col xs={7}>
            <Row>
              <h5 className={`text-start ${appStyles.BrandFont}`}>
                {profile?.owner}
              </h5>
              <div className={styles.SubText}>
                user since {profile?.created_at}
              </div>
            </Row>
          </Col>
        </Row>
        <Row className="my-1 d-flex justify-content-center">{profile?.bio}</Row>
        <hr />
        <Row>
          <Col xs={6}>
            <div className="text-center">
              <div className={appStyles.BrandFont}>
                {profile?.submissions_interactions}
              </div>
              <div className={appStyles.BrandFont}>Sub Points</div>
            </div>
          </Col>
          <Col xs={6}>
            <div className="text-center">
              <div className={appStyles.BrandFont}>
                {profile?.challenges_interactions}
              </div>
              <div className={appStyles.BrandFont}>Dare Points</div>
            </div>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={6}>
            <div className="text-center">
              <div className={appStyles.BrandFont}>
                {profile?.followers_count}
              </div>
              <div className={appStyles.BrandFont}>Followers</div>
            </div>
          </Col>
          <Col xs={6}>
            <div className="text-center">
              <div className={appStyles.BrandFont}>
                {profile?.following_count}
              </div>
              <div className={appStyles.BrandFont}>Following</div>
            </div>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center mt-2">
          {currentUser &&
            !is_owner &&
            (profile?.following_id ? (
              <Button
                className={`${appStyles.Button}`}
                onClick={() => handleUnfollow(profile)}
              >
                unfollow
              </Button>
            ) : (
              <Button
                className={`${appStyles.Button}`}
                onClick={() => handleFollow(profile)}
              >
                follow
              </Button>
            ))}
        </Row>
      </Container>
    </>
  );

  const mainProfileContent = (
    <>
      <Row>
        <Col
          className={`d-flex flex-wrap flex-md-nowrap flex-column flex-md-row`}
        >
          <Link
            to={`/profiles/${id}`}
            className={`${appStyles.Button} flex-fill`}
          >
            Sub
            <span className="d-inline-block d-md-none d-lg-inline-block">
              mission
            </span>
            s
          </Link>
          <Link
            to={`/profiles/${id}/dares`}
            className={`${appStyles.Button} flex-fill `}
          >
            Dares
          </Link>

          <Link
            to={`/profiles/${id}/followers`}
            className={`${appStyles.Button} flex-fill`}
          >
            Followers
          </Link>
          <Link
            to={`/profiles/${id}/following`}
            className={`${appStyles.Button} flex-fill`}
          >
            Following
          </Link>
        </Col>
      </Row>
      <Container className={`${appStyles.Box}`}>
        {hasLoadedData && (
          <h4>
            {filter === "followed__profile" && model === "ufollowers"
              ? `Users following ${profile?.owner}`
              : `${profile?.owner}'s ${
                  model === "submissions"
                    ? "Submissions"
                    : model === "challenges"
                    ? "Dares"
                    : "Followers"
                }: ${profileModels.results.length}`}
          </h4>
        )}

        <Row>
          <Col className="px-0">
            {hasLoadedData ? (
              model === "challenges" ? (
                profileModels.results.length ? (
                  <>
                    <InfiniteScroll
                      className={styles.Overflow}
                      children={profileModels.results.map((dare) => (
                        <DareSmall key={dare.id} {...dare} />
                      ))}
                      dataLength={profileModels.results.length}
                      loader={<Asset spinner />}
                      hasMore={!!profileModels.next}
                      next={() => {
                        fetchMoreData(profileModels, setProfileModels);
                      }}
                    />
                  </>
                ) : (
                  <Asset message={message} />
                ) //dares above
              ) : model === "submissions" ? (
                profileModels.results.length ? (
                  <InfiniteScroll
                    className={styles.Overflow}
                    children={profileModels.results.map((submission) => (
                      <SubmissionSmall
                        key={submission.id}
                        {...submission}
                        Profile
                      />
                    ))}
                    dataLength={profileModels.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!profileModels.next}
                    next={() => {
                      fetchMoreData(profileModels, setProfileModels);
                    }}
                  />
                ) : (
                  <Asset message={message} />
                ) //subs above
              ) : filter === "followed__profile" ? (
                profileModels.results.length ? (
                  <InfiniteScroll
                    className={styles.Overflow}
                    children={profileModels.results.map((profile) => (
                      <ProfileListItem key={profile.id} id={profile.owner_id} />
                    ))}
                    dataLength={profileModels.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!profileModels.next}
                    next={() => {
                      fetchMoreData(profileModels, setProfileModels);
                    }}
                  />
                ) : (
                  <Asset message={message} />
                ) //followers above
              ) : profileModels.results.length ? (
                <InfiniteScroll
                  className={styles.Overflow}
                  children={profileModels.results.map((profile) => (
                    <ProfileListItem key={profile.id} id={profile.followed} />
                  ))}
                  dataLength={profileModels.results.length}
                  loader={<Asset spinner />}
                  hasMore={!!profileModels.next}
                  next={() => {
                    fetchMoreData(profileModels, setProfileModels);
                  }}
                />
              ) : (
                <Asset message={message} />
              ) //following above
            ) : (
              <Asset spinner />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );

  return (
    <>
      <h1>Profile</h1>
      <Row>
        <Col className="p-0" md={9}>
          <TopProfiles mobile />
          <Container>
            {hasLoaded ? (
              <>
                <Row>
                  <Col xs={4} className="px-0">
                    {mainProfile}
                  </Col>
                  <Col xs={8}>{mainProfileContent}</Col>
                </Row>
              </>
            ) : (
              <Asset spinner />
            )}
          </Container>
        </Col>
        <Col md={3} className="d-none d-md-block ps-2">
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
            <TopProfiles />
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default ProfilePage;
