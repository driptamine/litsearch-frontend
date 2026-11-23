import React from 'react';
import CommentTreeView from './CommentTreeView';

const commentsData = [
  {
    id: 1,
    text: 'This is the first comment',
    replies: [
      {
        id: 2,
        text: 'This is a reply to the first comment',
        replies: [
          {
            id: 3,
            text: 'This is a reply to the reply',
            replies: [],
          },
          {
            id: 4,
            text: 'Another reply to the first reply',
            replies: [],
          },
        ],
      },
      {
        id: 5,
        text: 'Another reply to the first comment',
        replies: [],
      },
    ],
  },
  {
    id: 6,
    text: 'This is the second top-level comment',
    replies: [
      {
        id: 7,
        text: 'A reply to the second comment',
        replies: [],
      },
    ],
  },
];

function RedditApp() {
  return (
    <div>
      <h1>Reddit-like Comments Tree View</h1>
      <CommentTreeView comments={commentsData} />
    </div>
  );
}

export default RedditApp;
