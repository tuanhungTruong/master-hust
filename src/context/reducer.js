export const actionType = {
  // Usage example
  // SET_DATA_GOOGLE_EARTH_ENGINE: 'SET_DATA_GOOGLE_EARTH_ENGINE',
  SET_NUMBER: "SET_NUMBER",
  SET_USER: "SET_USER",
  SET_LIKED_POSTS: "SET_LIKED_POSTS",
  SET_LIKED_OR_DISLIKED_COMMENTS: "SET_LIKED_OR_DISLIKED_COMMENTS",
  SET_OPEN_USER_DIALOG: "SET_OPEN_USER_DIALOG",
};

const reducer = (state, action) => {
  switch (action.type) {
    // Usage example:
    // case actionType.SET_DATA_GOOGLE_EARTH_ENGINE:
    //   return {
    //     ...state,
    //     dataGoogleEarthEngine: action.dataGoogleEarthEngine,
    //   };
    case actionType.SET_NUMBER:
      return {
        ...state,
        numberOfPosts: action.payload,
      };
    case actionType.SET_USER:
      return {
        ...state,
        userId: action.payload,
      };
    case actionType.SET_LIKED_POSTS:
      return {
        ...state,
        likedPosts: action.payload,
      };
    case actionType.SET_LIKED_OR_DISLIKED_COMMENTS:
      return {
        ...state,
        likedOrDislikedComments: action.payload,
      };
    case actionType.SET_OPEN_USER_DIALOG:
      return {
        ...state,
        openUserDialog: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
