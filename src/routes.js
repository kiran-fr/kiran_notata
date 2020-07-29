import React from "react";
import "./routes.css";
import { container, content } from "./routes.module.css";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";

// **************
// * COMPONENTS *
// **************

// HELPERS
import ScrollToTop from "./ScrollToTop";

// PUBLIC
import FrontPage from "./Containers/FrontPage";
import AboutPage from "./Components/AboutPage/AboutPage";
import { FooterSection } from "./Components/Footer/Footer";
import { Header } from "./Components/Header/Header";

// USER
import { Signup } from "./Components/User/Signup/Signup";
import { Login } from "./Components/User/Login/Login";
import { ForgotPassword } from "./Components/User/ForgotPassword/ForgotPassword";
import { Awaiting } from "./Components/User/Awaiting/Awaiting";
import { SignOut } from "./Components/User/SignOut/SignOut";

// SHARING
import LinkBridge from "./Components/Shared/LinkBridge/LinkBridge";

// LOGGED IN PAGES
import { LoggedInRouter } from "./Components/LOGGED_IN_PAGES/LoggedInRouter";

// PROFILE PAGE & OTHER SETTINGS
import ProfilePage from "./Components/LOGGED_IN_PAGES/Profile_and_settings/Profile/Profile";

// **********
// * ROUTES *
// **********

// PUBLIC
export const frontpage = "/";
export const aboutpage = "/about";

// USER
export const signOut = "/signout";
export const login = "/login";
export const forgotPassword = "/forgotPassword";
export const signup = "/signup";
export const awaiting = "/awaiting";

// SHARING
export const link_bridge = `/link`;

// LOGGED IN PAGES
export const dashboard = "/dashboard";
export const reporting = `${dashboard}/report`;
export const profile = `/profile`;

export const evaluation_templates = `${dashboard}/evaluationTemplates`;
export const evaluation_template = `${evaluation_templates}/edit`;

export const team_management = `${dashboard}/teamManagement`;

// // SHARING
// export const publicSubmitForm = "/submit";

// export const public_view_evaluation = `/view_shared_evaluation`;

// export const public_new_company = `/company_profile`;
// export const public_new_company_page_business = `${public_new_company}/business`;
// export const public_new_company_page_money = `${public_new_company}/money`;
// export const public_new_company_page_materials = `${public_new_company}/materials`;
// export const public_new_company_page_info = `${public_new_company}/info`;
// export const public_edit_company_name = `${public_new_company}/edit_name`;

// // LOGGED IN PAGES
// export const dashboard = "/dashboard";

// export const tagPage = `${dashboard}/tags`;

// export const formsPage = `${dashboard}/forms`;

// export const viewCompanies = `${dashboard}/view_companies`;
// // export const newCompany = `${dashboard}/newCompany`;

// export const company_details = `${dashboard}/company_details`;
// // export const overviewBoth = `${dashboard}/overview_both`;

// export const infoOverview = `${dashboard}/info/overview`;
// export const info_page_business = `${infoOverview}/business`;
// export const info_page_money = `${infoOverview}/money`;
// export const info_page_materials = `${infoOverview}/materials`;
// export const info_page_info = `${infoOverview}/info`;
// export const info_edit_company_name = `${infoOverview}/edit_name`;

// export const evaluation_new = `${dashboard}/evaluation_new`;
// export const evaluation_settings = `${dashboard}/evaluation_settings`;

// export const Routes = () => (
//   <Router basename="/">
//     <ScrollToTop>
//       <div className={container}>
//         <Header />
//         <div className={content}>
//           <Switch>

//             <Route exact path={frontpage} component={FrontPage} />
//             <Route exact path={aboutpage} component={AboutPage} />

//             <Route exact path={signup} component={Signup} />
//             <Route exact path={login} component={Login} />
//             <Route exact path={signOut} component={SignOut} />
//             <Route exact path={forgotPassword} component={ForgotPassword} />
//             <Route exact path={awaiting} component={Awaiting} />

//             <Route path={link_bridge} component={LinkBridge} />

//             <Route exact path={profile} component={ProfilePage} />

//             <Route path={dashboard} component={LoggedInRouter} />

//             <Route render={() => <div>404</div>} />

//             {
//               // <Route render={() => <Redirect to={frontpage} />} />
//             }

//           </Switch>
//         </div>
//         <Switch>
//           <FooterSection />
//         </Switch>
//       </div>
//     </ScrollToTop>
//   </Router>

// );

export const Routes = () => (
  <Router basename="/">
    <ScrollToTop>
      <Switch>
        <Route exact path={frontpage} component={FrontPage} />
        <Route exact path={aboutpage} component={AboutPage} />

        <Route exact path={signup} component={Signup} />
        <Route exact path={login} component={Login} />
        <Route exact path={signOut} component={SignOut} />
        <Route exact path={forgotPassword} component={ForgotPassword} />
        <Route exact path={awaiting} component={Awaiting} />

        <Route path={link_bridge} component={LinkBridge} />

        <Route exact path={profile} component={ProfilePage} />

        <Route path={dashboard} component={LoggedInRouter} />

        <Route render={() => <div>404</div>} />

        {
          // <Route render={() => <Redirect to={frontpage} />} />
        }
      </Switch>
    </ScrollToTop>
  </Router>
);
