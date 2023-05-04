import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import Profile from "./Profile";

const TopProfiles = ({ mobile }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    topProfiles: { results: [] },
  });

  const { topProfiles } = profileData;
  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(
          "/profiles/?ordering=-followers_count"
        );
        setProfileData((prevState) => ({
          ...prevState,
          topProfiles: data,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [currentUser]);

  return (
    <Container
      className={`${appStyles.Box} pb-0 mb-2 px-0 ${
        mobile && "d-md-none text-center"
      }`}
    >
      <div>
        <h5 className="mb-0 mt-1 px-2">
          <i className="fa-solid fa-fire-flame-curved"></i> Profiles
        </h5>
      </div>
      <hr className="mt-1 mb-0 mx-2"></hr>
      <div
        className={`d-flex ${!mobile && "flex-column"} ${
          mobile && "justify-content-around flex-row"
        }`}
      >
        {topProfiles.results.length ? (
          <>
            {topProfiles.results.map((profile) => (
              <Profile
                key={profile.id}
                profile={profile}
                {...(mobile && { mobile })}
              />
            ))}
          </>
        ) : (
          <Asset spinner />
        )}
      </div>
    </Container>
  );
};

export default TopProfiles;