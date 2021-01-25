import { MENU_ACTIONS } from "actions";

const DEFAULT_STATE = {
  visibleMobileLeftMenu: false,
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case MENU_ACTIONS.SHOW_MOBILE_NAVIGATION_MENU:
      return {
        ...state,
        visibleMobileLeftMenu: true,
      };
    case MENU_ACTIONS.HIDE_MOBILE_NAVIGATION_MENU:
      return {
        ...state,
        visibleMobileLeftMenu: false,
      };
    default:
      return state;
  }
};
