import { compose } from "recompose";
import { connect } from "react-redux";
import { FrontPage as FrontPageComp } from "../Components/FrontPage/FrontPage";
import { getUserIsLoggedIn } from "../Modules/index";

export default compose(
  connect((state) => ({
    userIsLoggedIn: getUserIsLoggedIn(state),
  })),
)(FrontPageComp);
