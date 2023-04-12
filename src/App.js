import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import DareCreateForm from "./pages/dares/DareCreateForm";
import DarePage from "./pages/dares/DarePage";

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Container>
        <Routes>
          <Route exact path="/" element={<h1>Submissions</h1>} />
          <Route exact path="/dares" element={<h1>Dares</h1>} />
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
