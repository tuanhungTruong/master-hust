import { useReducer, createContext, useContext } from "react";

export const StateContext = createContext();

// eslint-disable-next-line react/prop-types
const StateProvider = ({ reducer, initialState, ...props }) => (
  <StateContext.Provider
    value={useReducer(reducer, initialState)}
    {...props}
  ></StateContext.Provider>
);

// eslint-disable-next-line react-refresh/only-export-components
export const useStateValue = () => useContext(StateContext);

export default StateProvider;
