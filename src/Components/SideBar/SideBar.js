import React from "react";
import { Layout, Menu } from "antd";
import {
  sidebar_container,
  menu_container,
  menu_item
} from "./SideBar.module.css";

const { Sider } = Layout;

const SideBar = () => (
  <Sider
    width={200}
    className={sidebar_container}
    breakpoint="lg"
    collapsedWidth="0"
    theme="light"
    trigger={null}
  >
    <Menu
      mode="inline"
      // defaultSelectedKeys={['1']}
      // defaultOpenKeys={['sub1']}
      className={menu_container}
    >
      <Menu.Item
        key="1"
        className={menu_item}
        icon={<i className="fal fa-inbox" />}
      >
        Inbox
      </Menu.Item>

      <Menu.Item
        key="2"
        className={menu_item}
        icon={<i className="fal fa-tasks" />}
      >
        Activities
      </Menu.Item>

      <Menu.Item
        key="3"
        className={menu_item}
        icon={<i className="fal fa-chart-bar" />}
      >
        Reports
      </Menu.Item>

      <Menu.Item
        key="4"
        className={menu_item}
        icon={<i className="fal fa-copy" />}
      >
        Templates
      </Menu.Item>

      <Menu.Item
        key="5"
        className={menu_item}
        icon={<i className="fal fa-tag" />}
      >
        Tags
      </Menu.Item>

      <Menu.Item
        key="6"
        className={menu_item}
        icon={<i className="fal fa-share-alt" />}
      >
        Groups
      </Menu.Item>

      <Menu.Item
        key="7"
        className={menu_item}
        icon={<i className="fal fa-user" />}
      >
        Profile
      </Menu.Item>

      <Menu.Item
        key="8"
        className={menu_item}
        icon={<i className="fal fa-cog" />}
      >
        Settings
      </Menu.Item>

      <Menu.Item
        key="9"
        className={menu_item}
        icon={<i className="fal fa-sign-out-alt" />}
      >
        Log out
      </Menu.Item>
    </Menu>
  </Sider>
);

export default SideBar;
