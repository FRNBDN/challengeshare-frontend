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

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container>
        <Routes>
          <Route exact path="/" element={<h1>Submissions</h1>} />
          <Route
            exact
            path="/dares"
            element={<DaresFeedPage message="No results found" />}
          />
          <Route
            exact
            path="/dares/byfollowed"
            element={
              <DaresFeedPage
                message="No results found for followed users"
                filter={`owner__ufollowed__owner__profile=${profile_id}&`}
              />
            }
          />
          <Route
            exact
            path="/dares/following"
            element={
              <DaresFeedPage
                message="No results found for followed dares"
                filter={`challengefollower__owner__profile=${profile_id}&ordering=-challengefollower__created_at`}
              />
            }
          />
          <Route exact path="/signin" element={<SignInForm />} />
          <Route exact path="/signup" element={<SignUpForm />} />
          <Route exact path="/dares/create" element={<DareCreateForm />} />
          <Route exact path="/dares/:id" element={<DarePage />} />
          <Route path="*" element={<h1>Page not found :(</h1>} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
