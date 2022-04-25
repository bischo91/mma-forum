import "./App.css";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import ViewPostList from "./pages/ViewPostList";
import ViewPost from "./pages/ViewPost";
import EditPost from "./pages/EditPost";

import { auth, provider } from "./firebase-config";
import { signInWithPopup, signOut } from "firebase/auth";
import { Button, Box, Grid } from "@mui/material";
import { display } from "@mui/system";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  // Firebase Auth Sign In and Sign Out
  const signInWithGoogle = () => {
    // Sign in with Google popup
    signInWithPopup(auth, provider).then((result) => {
      // Verify authentication
      setIsAuth(true);
      //   Identify if logged in with local storage
      localStorage.setItem("isAuth", true);
      console.log("logged in");
      console.log(auth.currentUser);
      // navigate("/");
    });
  };

  const signUserOut = () => {
    signOut(auth).then((result) => {
      localStorage.clear();
      setIsAuth(false);
      console.log("logged out");
    });
  };

  const path = [
    "general",
    "striking",
    "grappling",
    "equipment",
    "fights",
    "others",
  ];

  const navLink = {
    textDecoration: "none",
    margin: "1rem",
    display: "inline-flex",
    color: "green",
    marginLeft: "5vw",
  };

  return (
    <Router>
      <Grid justifyContent="space-between" container>
        <Grid item>LOGO</Grid>
        <Grid item>
          <nav
            style={{
              backgroundColor: "grey",
              display: "flex",
              width: "70vw",
              height: "5vh",
              justifyContent: "space-around",
            }}
          >
            <Link to="/" style={navLink}>
              Home
            </Link>
            {path.map((p) => (
              <Link to={`/${p}`} style={navLink}>
                {p.slice(0, 1).toUpperCase() + p.slice(1)}
              </Link>
            ))}
          </nav>
        </Grid>
        <Grid item>
          <Box component="div" height="75%" my="auto">
            {!isAuth ? (
              <Button variant="contained" onClick={signInWithGoogle}>
                Log In
              </Button>
            ) : (
              <Button variant="contained" onClick={signUserOut}>
                Log Out
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
      <Routes>
        <Route path="/" element={<Home />} />
        {path.map((p) => (
          <>
            <Route
              path={`/${p}/createpost`}
              element={<CreatePost category={p} />}
            />
            <Route path={`/${p}`} element={<ViewPostList category={p} />} />
            <Route path={`/${p}/:id`} element={<ViewPost />} />
            <Route path={`/${p}/:id/edit`} element={<EditPost />} />
          </>
        ))}
      </Routes>
    </Router>
  );
}
export default App;
