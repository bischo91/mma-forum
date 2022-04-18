import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase-config";

export default function ViewPostList({ category }) {
  const [contentList, setContentList] = useState([]);
  const collectionRef = collection(db, "forum-" + category);

  const uid = auth.currentUser ? auth.currentUser.uid : "";

  const getContent = async () => {
    const data = await getDocs(collectionRef);
    setContentList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteContent = async (id) => {
    const contentDoc = doc(db, "forum-" + category, id);
    await deleteDoc(contentDoc);
    getContent();
  };

  useEffect(() => {
    getContent();
  }, [category]);

  return (
    <div>
      <div>
        <span>Title</span>
        <span>Author</span>
        <span>Time</span>
      </div>
      {contentList.map((post) => {
        return (
          <div>
            <div>
              <Link to={`/${category}/${post.id}`}>{post.title}</Link>
            </div>
            <div>{post.author.name}</div>
            <div>{post.timestamp}</div>
            {uid === post.author.id && (
              <div>
                <button onClick={() => deleteContent(post.id)}>delete</button>
              </div>
            )}
          </div>
        );
      })}
      <Link
        to={`/${category}/createpost`}
        state={{ forumType: `forum-${category}` }}
      >
        Post
      </Link>
    </div>
  );
}

// state={{ forumType: "forum-general", from: "general" }}
