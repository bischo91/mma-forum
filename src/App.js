import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import ViewPost from "./pages/ViewPost";

import { auth, provider } from "./firebase-config";
import { signInWithPopup, signOut } from "firebase/auth";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

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

  // const routes = {
  //   path: ["general", "striking", "grappling", "equipment", "fights", "others"],
  // }
  const path = [
    "general",
    "striking",
    "grappling",
    "equipment",
    "fights",
    "others",
  ];

  return (
    <Router basename="/">
      <nav>
        <Link to="/">Home</Link>
        {path.map((p) => (
          <Link to={`/${p}`}>{p.slice(0, 1).toUpperCase() + p.slice(1)}</Link>
        ))}
      </nav>
      <div>
        {!isAuth ? (
          <button onClick={signInWithGoogle}>Log In</button>
        ) : (
          <button onClick={signUserOut}>Log Out</button>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        {path.map((p) => (
          <>
            <Route
              path={`/${p}/createpost`}
              element={<CreatePost category={p} />}
            />
            <Route path={`/${p}`} element={<ViewPost category={p} />} />
          </>
        ))}
      </Routes>
    </Router>
  );
}
export default App;
