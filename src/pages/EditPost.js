import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { TextField, Button, Box, Grid } from "@mui/material";
import { db, auth } from "../firebase-config";
import { doc, updateDoc } from "firebase/firestore";

export default function EditPost() {
  const location = useLocation();
  const [title, setTitle] = useState(location.state.title);
  const [content, setContent] = useState(location.state.content);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (!user) {
        navigate(-1);
        alert("Please log in and try again");
      }
    });
  }, [navigate]);

  const editContent = async () => {
    if (!auth.currentUser) {
      navigate(-1);
      alert("Please log in and try again");
    }
    await updateDoc(doc(db, location.state.category, location.state.id), {
      title,
      content,
      editedAt: new Date().toLocaleString(),
      edited: true,
    });

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
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              defaultValue={content}
              multiline
              rows={10}
              onChange={(e) => setContent(e.target.value)}
            />
          </Grid>
          <Button variant="contained" onClick={editContent}>
            Post
          </Button>
        </Grid>
      </form>
    </Box>
  );
}
