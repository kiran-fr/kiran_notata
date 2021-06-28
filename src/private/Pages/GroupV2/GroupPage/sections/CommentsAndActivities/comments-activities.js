import React, { useState } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import "./comments-activities.scss";

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}
export default function CommentsActivities() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [editMessage, setEditMessage] = useState(false);
  return (
    <div className="card">
      <div className="coming-soon">
        <div>Coming soon 🚀</div>
      </div>

      <div className="row hide-and-blur">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Comments" {...a11yProps(0)} />
          <Tab label="Activities" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <div className="comments">
            <div className="comment">
              <div className="comment__username comment__you">
                You
                <span className="comment__datetime">
                  - Jan 28, 2021 10:53 PM
                </span>
              </div>
              {editMessage ? (
                <div className="comment__msg-edit">
                  <input
                    type="text"
                    value="This startup is really well!"
                  ></input>
                </div>
              ) : (
                <div className="comment__msg">
                  This startup is awesome! Let's invest!
                </div>
              )}
            </div>
          </div>
          <textarea className="comment__write-comment"></textarea>
          <i className="comment__send fa fa-paper-plane" aria-hidden="true"></i>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className="comments">
            <div className="comment">
              <div className="comment__username">
                Shirisha
                <span className="comment__datetime">
                  - Jan 28, 2021 10:53 PM
                </span>
              </div>
              <div className="comment__activity">Added Startup</div>
            </div>
            <div className="comment">
              <div className="comment__username">
                Shirisha
                <span className="comment__datetime">
                  - Jan 28, 2021 10:53 PM
                </span>
              </div>
              <div className="comment__activity">Added Tag:B2G</div>
            </div>
            <div className="comment">
              <div className="comment__username">
                Shirisha
                <span className="comment__datetime">
                  - Jan 28, 2021 10:53 PM
                </span>
              </div>
              <div className="comment__activity">Removed Tag:B2G</div>
            </div>
          </div>
          <textarea className="comment__write-comment"></textarea>
          <i className="comment__send fa fa-paper-plane" aria-hidden="true"></i>
        </TabPanel>
      </div>
    </div>
  );
}
