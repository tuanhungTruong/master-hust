import * as React from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { BiUpvote } from "react-icons/bi";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import {
  getNumberOfPostLikesUserReceive,
  getNumberOfCommentLikeUserReceive,
  getNumberOfCommentDislikeUserReceive,
} from "./../../services/LikeService";
// eslint-disable-next-line react/prop-types

import moment from "moment";
import { useStateValue } from "../../context/StateProvider";
import { actionType } from "../../context/reducer";

function UserInfoDialog({ avatarUrl, name, userId, createdAt }) {
  const [{ openUserDialog }, dispatch] = useStateValue();
  const [isOpen, setIsOpen] = React.useState(false)
  const [rating, setRating] = React.useState({
    upvote: 0,
    like: 0,
    dislike: 0,
  });
  const [loading, setLoading] = React.useState(true);

  const openDialog = () => {
    if(openUserDialog.isOpen === true && openUserDialog.userId === userId && openUserDialog.createdAt === createdAt) {
      setIsOpen(true)
    }
    else {
      setIsOpen(false)
    }
  }
  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      getNumberOfPostLikesUserReceive(userId),
      getNumberOfCommentLikeUserReceive(userId),
      getNumberOfCommentDislikeUserReceive(userId),
    ])
      .then((data) => {
        setRating({
          upvote: data[0],
          like: data[1],
          dislike: data[2],
        });
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
    openDialog()
  }, [openUserDialog, userId]);
  const handleClose = () => {
    dispatch({
      type: actionType.SET_OPEN_USER_DIALOG,
      payload: {
        isOpen: false,
        userId: undefined,
        createdAt: undefined
      },
    });
  };
  const { upvote, like, dislike } = rating;

  return (
    <Dialog onClose={handleClose} open={isOpen}>
      {loading ? (
        <div className="p-8">Loading...</div>
      ) : (
        <div className="w-[480px] h-[300px] p-8">
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <div className="absolute top-7 right-9">
            {(upvote + like - dislike/2 >= 20 && (upvote + like - dislike/2 < 50)) ? <img src="/bronze.png" width={65} height={85} /> : ""}

            {(upvote + like - dislike/2 >= 50 && (upvote + like - dislike/2 < 100)) ? <img src="/silver.png" width={55} height={75} /> : ""}

            {(upvote + like - dislike/2 >= 100) ? <img src="/gold.png" width={55} height={75} /> : ""}
          </div>
          <div className="flex font-montserrat">
            <img src={avatarUrl} className="w-[100px] h-[100px]"></img>
            <div className="p-4">
              <h2 className="font-semibold text-lg">{name}</h2>
              <div>MSSV: 20196776</div>
              <div>Khóa: 64</div>
            </div>
          </div>
          <div className="flex flex-col p-8">
            <div className="flex items-center justify-around text-xl font-semibold font-montserrat">
              Đánh giá người dùng
            </div>
            <div className="flex justify-around mt-4 font-semibold text-md">
              <div className="flex items-center">
                <BiUpvote />
                <span>{upvote}</span>
              </div>
              <div className="flex items-center">
                <BiLike />
                {like}
              </div>
              <div className="flex items-center">
                <BiDislike />
                {dislike}
              </div>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}

function Creator({ userId, avatarUrl, name, createdAt, openUserDialog }) {
  const [_, dispatch] = useStateValue();

  return (
    <>
      <div
        className="flex flex-row gap-4 cursor-pointer"
        onClick={(e) => {
          openUserDialog &&
            dispatch({
              type: actionType.SET_OPEN_USER_DIALOG,
              payload: {
                isOpen: true,
                userId: userId,
                createdAt: createdAt
              },
            });
        }}
      >
        <img src={avatarUrl} className="rounded-full w-8 h-8"></img>
        <div>
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-[10px] font-medium text-neutral-500">
            {moment(createdAt.toDate()).fromNow()}
          </p>
        </div>
      </div>
      <UserInfoDialog
        avatarUrl={avatarUrl}
        name={name}
        userId={userId}
        createdAt={createdAt}
      ></UserInfoDialog>
    </>
  );
}

export default Creator;
