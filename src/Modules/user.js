export const USER_LOGGED_IN = "user_USER_LOGGED_IN";
export const USER_NOT_LOGGED_IN = "user_USER_NOT_LOGGED_IN";
export const SET_USER_ATTRIBUTES = "user_SET_USER_ATTRIBUTES";

export const getUserIsLoggedIn = (state) => state.loggedIn;
export const getAttributes = (state) => state.attributes;
export const getEmailIsVerified = (state) =>
  state.attributes.length === 0 ||
  state.attributes.some(
    (attribute) =>
      attribute.Name === "email_verified" && attribute.Value === "true",
  );

export const setUserAttributes = (payload) => ({
  type: SET_USER_ATTRIBUTES,
  payload,
});

export const userLoggedIn = (payload) => ({
  type: USER_LOGGED_IN,
  payload,
});

export const userNotLoggedIn = () => ({
  type: USER_NOT_LOGGED_IN,
});

const initialState = {
  loggedIn: false,
  loading: true,
  attributes: [],
  cognitoUser: {},
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case USER_LOGGED_IN:
      return {
        ...state,
        cognitoUser: action.payload,
        loggedIn: true,
        loading: false,
      };
    case SET_USER_ATTRIBUTES:
      return {
        ...state,
        attributes: action.payload,
      };
    case USER_NOT_LOGGED_IN:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
