import React from "react";
import CreatePost from "./CreatePost";
import { Link } from "react-router-dom";

export default function ViewPost({ category }) {
  return (
    <div>
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
