import { useState, useEffect } from "react";
import {
  getPostsWithInfo,
} from "../services/PostService";
import Post from "./Post";

const Topics = () => {
  const [posts, setPosts] = useState([]);
  const currentPage = 2;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsWithTopics = await getPostsWithInfo(currentPage);

        setPosts(postsWithTopics);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="p-4">
      <div className="h-44">Topics page</div>
      <div>
        <h2>Post List</h2>
        <ul>
          {posts.map((post) => (
            <Post post={post} key={post.id}></Post>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Topics;
