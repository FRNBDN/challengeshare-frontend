import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import Profile from "./Profile";
import { useProfileData } from "../../contexts/ProfileDataContext";
import styles from "../../styles/TopProfiles.module.css";

const TopProfiles = ({ mobile }) => {
  const { topProfiles } = useProfileData();

  return (
    <Container
      className={`${appStyles.Box}  pb-0 mb-2 px-0 ${mobile && "d-md-none"}`}
    >
      <div>
        <h5 className="mb-0 mt-1 px-2 ">
          <i className="fa-solid fa-fire-flame-curved"></i> Profiles
        </h5>
      </div>
      <hr className="mt-1 mb-0 mx-2"></hr>
      <div
        className={`${styles.ProfileContainer} pb-1 d-flex ${
          !mobile && "flex-column"
        } ${mobile && "justify-content-around flex-row"}`}
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
          <Asset spinner light />
        )}
      </div>
    </Container>
  );
};

export default TopProfiles;
