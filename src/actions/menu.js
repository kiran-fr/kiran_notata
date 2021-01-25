import { MENU_ACTIONS } from "./index";

export function showMobileNavigationMenu() {
  return {
    type: MENU_ACTIONS.SHOW_MOBILE_NAVIGATION_MENU,
  };
}
export function hideMobileNavigationMenu() {
  return {
    type: MENU_ACTIONS.HIDE_MOBILE_NAVIGATION_MENU,
  };
}
