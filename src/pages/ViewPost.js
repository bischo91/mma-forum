import React, { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { Button, Box, TextField, Grid, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";

export default function ViewPost() {
  const [postContent, setPostContent] = useState({
    // title: "",
    author: { name: "", id: "" },
    // createdAt: "",
    // editedAt: "",
    // content: "",
    comments: {},
  });
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [editCommentKey, setEditComment] = useState(-1);
  const [replyCommentKey, setReplyComment] = useState(-1);
  const location = useLocation();

  const category = "forum-" + location.pathname.split("/")[1];
  const id = location.pathname.split("/")[2];

  const getPost = useCallback(async () => {
    const data = await getDoc(doc(db, category, id));
    setPostContent({
      ...data.data(),
      id,
      category,
    });
  }, [id, category]);

  useEffect(() => {
    getPost();
  }, [getPost]);

  const submitComment = async (e) => {
    const maxIndex = Math.max.apply(
      null,
      Object.keys(postContent.comments).map(Number)
    );
    const newIndex = maxIndex < 0 ? 0 : maxIndex + 1;

    const newComment = Object.assign(postContent.comments, {
      [newIndex]: {
        author: {
          id: auth.currentUser.uid,
          name: auth.currentUser.displayName,
        },
        commentContent: commentText,
        timestamp: new Date().toLocaleString(),
        reply: {},
      },
    });

    if (!auth.currentUser) {
      alert("Please log in and try agagin");
    } else {
      await updateDoc(doc(db, category, id), {
        comments: newComment,
      });
    }
    setCommentText("");
  };

  const deleteComment = async (commentKey) => {
    if (postContent.comments[commentKey].author.id !== auth.currentUser?.uid) {
      alert("Please log in and try agagin");
    } else {
      if (window.confirm("are you sure?")) {
        delete postContent.comments[commentKey];
        setPostContent({ ...postContent });
        await updateDoc(doc(db, category, id), {
          comments: postContent.comments,
        });
      }
    }
  };

  const editComment = async () => {
    if (
      postContent.comments[editCommentKey].author.id !== auth.currentUser?.uid
    ) {
      alert("Please log in and try agagin");
    } else {
      postContent.comments[editCommentKey].commentContent = commentText;
      postContent.comments[editCommentKey].timestamp =
        new Date().toLocaleString();
      setPostContent({ ...postContent });
      await updateDoc(doc(db, category, id), {
        comments: postContent.comments,
      });
    }
    setCommentText("");
    setEditComment(-1);
  };

  const submitReply = async (e) => {
    if (!auth.currentUser) {
      alert("Please log in and try agagin");
    } else {
      const newReply = {
        author: {
          id: auth.currentUser.uid,
          name: auth.currentUser.displayName,
        },
        replyContent: replyText,
        timestamp: new Date().toLocaleString(),
      };
      postContent.comments[replyCommentKey].reply = newReply;
      setPostContent({ ...postContent });
      await updateDoc(doc(db, category, id), {
        comments: postContent.comments,
      });
    }
    setReplyText("");
  };

  return (
    <Box
      backgroundColor="primary.main"
      maxWidth="100vw"
      width="80vw"
      whiteSpace="pre-line"
      container
      m="auto"
      mt={6}
    >
      <Grid container spacing={2} fontSize="2rem" px={12}>
        <Grid item xs={12}>
          <Box
            component="span"
            width="100%"
            display="flex"
            justifyContent="space-between"
          >
            {postContent.title}
            {auth.currentUser?.uid === postContent.author.id && (
              <Link to={`${location.pathname}/edit`} state={postContent}>
                edit
              </Link>
            )}
          </Box>
        </Grid>
        <Grid item xs={6} fontSize="0.75rem">
          {postContent.edited ? (
            <Box component="span">Edited: {postContent.editedAt}</Box>
          ) : (
            <Box component="span">Created: {postContent.createdAt}</Box>
          )}
        </Grid>

        <Grid item xs={6} fontSize="1rem">
          <Box component="span">{postContent.author.name}</Box>
        </Grid>

        <Grid item xs={12}>
          <Box component="p" my={8}>
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
                <Box component="span" fontSize="0.75rem">
                  {postContent.comments[key].timestamp}
                  {auth.currentUser?.uid ===
                    postContent.comments[key].author.id && (
                    <>
                      <IconButton onClick={() => deleteComment(key)}>
                        <DeleteIcon style={{ fontSize: 15 }} />
                      </IconButton>
                      <IconButton onClick={() => setEditComment(key)}>
                        <EditIcon style={{ fontSize: 15 }} />
                      </IconButton>
                    </>
                  )}
                  {auth.currentUser?.uid && (
                    <IconButton
                      onClick={() => {
                        setReplyComment(key);
                      }}
                    >
                      <ReplyIcon style={{ fontSize: 15 }} />
                    </IconButton>
                  )}
                </Box>
              </Grid>
              {editCommentKey === key || replyCommentKey === key ? (
                <Grid container>
                  <Grid item xs={8}>
                    <TextField
                      placeholder="Comment"
                      onChange={(e) => {
                        setCommentText(e.target.value);
                      }}
                      defaultValue={postContent.comments[key].commentContent}
                      // value={commentText}
                      maxRows={1}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    {editCommentKey === key ? (
                      <Button variant="contained" onClick={editComment}>
                        Edit
                      </Button>
                    ) : replyCommentKey === key ? (
                      <Button variant="contained" onClick={submitReply}>
                        Reply
                      </Button>
                    ) : (
                      <></>
                    )}
                    <Button
                      variant="contained"
                      onClick={() => {
                        setEditComment(-1);
                        setReplyComment(-1);
                        setCommentText("");
                        setReplyText("");
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  {postContent.comments[key].commentContent}
                </Grid>
              )}
            </Grid>
          ))}

          {auth.currentUser && editCommentKey < 0 && (
            <Grid
              container
              my={3}
              // width="100%"
              // display="inline-flex"
              justifyContent="space-between"
              display="inline-flex"
            >
              <Grid item xs={9}>
                <TextField
                  placeholder="Comment"
                  onChange={(e) => {
                    setCommentText(e.target.value);
                  }}
                  value={commentText}
                  // rows={1}
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={submitComment}>
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
