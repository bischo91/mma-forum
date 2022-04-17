import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { addDoc, collection, FieldValue } from "firebase/firestore";
import { db, auth } from "../firebase-config";

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
    });

    // console.log("/" + from);
    console.log("posted");
    // navigate("/" + from);
    navigate(-1);
  };

  return (
    <div>
      <h1>Create Aaa Post</h1>
      <div>
        <label>Title: </label>
        <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="" onChange={(e) => setContent(e.target.value)} />
        <button onClick={postContent}>Post</button>
      </div>
    </div>
  );
}
