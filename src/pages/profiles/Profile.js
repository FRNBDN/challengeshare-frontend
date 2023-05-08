import React from "react";
import styles from "../../styles/TopProfiles.module.css";
import appStyles from "../../App.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSetProfileData } from "../../contexts/ProfileDataContext";

const Profile = (props) => {
  const { profile, mobile } = props;

  const { id, following_id, image, owner } = profile || {};

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const { handleFollow, handleUnfollow } = useSetProfileData();

  return (
    <div
      className={`mt-1 d-flex align-items-center ${mobile && "flex-column"} ${
        appStyles.Box
      } ${styles.Profile} mx-1`}
    >
      <div>
        <Link className="align-self-center ps-1 mt-2" to={`/profiles/${id}`}>
          <Avatar src={image} height={mobile ? 50 : 30} nomargin />
        </Link>
      </div>
      <div className={`mx-0 ${!mobile && "flex-fill"}`}>
        <span className={`flex-grow ${appStyles.BrandFont}`}>{owner}</span>
      </div>
      <div className={`text-right ${styles.ButtonContainer}`}>
        {currentUser &&
          (is_owner ? null : following_id ? (
            <Button
              className={`${appStyles.Button} ${appStyles.BrandFont}`}
              onClick={() => handleUnfollow(profile)}
            >
              unfollow
            </Button>
          ) : (
            <Button
              className={`${appStyles.Button} ${appStyles.BrandFont}`}
              onClick={() => handleFollow(profile)}
            >
              follow
            </Button>
          ))}
      </div>
    </div>
  );
};

export default Profile;
