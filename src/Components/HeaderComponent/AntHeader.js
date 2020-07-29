import React from "react";
import { Layout, Menu } from "antd";
import classnames from "classnames";
import {
  header_container,
  menu_container,
  item_label,
  label_text,
  label_icon
} from "./AntHeader.module.css";
import { only_mobile } from "../elements/Ant.module.css";

const { Header } = Layout;

const Comp = () => (
  <Header className={header_container}>
    <Menu
      mode="horizontal"
      defaultSelectedKeys={["1"]}
      className={classnames(menu_container, only_mobile)}
    >
      <Menu.Item key="1">
        <div className={item_label}>
          <span className={label_icon}>
            <i className="fal fa-home" />
          </span>
          <span className={label_text}>Home</span>
        </div>
      </Menu.Item>

      <Menu.Item key="2">
        <div className={item_label}>
          <div className={item_label}>
            <span className={label_icon}>
              <i className="fal fa-chart-bar" />
            </span>
            <span className={label_text}>Report</span>
          </div>
        </div>
      </Menu.Item>

      <Menu.Item key="3">
        <div className={item_label}>
          <span className={label_icon}>
            <i className="fal fa-tasks" />
          </span>
          <span className={label_text}>Activities</span>
        </div>
      </Menu.Item>

      <Menu.Item key="4">
        <div className={item_label}>
          <span className={label_icon}>
            <i className="fal fa-inbox" />
          </span>
          <span className={label_text}>Inbox</span>
        </div>
      </Menu.Item>

      <Menu.Item key="5">
        <div className={item_label}>
          <span className={label_icon}>
            <i className="fal fa-bars" />
          </span>
          <span className={label_text}>More</span>
        </div>
      </Menu.Item>
    </Menu>
  </Header>
);

export default Comp;
