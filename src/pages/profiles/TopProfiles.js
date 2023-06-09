import React from "react";

import Container from "react-bootstrap/Container";

import { useProfileData } from "../../contexts/ProfileDataContext";

import Asset from "../../components/Asset";
import Profile from "./Profile";

import appStyles from "../../App.module.css";
import styles from "../../styles/TopProfiles.module.css";

// top profiles, changes from column to row if passed mobile prop
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
        } ${mobile && "justify-content-around flex-row"} ${
          mobile && styles.OverflowX
        }`}
      >
        {/* render profiles */}
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
          // use light spinner due to background color
          <Asset spinner light />
        )}
      </div>
    </Container>
  );
};

export default TopProfiles;
