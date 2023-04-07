import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Container>
        <Routes>
          <Route exact path="/" element={<h1>Submissions</h1>} />
          <Route exact path="/challenges" element={<h1>Challenges</h1>} />
          <Route exact path="/signin" element={<h1>sign in</h1>} />
          <Route exact path="/signup" element={<h1>sign up</h1>} />
          <Route path="*" element={<h1>Page not found :(</h1>} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
