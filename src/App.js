import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import DareCreateForm from "./pages/dares/DareCreateForm";
import DarePage from "./pages/dares/DarePage";
import DaresFeedPage from "./pages/dares/DaresFeedPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import DareEditForm from "./pages/dares/DareEditForm";
import SubmissionPage from "./pages/submissions/SubmissionPage";
import SubmissionsFeedPage from "./pages/submissions/SubmissionsFeedPage";
import SubmissionEditForm from "./pages/submissions/SubmissionEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import ProfileEditPage from "./pages/profiles/ProfileEditPage";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container>
        <Routes>
          <Route exact path="/" element={<SubmissionsFeedPage />} />
          <Route
            exact
            path="/submissions"
            element={<SubmissionsFeedPage />}
            message="No submissions found matching search"
          />
          <Route
            exact
            path="/submissions/byfollowed"
            element={
              <SubmissionsFeedPage
                message="No submissions by followed users found"
                filter={`owner__ufollowed__owner__profile=${profile_id}&`}
              />
            }
          />
          <Route
            exact
            path="/submissions/own"
            element={
              <SubmissionsFeedPage
                message="No submissions by you found"
                filter={`owner__profile=${profile_id}&`}
              />
            }
          />
          <Route
            exact
            path="/dares"
            element={<DaresFeedPage message="No dares found matching search" />}
          />

          <Route
            exact
            path="/dares/byfollowed"
            element={
              <DaresFeedPage
                message="No dares by followed users found"
                filter={`owner__ufollowed__owner__profile=${profile_id}&`}
              />
            }
          />
          <Route
            exact
            path="/dares/following"
            element={
              <DaresFeedPage
                message="Your followed dares will show up here"
                filter={`challengefollower__owner__profile=${profile_id}&ordering=-challengefollower__created_at`}
              />
            }
          />
          <Route exact path="/signin" element={<SignInForm />} />
          <Route exact path="/signup" element={<SignUpForm />} />
          <Route exact path="/dares/create" element={<DareCreateForm />} />
          <Route exact path="/dares/:id" element={<DarePage />} />
          <Route exact path="/dares/:id/edit" element={<DareEditForm />} />
          <Route exact path="/submissions/:id" element={<SubmissionPage />} />
          <Route
            exact
            path="/submissions/:id/edit"
            element={<SubmissionEditForm />}
          />
          <Route
            path="/profiles/:id"
            element={
              <ProfilePage
                filter="owner__profile"
                model="submissions"
                message="Couldn't find any submissions by user"
              />
            }
          />
          <Route
            path="/profiles/:id/dares"
            element={
              <ProfilePage
                filter="owner__profile"
                model="challenges"
                message="Couldn't find any dares by user"
              />
            }
          />
          <Route
            path="/profiles/:id/following"
            element={
              <ProfilePage
                filter="owner__profile"
                model="ufollowers"
                message="No people followed by the user"
              />
            }
          />
          <Route
            path="/profiles/:id/followers"
            element={
              <ProfilePage
                filter="followed__profile"
                model="ufollowers"
                message="No followers found"
              />
            }
          />
          <Route path="/profiles/:id/edit" element={<ProfileEditPage />} />

          <Route path="*" element={<h1>Page not found :(</h1>} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
