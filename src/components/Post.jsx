/* eslint-disable react/prop-types */
// import React from 'react'

import { useNavigate } from "react-router-dom";
import { FaRegCommentAlt, FaArrowUp } from "react-icons/fa";
import Creator from "./DetailPost/Creator";

function Post({ post, color }) {
  const navigate = useNavigate();
  if (!post) return <>No more posts</>;
  return (
    <div
      onClick={() => navigate(`/posts/${post.id}`)}
      className={`flex flex-col relative gap-4 h-[328px] overflow-hidden p-4 cursor-pointer rounded-md shadow-md hover:-translate-y-1 duration-100`}
      style={{ backgroundColor: color }}
    >
      <Creator
        avatarUrl={post.user.avatarUrl}
        name={post.user.name}
        userId={post.user.id}
        createdAt={post.createdAt}
        openDialogWhenClick={false}
      ></Creator>
      <strong>{post.title}</strong>
      <div>
        {post.content.length > 200
          ? post.content.substring(0, 200) + "..."
          : post.content}
      </div>
      <div className="flex w-1/3 justify-around text-xs absolute left-2 bottom-2">
        <div className="flex justify-center items-center gap-2">
          <span>{post.comment ? post.comment : 0}</span> <FaRegCommentAlt />
        </div>
        <div className="flex justify-center items-center gap-2">
          <span>{post.like ? post.like : 0}</span> <FaArrowUp />
        </div>
      </div>
    </div>
  );
}

export default Post;
