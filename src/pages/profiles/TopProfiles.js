import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";

const TopProfiles = () => {
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
    <Container className={`${appStyles.Box} pb-1 mb-2`}>
      <div>
        <h5 className="mb-0 mt-1">
          <i className="fa-solid fa-fire-flame-curved"></i> Profiles
        </h5>
      </div>
      <hr className="m-1"></hr>
      <div className="d-flex flex-column">
        {topProfiles.results.length ? (
          <>
            {topProfiles.results.map((profile) => (
              <p key={profile.id}>{profile.owner}</p>
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
