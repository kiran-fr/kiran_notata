import { combineReducers } from "redux";
import { USER_ACTIONS } from "actions";
import connections from "./connections";
import user from "./user";
import menu from "./menu";

const rootReducer = combineReducers({
  connections,
  user,
  menu,
});

export default (state, action) => {
  if (action.type === USER_ACTIONS.USER_NOT_LOGGED_IN) {
    state = undefined;
  }
  return rootReducer(state, action);
};
