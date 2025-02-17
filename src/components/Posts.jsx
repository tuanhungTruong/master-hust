// Posts.js
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import {
  filterPostsByContent,
  getPostsWithInfo,
} from "../services/PostService";
import Post from "./Post";
import { Loading } from "../common";
import { useStateValue } from "../context/StateProvider";

const Posts = ({ searchResult, setSearchResult }) => {
  const location = useLocation();
  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(true);
  const [{ numberOfPosts }] = useStateValue();
  const [postNumber, setPostNumber] = useState(numberOfPosts);

  const colors = [
    "#FCFAEE",
    "#FDFFF0",
    "#F1FCF0",
    "#EDF5F8",
    "#F3F5FF",
    "#F6EEF9",
  ];

  const currentPageParam =
    new URLSearchParams(location.search).get("page") || 1;
  const currentPage = parseInt(currentPageParam);

  const currentTopicParamId = new URLSearchParams(location.search).get("topicId") || false;

  const handleChange = (event, pageValue) => {
    if(currentTopicParamId) {
      navigateTo(`/posts?page=${Number(pageValue)}&topicId=${currentTopicParamId}`);
    }
    else {
      navigateTo(`/posts?page=${Number(pageValue)}`);
    }
  };

  const [posts, setPosts] = useState([]);
  // if (location.state.searchTerm)
  //   setPosts(filterPostsByContent(location.state.searchTerm, currentPage));

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [currentPage, numberOfPosts]);

  async function fetchData() {
    if (!searchResult && !currentTopicParamId) {
      getPostsWithInfo(currentPage)
        .then((data) => {
          data = data.sort((a, b) => {
            if (b.createdAt.seconds !== a.createdAt.seconds)
              return b.createdAt.seconds - a.createdAt.seconds;
            else return b.createdAt.nanoseconds - a.createdAt.nanoseconds;
          });
          setPosts(data);
          setPostNumber(numberOfPosts);
        })
        .finally(() => setLoading(false));
    }
  }

  useEffect(() => {
    filter();
  }, [currentPage, searchResult]);

  useEffect(() => {
    filterByTopicId();
  }, [currentPage, currentTopicParamId])

  const filter = async () => {
    if (searchResult) {
      setLoading(true);
      const data = await filterPostsByContent(searchResult, currentPage);
      setPosts(data.posts);
      setPostNumber(data.postNumber);
      setLoading(false);
    }
  };

  const filterByTopicId = async () => {
    if (currentTopicParamId) {
      setLoading(true);
      const data = await filterPostsByContent(searchResult = "", currentPage, currentTopicParamId);
      setPosts(data.posts);
      setPostNumber(data.postNumber);
      setLoading(false);
    }
  }

  return (
    <>
      {!loading ? (
        <div className="max-w-6xl mx-auto my-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-6">
            {posts
              ? posts.map((post, index) => (
                  <Post post={post} color={colors[index]} key={post.id} />
                ))
              : "Loading"}
            {posts.length === 0 && "Không có bài viết"}
          </div>
          <div className="flex flex-wrap p-4 items-center justify-center md:justify-end">
            <Pagination
              count={
                parseInt(
                  (postNumber - 1) / 6
                ) + 1
              }
              color="primary"
              page={currentPage}
              onChange={handleChange}
            />
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Posts;
