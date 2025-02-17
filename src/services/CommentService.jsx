import { firestore } from "../config/firebase";
import { all, create, getData } from "./BaseService";

export async function getCommentsByPostId(postId) {
  const postRef = firestore.doc(`posts/${postId}`);

  // Create a query to filter posts by topic reference
  const query = all("comments").where("postRef", "==", postRef);

  const data = await getData(query);

  // Get original comments array
  const originalComments = data.filter((el) => el.commentRef === false);

  // Fill in user information
  const commentsWithUserPromises = data.map(async (comment) => {
    const userSnapshot = await comment.userRef.get();
    comment.user = userSnapshot.data();
    return comment;
  });

  // Get all comments data with user info included
  const comments = await Promise.all(commentsWithUserPromises);

  // Loop through original comments array to find its corresponding subcomments
  const commentsWithSub = originalComments.map((originalComment) => {
    // Filter subcomments of an original comment
    originalComment.subComments = comments.filter((el) => {
      if (el.commentRef === false) return false;
      return el.commentRef.id === originalComment.id;
    });

    // Sort subcomment by timestamp
    originalComment.subComments = originalComment.subComments.sort((sub1, sub2) => {
      if (sub2.createdAt.seconds !== sub1.createdAt.seconds)
            return sub1.createdAt.seconds - sub2.createdAt.seconds;
          else return sub1.createdAt.nanoseconds - sub2.createdAt.nanoseconds;
    })
    
    // Return original comment with subcomments added
    return originalComment;
  });

  return commentsWithSub;
}

export async function getCommentsByUserId(userId) {
  const userRef = firestore.doc(`users/${userId}`);
  const query = await all("comments").where("userRef", "==", userRef)
  const data = await getData(query)
  return data
}

export async function getNumberOfCommentsByPostId(postId) {
  const postRef = firestore.doc(`posts/${postId}`);
  const numberOfComments = await all("comments")
    .where("postRef", "==", postRef)
    .get()
    .then((snap) => {
      // console.log(snap.size);
      return snap.size;
    });
  return numberOfComments;
}

export async function createComment({
  content,
  image,
  postId,
  userId,
  commentId,
}) {
  const postRef = firestore.doc(`posts/${postId}`);
  const userRef = firestore.doc(`users/${userId}`);
  let commentRef;
  if (commentId) {
    commentRef = firestore.doc(`comments/${commentId}`);
  } else {
    commentRef = false;
  }

  const commentData = {
    content: content,
    image: image ? image : "A random image url",
    postRef: postRef,
    userRef: userRef,
    commentRef: commentRef ? commentRef : false,
    like: 0,
    dislike: 0,
  };
  create("comments", commentData);
}
