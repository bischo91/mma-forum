import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import {
  Button,
  Box,
  TextField,
  Grid,
  List,
  ListItemText,
} from "@mui/material";

export default function ViewPost() {
  const [postContent, setPostContent] = useState({
    title: "",
    author: { name: "", id: "" },
    timestamp: "",
    content: "",
    comments: {},
  });

  const [comment, setComment] = useState({});
  const [commentText, setCommentText] = useState("");
  const location = useLocation();
  const category = "forum-" + location.pathname.split("/")[1];
  const id = location.pathname.split("/")[2];
  const uid = auth.currentUser ? auth.currentUser.uid : "";

  const getPost = async () => {
    const data = await getDoc(doc(db, category, id));
    setPostContent({
      title: data.data().title,
      author: data.data().author,
      timestamp: data.data().timestamp,
      content: data.data().content,
      comments: data.data().comments,
    });
  };

  useEffect(() => {
    getPost();
  }, []);

  const commentSubmit = async (e) => {
    setComment(
      Object.assign(postContent.comments, {
        [Object.keys(postContent.comments).length + 1]: {
          author: postContent.author,
          commentContent: commentText,
          timestamp: new Date().toLocaleString(),
        },
      })
    );

    if (!auth.currentUser) {
      alert("Please log in and try agagin");
    } else {
      console.log(comment);
      console.log(postContent);
      await updateDoc(doc(db, category, id), {
        comments: comment,
      });
    }
    setCommentText("");
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
      <Grid container spacing={2} fontSize="2rem" px={12}>
        {/* <Grid container spacing = {2}></Grid> */}
        <Grid item xs={12}>
          <Box component="span">{postContent.title}</Box>
        </Grid>
        <Grid item xs={6} fontSize="1rem">
          <Box component="span">{postContent.timestamp}</Box>
        </Grid>

        <Grid item xs={6} fontSize="1rem">
          <Box component="span">{postContent.author.name}</Box>
        </Grid>

        <Grid item xs={12}>
          <Box component="div" my={8}>
            {postContent.content}
          </Box>
        </Grid>
        <Grid item xs={12}>
          {Object.keys(postContent.comments)?.map((key, index) => (
            <Grid container fontSize="1rem" my={3}>
              <Grid item xs={6}>
                <Box component="span">
                  {postContent.comments[key].author.name}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box component="span">
                  {postContent.comments[key].timestamp}
                </Box>
              </Grid>
              <Grid item xs={12}>
                {postContent.comments[key].commentContent}
              </Grid>
            </Grid>
          ))}
          {uid === postContent.author.id && (
            <Grid container my={3}>
              <Grid item xs={8}>
                <TextField
                  placeholder="Comment"
                  onChange={(e) => {
                    setCommentText(e.target.value);
                  }}
                  value={commentText}
                  maxRows={1}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" onClick={commentSubmit}>
                  Comment
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
