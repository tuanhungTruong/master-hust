import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi";

// eslint-disable-next-line react/prop-types
const LikeDislike = ({ like, dislike, isLiked, isDisliked, onLike, onDislike }) => {
  const handleLikeClick = () => {
    onLike(!isLiked);
  };

  const handleDislikeClick = () => {
    onDislike(!isDisliked);
  };

  return (
    <div className="flex gap-4 items-center">
      <div className="flex gap-1 items-center text-gray-400">
        <span className="cursor-pointer text-lg" onClick={handleLikeClick}>
          { isLiked ? <BiSolidLike/> : <BiLike />}
        </span>
        <p className="text-sm">{like}</p>
      </div>
      <div className="flex gap-1 items-center text-gray-400" onClick={handleDislikeClick}>
        <span className="cursor-pointer text-lg">
          { isDisliked ? <BiSolidDislike/> : <BiDislike />}
        </span>
        <p className="text-sm">{dislike}</p>
      </div>
    </div>
  );
};

export default LikeDislike;
