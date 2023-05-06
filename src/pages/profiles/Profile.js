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

  const { handleFollow } = useSetProfileData();

  return (
    <div
      className={`mt-1 d-flex align-items-center ${mobile && "flex-column"} ${
        appStyles.Box
      } ${styles.Profile}`}
    >
      <div>
        <Link className="align-self-center" to={`/profiles/${id}`}>
          <Avatar src={image} height={mobile ? 55 : 30} nomargin />
        </Link>
      </div>
      <div className={`mx-0 ${!mobile && "flex-fill"}`}>
        <span className={`flex-grow ${appStyles.BrandFont}`}>{owner}</span>
      </div>
      <div className={`text-right`}>
        {currentUser &&
          (is_owner ? (
            <Button
              disabled
              className={`${appStyles.Button} ${appStyles.BrandFont} ${appStyles.disabled}`}
            >
              follow
            </Button>
          ) : following_id ? (
            <Button
              className={`${appStyles.Button} ${appStyles.BrandFont}`}
              onClick={() => {}}
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
