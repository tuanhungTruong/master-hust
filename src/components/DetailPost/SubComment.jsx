/* eslint-disable react/prop-types */
import LikeDislike from "./LikeDislike";
import Creator from "./Creator";
import { useEffect, useState } from "react";
import { useStateValue } from "../../context/StateProvider";
import { getNumberOfDislikesByCommentId, getNumberOfLikesByCommentId, likeOrDislikeComment, unlikeOrUndislikeComment } from "../../services/LikeService";
import { actionType } from "../../context/reducer";

const SubComment = ({ comment, commentUserName }) => {
  const [like, setLike] = useState(0);
  const [dislike, setDislike] = useState(0);
  const [{ likedOrDislikedComments, userId }, dispatch] = useStateValue();
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  function checkLikeStatus() {
    let findLike = false;
    let findDislike = false;
    likedOrDislikedComments.forEach((likeOrDislikedComment) => {
      if (
        likeOrDislikedComment.commentId == comment.id &&
        likeOrDislikedComment.userId == userId
      ) {
        if (likeOrDislikedComment.likeStatus === true) {
          setIsLiked(true);
          findLike = true
        } else {
          setIsDisliked(true);
          findDislike = true
        }
      }
    });
    if(findLike == false) {
      setIsLiked(false)
    }
    if(findDislike == false) {
      setIsDisliked(false)
    }
  }

  async function getLikeNumberForComment() {
    return await getNumberOfLikesByCommentId(comment.id);
  }

  async function getDislikeNumberForComment() {
    return await getNumberOfDislikesByCommentId(comment.id);
  }

  const handleLike = async (newIsLiked) => {
    if (newIsLiked) {
      await likeOrDislikeComment(userId, comment.id, true);
      setLike(like + 1);
      likedOrDislikedComments.push({id: 'new', commentId: comment.id, userId: userId, likeStatus: true })
      dispatch({
        type: actionType.SET_LIKED_OR_DISLIKED_COMMENTS,
        payload: likedOrDislikedComments,
      });
      if (isDisliked) {
        setDislike(dislike - 1);
        const updatedLikedOrDislikedComments = likedOrDislikedComments.filter((e) => (e.commentId !== comment.id || e.likeStatus !== false))
        dispatch({
          type: actionType.SET_LIKED_OR_DISLIKED_COMMENTS,
          payload: updatedLikedOrDislikedComments,
        });
        await unlikeOrUndislikeComment(userId, comment.id, false);
        setIsDisliked(false);
      }
    } else {
      await unlikeOrUndislikeComment(userId, comment.id, true);
      const updatedLikedOrDislikedComments = likedOrDislikedComments.filter((e) => (e.commentId !== comment.id))
      setLike(like - 1);
      dispatch({
        type: actionType.SET_LIKED_OR_DISLIKED_COMMENTS,
        payload: updatedLikedOrDislikedComments,
      });
    }
    setIsLiked(newIsLiked);
  };

  const handleDislike = async (newIsDisliked) => {
    if (newIsDisliked) {
      await likeOrDislikeComment(userId, comment.id, false);
      likedOrDislikedComments.push({id: 'new', commentId: comment.id, userId: userId, likeStatus: false })
      dispatch({
        type: actionType.SET_LIKED_OR_DISLIKED_COMMENTS,
        payload: likedOrDislikedComments,
      });
      setDislike(dislike + 1);
      if (isLiked) {
        setLike(like - 1);
        await unlikeOrUndislikeComment(userId, comment.id, true);
        const updatedLikedOrDislikedComments = likedOrDislikedComments.filter((e) => (e.commentId !== comment.id || e.likeStatus !== true))
        dispatch({
          type: actionType.SET_LIKED_OR_DISLIKED_COMMENTS,
          payload: updatedLikedOrDislikedComments,
        });
        setIsLiked(false);
      }
    } else {
      await unlikeOrUndislikeComment(userId, comment.id, false);
      setDislike(dislike - 1);
      const updatedLikedOrDislikedComments = likedOrDislikedComments.filter((e) => (e.commentId !== comment.id))
      dispatch({
        type: actionType.SET_LIKED_OR_DISLIKED_COMMENTS,
        payload: updatedLikedOrDislikedComments,
      });
    }
    setIsDisliked(newIsDisliked);
  };

  useEffect(() => {
    getLikeNumberForComment(comment.id).then((likeNumber) => {
      setLike(likeNumber);
    });
    getDislikeNumberForComment(comment.id).then((dislikeNumber) => {
      setDislike(dislikeNumber);
    });
    checkLikeStatus();
  }, [userId, likedOrDislikedComments]);
  return (
    <div className="ml-auto mb-2 w-11/12 py-4 px-8 shadow-lg bg-white border-l-8 border-commendBorder">
      <div className="mb-2">
        <Creator
          openUserDialog={true}
          avatarUrl={comment.user.avatarUrl}
          name={comment.user.name}
          createdAt={comment.createdAt}
          userId={comment.userRef.id}
        />
      </div>
      <p className="text-sm text-justify border-b border-gray-200 pb-4 mb-3">
        {/* <span className="font-bold">Replying {commentUserName}: </span> */}
        {comment.content.trim()}
      </p>
      <div className="flex justify-between items-center text-gray-400 text-sm">
        <p>
          replying <span className="font-bold">{commentUserName}</span>
        </p>
        <LikeDislike 
          like={like}
          dislike={dislike}
          isLiked={isLiked}
          isDisliked={isDisliked}
          onLike={handleLike}
          onDislike={handleDislike} 
        />
      </div>
    </div>
  );
};

export default SubComment;
