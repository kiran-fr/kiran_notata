export const SHOW_MOBILE_NAVIGATION_MENU = "SHOW_MOBILE_NAVIGATION_MENU";
export const HIDE_MOBILE_NAVIGATION_MENU = "HIDE_MOBILE_NAVIGATION_MENU";

/* ACTIONS */

export function showMobileNavigationMenu() {
  return {
    type: SHOW_MOBILE_NAVIGATION_MENU,
  };
}
export function hideMobileNavigationMenu() {
  return {
    type: HIDE_MOBILE_NAVIGATION_MENU,
  };
}

/* REDUCER */

const DEFAULT_STATE = {
  visibleMobileLeftMenu: false,
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SHOW_MOBILE_NAVIGATION_MENU:
      return {
        ...state,
        visibleMobileLeftMenu: true,
      };
    case HIDE_MOBILE_NAVIGATION_MENU:
      return {
        ...state,
        visibleMobileLeftMenu: false,
      };
    default:
      return state;
  }
};
