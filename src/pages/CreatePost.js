import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { addDoc, collection, FieldValue } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { TextField, Button, Box, Grid } from "@mui/material";

export default function CreatePost({ category }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const collectionRef = collection(db, "forum-" + category);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (!user) {
        navigate(-1);
        alert("Please log in and try again");
        console.log("redirected");
      }
    });
  }, []);

  const postContent = async () => {
    if (!auth.currentUser) {
      navigate(-1);
      alert("Please log in and try again");
    }
    await addDoc(collectionRef, {
      title,
      content,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
      timestamp: new Date().toLocaleString(),
      comments: {},
    });

    // console.log("/" + from);
    console.log("posted");

    // navigate("/" + from);
    navigate(-1);
  };

  return (
    <Box
      backgroundColor="primary.main"
      maxWidth="100vw"
      width="80vw"
      container
      m="auto"
      mt={6}
    >
      <Box fontSize="2rem" component="span">
        Create a Post
      </Box>

      <form>
        <Grid container spacing={2} fontSize="2rem">
          <Grid item xs={12}>
            <TextField
              label="Title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              rows={10}
              onChange={(e) => setContent(e.target.value)}
            />
          </Grid>
          <Button variant="contained" onClick={postContent}>
            Post
          </Button>
        </Grid>
      </form>
    </Box>
  );
}

// npm run deploy
