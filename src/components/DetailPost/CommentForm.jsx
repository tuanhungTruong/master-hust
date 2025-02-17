/* eslint-disable react/prop-types */
import { useState } from "react";
import { Loading, OrangeButton } from "../../common";
import { BiComment } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import { IoImageOutline } from "react-icons/io5";
import { createComment } from "../../services/CommentService";
import { useStateValue } from "../../context/StateProvider";

const CommentForm = ({
  postId,
  commentId = false,
  postingComment,
  setPostingComment,
} = {}) => {
  const [newComment, setNewComment] = useState("");
  const [{ userId }] = useStateValue()

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const onSubmitComment = () => {
    if (newComment.length === 0)
      return console.log("Comment must not be empty");
    setPostingComment(true);
    createComment({ content: newComment, commentId, userId, postId }).finally(
      () => {
        setPostingComment(false);
        setNewComment("");
      }
    );
  };

  return (
    <div className="w-full bg-white py-4 px-8 shadow-lg mb-6">
      <div className="relative">
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Hãy gửi những bình luận đẹp bạn nhé"
          className="w-full outline-none focus:border-2 p-2 pb-6 h-16 mb-2 resize-none border border-gray-300 rounded"
        />
        <div className="absolute right-6 bottom-5 flex gap-2 text-gray-400">
          <span className="cursor-pointer text-md">
            <BsEmojiSmile />
          </span>
          <span className="cursor-pointer">
            <IoImageOutline />
          </span>
        </div>
      </div>
      <div className="flex justify-end w-full text-xs font-bold">
        {postingComment ? (
          <OrangeButton icon={<Loading height="20px" />} iconSize="lg" />
        ) : (
          <OrangeButton
            icon={<BiComment />}
            title={"Bình luận"}
            iconSize="lg"
            onClick={onSubmitComment}
          />
        )}
      </div>
    </div>
  );
};

export default CommentForm;
