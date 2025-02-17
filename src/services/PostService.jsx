import {
  paginate,
  create,
  all,
  getData,
  findById,
  update,
} from "./BaseService";
import { firestore } from "../config/firebase";
import { getNumberOfCommentsByPostId } from "./CommentService";
import { getNumberOfLikesByPostId } from "./LikeService";

export async function getPosts(currentPage) {
  let query = all("posts");
  query = await paginate(query, currentPage);
  const data = getData(query);
  return data;
}

export async function filterPostsByContent(searchContent, currentPage = 1, topicId = false) {
  let query = all("posts");
  const data = await getData(query);
  let searchDataByContent = data.filter((post) => {
    return post.content.toLowerCase().includes(searchContent.toLowerCase());
  });

  let searchDataByTitle = data.filter((post) => {
    return post.title.toLowerCase().includes(searchContent.toLowerCase())
  })

  const searchDataSet = new Set(searchDataByContent.concat(searchDataByTitle));
  let searchData = Array.from(searchDataSet);
  
  if(topicId) {
    searchData = searchData.filter((post) => {
      return post.topicRef.id == topicId
    })
    console.log(searchData.length)
  }
  const searchDataByPage = searchData.slice(
    (currentPage - 1) * 6,
    (currentPage - 1) * 6 + 6
  );
  return {
    posts: await Promise.all(
        searchDataByPage.map(async (post) => {
          let postWithInfo = { ...post };
          if (post.userRef !== undefined) {
            const userSnapshot = await post.userRef.get();
            const userData = userSnapshot.data();
            postWithInfo = { ...postWithInfo, user: userData };
          }
          const numberOfComments = await getNumberOfCommentsByPostId(post.id);
          const numberOfLikes = await getNumberOfLikesByPostId(post.id);
          postWithInfo = {
            ...postWithInfo,
            comment: numberOfComments,
            like: numberOfLikes,
          };
          return postWithInfo
        })
    ),
    postNumber: searchData.length,
  };
}

// export async function generateKeywordForPosts() {
//   let query = all("posts")
//   const data = await getData(query)
//   for(const post of data) {
//     let keywordArray = post.content.split(' ')
//     keywordArray = keywordArray.map((e) => {
//       return e.toLowerCase()
//     })
//     console.log(keywordArray)
//     const postData = {
//       ...post,
//       searchKeywords: keywordArray
//     }
//     update("posts", post.id, postData)
//   }
// }

export async function getNumberOfPosts() {
  const numberOfPosts = await all("posts")
    .get()
    .then((snap) => {
      return snap.size;
    });

  console.log(
    "Count all post function triggered! Total number of posts: " + numberOfPosts
  );
  return numberOfPosts;
}

export async function getPostById(id) {
  let data = await findById("posts", id);
  if (data.subjectRef !== undefined) {
    const subjectSnapshot = await data.subjectRef.get();
    const subjectData = subjectSnapshot.data();
    if (subjectData && subjectData.topicRef) {
      const topicSnapshot = await subjectData.topicRef.get();
      const topicData = topicSnapshot.data();
      data = {
        ...data,
        topic: topicData && topicData.name ? topicData.name : "",
      };
    }
    data = {
      ...data,
      subject: subjectData && subjectData.name ? subjectData.name : "",
    };
  }
  if (data.userRef !== undefined) {
    const userSnapshot = await data.userRef.get();
    const userData = userSnapshot.data();
    data = { ...data, user: userData };
  }
  const numberOfComment = await getNumberOfCommentsByPostId(id);
  data = { ...data, comment: numberOfComment };
  return data;
}

export async function getPostsByTopicId(topicId) {
  // Get the topic reference
  const topicRef = firestore.doc(`topics/${topicId}`);

  // Create a query to filter posts by topic reference
  const query = await all("posts").where("topicRef", "==", topicRef);

  const data = getData(query);
  return data;
}

export async function getPostsByUserId(userId) {
  const userRef = firestore.doc(`users/${userId}`);
  const query = await all("posts").where("userRef", "==", userRef);
  const data = await getData(query);
  return data;
}

export async function getPostsBySubjectId(subjectId) {
  const subjectRef = firestore.doc(`subjects/${subjectId}`);
  const query = await all("posts").where("subjectRef", "==", subjectRef);
  const data = getData(query);
  return data;
}

export async function createPost({
  title,
  content,
  image,
  subjectId,
  topicId,
  userId,
}) {
  const subjectRef = firestore.doc(`subjects/${subjectId}`);
  const topicRef = firestore.doc(`topics/${topicId}`);
  const userRef = firestore.doc(`users/${userId}`);
  const postData = {
    title: title,
    content: content,
    image: image ? image : "A random image url",
    subjectRef: subjectRef,
    topicRef: topicRef,
    userRef: userRef,
  };
  create("posts", postData);
}

export async function updatePost({
  id,
  title,
  content,
  image,
  subjectId,
  topicId,
}) {
  const subjectRef = firestore.doc(`subjects/${subjectId}`);
  const topicRef = firestore.doc(`topics/${topicId}`);
  const postUpdateData = {
    title: title,
    content: content,
    image: image ? image : "A random image url",
    subjectRef: subjectRef,
    topicRef: topicRef,
  };
  update("posts", id, postUpdateData);
}

export async function getPostsWithInfo(currentPage) {
  const postsData = await getPosts(currentPage);
  return await Promise.all(
    postsData.map(async (post) => {
      let postWithInfo = { ...post };
      if (post.userRef !== undefined) {
        const userSnapshot = await post.userRef.get();
        const userData = userSnapshot.data();
        postWithInfo = { ...postWithInfo, user: userData };
      }
      const numberOfComments = await getNumberOfCommentsByPostId(post.id);
      const numberOfLikes = await getNumberOfLikesByPostId(post.id);
      postWithInfo = {
        ...postWithInfo,
        comment: numberOfComments,
        like: numberOfLikes,
      };
      return postWithInfo;
    })
  );
}
