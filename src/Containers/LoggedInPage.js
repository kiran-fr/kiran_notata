import { compose } from "recompose";
import { connect } from "react-redux";
import { getUserIsLoggedIn } from "../Modules/index";
import { LoggedInPage } from "../Components/LoggedInPage/LoggedInPage";

export default compose(
  connect((state) => ({
    userLoggedIn: getUserIsLoggedIn(state),
  })),
)(LoggedInPage);
