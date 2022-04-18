import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";

export default function ViewPost() {
  const [postContent, setPostContent] = useState({
    title: "",
    author: { name: "", id: "" },
    timestamp: "",
    content: "",
  });
  //   const [author, setAuthor] = useState("");
  const location = useLocation();
  const category = "forum-" + location.pathname.split("/")[1];
  const id = location.pathname.split("/")[2];

  const getPost = async () => {
    const data = await getDoc(doc(db, category, id));
    setPostContent({
      title: data.data().title,
      author: data.data().author,
      timestamp: data.data().timestamp,
      content: data.data().content,
    });
    // setAuthor(data.data().author.name);
  };

  useEffect(() => {
    getPost();
    console.log(postContent);
  }, [postContent]);

  return (
    <div>
      <div>{postContent.title}</div>
      <div>{postContent.timestamp}</div>
      <div>{postContent.author.name}</div>
      <div>{postContent.content}</div>
    </div>
  );
}
