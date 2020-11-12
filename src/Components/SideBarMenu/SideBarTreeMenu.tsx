import React, { useEffect } from "react";
import styles from "./SideBarTreeMenu.module.css";
import {
  dashboard,
  group,
  signOut,
  settings,
} from "pages/definitions";
import { Link } from "react-router-dom";
import CreateNewStartup from "pages/private/Dashboard/Connections/CreateStartup";
import Groups, { GroupsData } from "pages/private/Groups/Groups";
import { useQuery } from "@apollo/client";
import { groupsGet } from "Apollo/Queries/index";

const classnames = require("classnames");

type MenuItem = {
  key: string;
  label: string;
  link: string;
  root?: boolean;
  icon?: string;
  nodes?: MenuItem[];
  showHashTag?: boolean;
  selected?: boolean;
  action?: () => void;
}

const SideBarTreeMenu = ({ location, history }: any) => {

  const menuItems: MenuItem[] = [
    {
      key: "startups",
      label: "MY STARTUPS",
      link: dashboard,
      root: true,
      icon: 'fal fa-plus',
      action: () => setShowNewStartupModal(true)
    },
    {
      key: "groups",
      label: "GROUPS",
      link: group,
      root: true,
      icon: 'fal fa-plus',
      action: () => setShowNewGroupModal(true),
      nodes: [],
    },
    {
      key: "settings",
      label: "Settings",
      link: settings,
      root: true
    },
    {
      key: "log-out",
      label: "Log out",
      link: signOut,
      root: true
    },
  ];

  // ================
  // STATE REGION
  // ================

  const [expandedState, setExpandedState] = React.useState<Set<string>>(new Set<string>());
  const [selectedNodes, setSelectedNodes] = React.useState<Set<string>>(new Set<string>());
  const [showNewStartupModal, setShowNewStartupModal] = React.useState<boolean>(false);
  const [showNewGroupModal, setShowNewGroupModal] = React.useState<boolean>(false);

  useEffect(() => {
    changeSelected(location.pathname);
  }, [location]);


  function changeExpanded(key: string): void {
    const node = expandedState.has(key);
    node ? expandedState.delete(key) : expandedState.add(key);
    setExpandedState(new Set(expandedState));
  }

  function changeSelected(link: string): void {
    selectedNodes.clear();
    selectedNodes.add(link);
    setSelectedNodes(new Set(selectedNodes));
  }

  // ================
  // QUERY REGION
  // ================

  const { data, loading, error } = useQuery<GroupsData>(groupsGet);
  if (data && data.groupsGet) {
    const index = menuItems.findIndex((item) => item.key === 'groups');
    data.groupsGet.forEach((group) => {
      menuItems[index].nodes?.push({
        key: group.id,
        label: group.name,
        link: `/dashboard/group/${group.id}`,
        icon: 'fal fa-cog',
        selected: (selectedNodes.has(`/dashboard/group/${group.id}`) || selectedNodes.has(`/dashboard/group/${group.id}/settings`)),
        action: () => history.push(`/dashboard/group/${group.id}/settings`),
        nodes: [
        ...group.startups.map((startup) =>
          ({
            key: startup.connectionId,
            link: `/dashboard/startup_page/${startup.connectionId}`,
            label: startup.connection?.creative?.name,
            nodes: [],
            selected: selectedNodes.has(`/dashboard/startup_page/${startup.connectionId}`),
            showHashTag: true
          } as MenuItem))
        ]
      });
    });
  }

  // ================
  // NODE REGION
  // ================

  function NodeItems({ node }: { node: MenuItem }): JSX.Element {
    const collapsed = !expandedState.has(node.key);
    const hasSelectedChildItem = itemOrItemNodesSelected(node);

    if (node.nodes && node.nodes.length) {
      return (
          <>
          <li className={classnames(node.root && styles.root_node)}>
            <Item key={node.key} node={node} expandable={true} collapsed={collapsed} hasSelectedChildItem={hasSelectedChildItem}/>
            <ul className={classnames(collapsed && styles.collapsed)}>
              {node.nodes.map((item, i) => (
                  <NodeItems node={item} key={`${node.key}-${i}`}/>
              ))}
            </ul>
          </li>

          { collapsed && node.nodes
            .filter((item) => itemOrItemNodesSelected(item))
            .map((item, i) => (
              <li key={`not-collapsed-${i}`}>
                <ul>
                  <NodeItems node={item} key={`${node.key}-${i}`}/>
                </ul>
              </li>
            ))
          }
          </>
      );
    }
    return (
      <li className={classnames(node.root && styles.root_node)}>
        <Item key={node.key} node={node} expandable={false} hasSelectedChildItem={hasSelectedChildItem} collapsed={collapsed}/>
      </li>
    );
  }

  function itemOrItemNodesSelected(item: MenuItem): boolean {
    return item.selected || (item.nodes?.some((i) => i.selected) || false);
  }

  function Item({ node, expandable, collapsed, hasSelectedChildItem }: { node: MenuItem, expandable: boolean, collapsed: boolean, hasSelectedChildItem: boolean }): JSX.Element {
    return (
      <>
        <div className={`${styles.item} ${(node.root || (collapsed && hasSelectedChildItem)) && styles.root_item} ${(node.selected || selectedNodes.has(node.link))&& styles.selected_item}`}>
          {expandable && (
            <i onClick={(e) => {e.stopPropagation(); changeExpanded(node.key);}}
               className={`${!expandedState.has(node.key) ? styles.caret : styles.caret_down} fas fa-caret-right`}/>
          )}
          {node.showHashTag && (
            <span className={styles.hash_tag}>#</span>
          )}
          <Link to={node.link} className={styles.link}>
              {node.label}
          </Link>
          {node.icon && (<i onClick={node.action} className={classnames(styles.node_item_icon, node.icon)}/>)}</div>
      </>
    );
  }

  return (
    <>
    <div className={classnames(styles.sidebar_container, "desktop_only")}>
      <div className={styles.menu_container}>
        <ul>
        {menuItems.map((item, i) => (
          <NodeItems node={item} key={`root-${i}`}/>
        ))}
        </ul>
      </div>
    </div>
    <CreateNewStartup
      setShowTagGroup={false}
      setShowEvaluate={false}
      showModalOnly={true}
      history={history}
      setDone={() => {}}
      showModalState={showNewStartupModal}
  />
      <Groups history={history} showModalOnly={true} showModalState={showNewGroupModal} />
  </>
  );
};

export default SideBarTreeMenu;
