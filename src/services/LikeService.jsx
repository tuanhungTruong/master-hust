import { all, create, deleteById, getData } from "./BaseService";
import { getCommentsByUserId } from "./CommentService";
import { getPostsByUserId } from "./PostService";

export async function getNumberOfLikesByPostId(postId) {
  const numberOfLikes = await all("user_posts", "postId")
    .where("postId", "==", postId)
    .get()
    .then((snap) => {
      return snap.size;
    });
  return numberOfLikes;
}

export async function getLikedPostsByUserId(userId) {
    const query = await all("user_posts", "postId")
        .where("userId", "==", userId)
    const likedPosts = getData(query)
    return likedPosts
}

export async function getLikedOrDislikedCommentsByUserId(userId) {
    const query = await all("user_comments", "commentId")
        .where("userId", "==", userId)
    const likedOrDislikedComments = getData(query)
    return likedOrDislikedComments
}

export async function getNumberOfLikesByCommentId(commentId) {
    const numberOfLikes = await all("user_comments", "commentId").where("commentId", "==", commentId).where("likeStatus", "==", true).get().then((snap) => {
        return snap.size;
    })
    return numberOfLikes;
}

export async function getNumberOfDislikesByCommentId(commentId) {
    const numberOfDislikes = await all("user_comments", "commentId").where("commentId", "==", commentId).where("likeStatus", "==", false).get().then((snap) => {
        return snap.size;
    })
    return numberOfDislikes;
}

export async function getNumberOfPostLikesUserReceive(userId) {
    const posts = await getPostsByUserId(userId)
    let totalNumberOfLikes = 0
    for(const post of posts) {
        const numberOfLikesForEachPost = await getNumberOfLikesByPostId(post.id)
        totalNumberOfLikes += numberOfLikesForEachPost
    }
    return totalNumberOfLikes
}

export async function getNumberOfCommentLikeUserReceive(userId) {
    const comments = await getCommentsByUserId(userId)
    let totalNumberOfLikes = 0
    for(const comment of comments) {
        const numberOfLikesForEachComment = await getNumberOfLikesByCommentId(comment.id)
        totalNumberOfLikes += numberOfLikesForEachComment
    }
    return totalNumberOfLikes
}

export async function getNumberOfCommentDislikeUserReceive(userId) {
    const comments = await getCommentsByUserId(userId)
    let totalNumberOfDislikes = 0
    for(const comment of comments) {
        const numberOfDislikesForEachComment = await getNumberOfDislikesByCommentId(comment.id)
        totalNumberOfDislikes += numberOfDislikesForEachComment
    }
    return totalNumberOfDislikes
}

export async function likePost(userId = "7begC0zuZY0c8Qd2GIRm", postId) {
    const likeData = {
        userId: userId,
        postId: postId
    }
    create("user_posts", likeData)
}

export async function unlikePost(userId = "7begC0zuZY0c8Qd2GIRm", postId) {
    const likeRecord = await all("user_posts", "postId").where("userId", "==", userId).where("postId", "==", postId).get()
    if(likeRecord.docs.length > 0) {
        for (const likeDoc of likeRecord.docs) {
            await deleteById("user_posts", likeDoc.id)
        }
    }
}

export async function likeOrDislikeComment(userId = "7begC0zuZY0c8Qd2GIRm", commentId, likeStatus) {
    const likeRecord = await all("user_comments", "commentId").where("userId", "==", userId).where("commentId", "==", commentId).get()
    if(likeRecord.docs.length > 0) {
        for (const likeDoc of likeRecord.docs) {
            await deleteById("user_comments", likeDoc.id)
        }
        console.log(likeRecord)
        const likeData = {
            userId: userId,
            commentId: commentId,
            likeStatus: likeStatus
        }
        create("user_comments", likeData)
    }
    else {
        const likeData = {
            userId: userId,
            commentId: commentId,
            likeStatus: likeStatus
        }
        create("user_comments", likeData)
    }
}

export async function unlikeOrUndislikeComment(userId = "7begC0zuZY0c8Qd2GIRm", commentId, likeStatus) {
    const likeRecord = await all("user_comments", "commentId").where("userId", "==", userId).where("commentId", "==", commentId).where("likeStatus", "==", likeStatus).get()
    if(likeRecord.docs.length > 0) {
        for (const likeDoc of likeRecord.docs) {
            await deleteById("user_comments", likeDoc.id)
        }
        console.log(likeRecord)
        console.log("Record deleted")
    }
}