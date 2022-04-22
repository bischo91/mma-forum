import React from "react";

export default function Comment() {
  return (
    <div>
      <label>Comment</label>
      <textarea
        placeholder="Comment"
        onChange={(e) => {
          setCommentText(e.target.value);
        }}
        value={commentText}
      />
      <button onClick={commentSubmit}>Comment</button>
    </div>
  );
}
