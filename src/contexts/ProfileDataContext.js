import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { followHelper, unfollowHelper } from "../utils/utils";

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    topProfiles: { results: [] },
  });

  const currentUser = useCurrentUser();

  //Unfollow handler, deletes the userfollower of clicked profile update
  // the state of all profiles in both components
  const handleUnfollow = async (clickedProfile) => {
    try {
      await axiosRes.delete(`/ufollowers/${clickedProfile.following_id}`);
      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
        topProfiles: {
          ...prevState.topProfiles,
          results: prevState.topProfiles.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
      }));
    } catch (error) {
      // console.log(error);
    }
  };

  //Follow handler, creates the userfollower of clicked profile, update
  // the state of all profiles in both components
  const handleFollow = async (clickedProfile) => {
    try {
      const { data } = await axiosRes.post("/ufollowers/", {
        followed: clickedProfile.id,
      });

      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        topProfiles: {
          ...prevState.topProfiles,
          results: prevState.topProfiles.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
      }));
    } catch (error) {
      // console.log(error);
    }
  };

  //Orders the profiles in decending order
  // with highest followers first
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
      } catch (error) {
        // console.log(error);
      }
    };

    handleMount();
  }, [currentUser]);

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider
        value={{ setProfileData, handleFollow, handleUnfollow }}
      >
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
