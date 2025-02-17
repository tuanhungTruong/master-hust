import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Layout } from "./layout";
import { DetailPost, Topics, Posts, NewPost } from "./components";
import { getNumberOfPosts } from "./services/PostService";
import { useStateValue } from "./context/StateProvider";
import { actionType } from "./context/reducer";
import { useEffect, useState } from "react";
import {
  getLikedOrDislikedCommentsByUserId,
  getLikedPostsByUserId,
} from "./services/LikeService";

function App() {
  const [{ userId }, dispatch] = useStateValue();
  const [searchResult, setSearchResult] = useState("");

  const handleInitialContext = async () => {
    const numberOfPosts = await getNumberOfPosts();
    dispatch({
      type: actionType.SET_NUMBER,
      payload: numberOfPosts,
    });
    const likedPosts = await getLikedPostsByUserId(userId);
    dispatch({
      type: actionType.SET_LIKED_POSTS,
      payload: likedPosts,
    });
    const likedOrDislikedComments = await getLikedOrDislikedCommentsByUserId(
      userId
    );
    dispatch({
      type: actionType.SET_LIKED_OR_DISLIKED_COMMENTS,
      payload: likedOrDislikedComments,
    });
    console.log("Initial state:")
    console.log(likedPosts)
    console.log(likedOrDislikedComments)
  };

  useEffect(() => {
    handleInitialContext();
  }, [userId]);

  return (
    <Routes>
      <Route path="/" element={<Layout setSearchResult={setSearchResult} />}>
        <Route path="/topics" element={<Topics />} />
        <Route path="/newpost" element={<NewPost mode="new" />} />
        <Route path="/editPost/:id" element={<NewPost mode="edit" />} />

        <Route path="/posts/:id" element={<DetailPost />} />
        <Route
          path="/posts"
          element={
            <Posts
              searchResult={searchResult}
              setSearchResult={setSearchResult}
            />
          }
        ></Route>
      </Route>
    </Routes>
  );
}

export default App;
