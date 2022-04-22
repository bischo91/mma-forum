import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getDoc,
  doc,
  collection,
  updateDoc,
  FieldValue,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { stepContentClasses, Button } from "@mui/material";
import { textAlign } from "@mui/system";

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
          comments: {},
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
    <div>
      <div>{postContent.title}</div>
      <div>{postContent.timestamp}</div>
      <div>{postContent.author.name}</div>
      <div>{postContent.content}</div>
      <div>
        <ul>
          Comment
          {Object.keys(postContent.comments)?.map((key, index) => (
            <>
              <li>{postContent.comments[key].commentContent}</li>
              <li>{postContent.comments[key].author.name}</li>
              <li>{postContent.comments[key].timestamp}</li>
            </>
          ))}
        </ul>
        {/* from here */}
        <div>
          <label>Comment</label>
          <textarea
            placeholder="Comment"
            onChange={(e) => {
              setCommentText(e.target.value);
            }}
            value={commentText}
          />
          <Button onClick={commentSubmit}>Comment</Button>
        </div>
        {/* to here componentized */}
      </div>
    </div>
  );
}
