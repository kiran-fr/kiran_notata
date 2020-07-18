import { combineReducers } from "redux";
import user, * as fromUser from "./user";
import { USER_NOT_LOGGED_IN } from "./user";

const rootReducer = combineReducers({
  user
});

export default (state, action) => {
  if (action.type === USER_NOT_LOGGED_IN) {
    state = undefined;
  }
  return rootReducer(state, action);
};

// export const getLoggedInUSer = ({user}) => fromUser.userLoggedIn(user);

export const getUserIsLoggedIn = ({user}) => fromUser.getUserIsLoggedIn(user);