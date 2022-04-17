import React from "react";
import CreatePost from "./CreatePost";
import { Link } from "react-router-dom";

export default function General() {
  return (
    <div>
      {/* <Link
        to="/createpost"
        state={{ forumType: "forum-general", from: "general" }}
      >
        Post
      </Link> */}
      <Link
        to="/general/createpost"
        state={{ forumType: "forum-general", from: "general" }}
      >
        Post
      </Link>
    </div>
  );
}

// state={{ forumType: "forum-general", from: "general" }}
