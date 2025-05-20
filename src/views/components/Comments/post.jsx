import React, { useState } from "react";

const post1 = {
  id: 'p1',
  user: {
    id: 'u1',
    username: 'driptamine',
  },
  description: 'hahaha oh boy @borat',
  song: 'NF - THE SEARCH',
  songImage: '',
  likes: 123,
  comments: 12,
  shares: 24
};

const Post = ({}) => {

  return (
    <PostWrapper>
      <StyledPost post={post1}/>
      <Comments>
        {loggedIn && !locked && !archived ? (
          <Reply onSubmit={reply} />
        ) : null}
        {comments.map((comment) => (
          <Comment
            comment={comment}
            username={username}
            key={comment.id}
            loggedIn={loggedIn}
          />
        ))}
      </Comments>
    </PostWrapper>
  );
}
