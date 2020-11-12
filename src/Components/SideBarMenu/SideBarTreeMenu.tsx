import React, { useEffect, useState } from "react";
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
import { useMutation, useQuery } from "@apollo/client";
import { groupsGet } from "Apollo/Queries/index";
import EvaluateSelector from "pages/private/Dashboard/Connections/EvaluateStartup";
import connectionsGet from "Apollo/Queries/connectionsGet";
import TagSelector from "Components/TagSelector/TagSelector";
import tagGroupGet from "Apollo/Queries/tagGroupGet";
import { Connection, Tag } from "pages/private/Dashboard/Connections/types";
import connectionTagRemove from "Apollo/Mutations/connectionTagRemove";
import connectionTagAdd from "Apollo/Mutations/connectionTagAdd";
import { AddTagMutationOptions, DeleteTagMutationOptions } from "pages/private/Dashboard/Connections/Connections";

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
      icon: "fal fa-plus",
      action: () => setShowNewStartupModal({state: true}),
    },
    {
      key: "groups",
      label: "GROUPS",
      link: group,
      root: true,
      icon: "fal fa-plus",
      action: () => setShowNewGroupModal({state: true}),
      nodes: [],
    },
    {
      key: "settings",
      label: "Settings",
      link: settings,
      root: true,
    },
    {
      key: "log-out",
      label: "Log out",
      link: signOut,
      root: true,
    },
  ];

  // ================
  // STATE REGION
  // ================

  const [expandedState, setExpandedState] = useState<Set<string>>(new Set<string>());
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set<string>());
  const [showNewStartupModal, setShowNewStartupModal] = useState<{state: boolean}>({state: false});
  const [showNewGroupModal, setShowNewGroupModal] = useState<{state: boolean}>({state: false});
  const [showEvaluate, setShowEvaluate] = useState<string | undefined>(undefined);
  const [showTagGroup, setShowTagGroup] = useState<string | undefined>(undefined);

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

  const groupsQuery = useQuery<GroupsData>(groupsGet, { fetchPolicy: "cache-first" });
  const connectionsQuery = useQuery(connectionsGet, { fetchPolicy: "cache-first" });
  const tagGroupsQuery = useQuery(tagGroupGet, { fetchPolicy: "cache-first" });
  const connections = connectionsQuery.data?.connectionsGet || [];
  const tagGroups = tagGroupsQuery.data?.accountGet.tagGroups || [];
  const [mutate] = useMutation(connectionTagAdd);
  const [mutateDelete] = useMutation(connectionTagRemove);

  if (groupsQuery.data && groupsQuery.data.groupsGet) {
    const index = menuItems.findIndex((item) => item.key === "groups");
    groupsQuery.data.groupsGet.forEach((group) => {
      menuItems[index].nodes?.push({
        key: group.id,
        label: group.name,
        link: `/dashboard/group/${group.id}`,
        icon: "fal fa-cog",
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
              showHashTag: true,
            } as MenuItem)),
        ],
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
            <Item key={node.key} node={node} expandable={true} collapsed={collapsed}
                  hasSelectedChildItem={hasSelectedChildItem}/>
            <ul className={classnames(collapsed && styles.collapsed)}>
              {node.nodes.map((item, i) => (
                <NodeItems node={item} key={`${node.key}-${i}`}/>
              ))}
            </ul>
          </li>

          {collapsed && node.nodes
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
        <Item key={node.key} node={node} expandable={false} hasSelectedChildItem={hasSelectedChildItem}
              collapsed={collapsed}/>
      </li>
    );
  }

  function itemOrItemNodesSelected(item: MenuItem): boolean {
    return item.selected || (item.nodes?.some((i) => i.selected) || false);
  }

  function Item({ node, expandable, collapsed, hasSelectedChildItem }: { node: MenuItem, expandable: boolean, collapsed: boolean, hasSelectedChildItem: boolean }): JSX.Element {
    return (
      <>
        <div
          className={`${styles.item} ${(node.root || (collapsed && hasSelectedChildItem)) && styles.root_item} ${(node.selected || selectedNodes.has(node.link)) && styles.selected_item}`}>
          {expandable && (
            <i onClick={(e) => {
              e.stopPropagation();
              changeExpanded(node.key);
            }}
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

  // ==========================
  // NEW STARTUP CREATE REGION
  // ==========================

  let showTagsForConnection: Connection | undefined;
  if (showTagGroup) {
    showTagsForConnection = (connections || []).find(
      ({ id }: { id: string }) => id === showTagGroup
    );
  }

  let showEvaluateForConnection: Connection | undefined;
  if (showEvaluate) {
    showEvaluateForConnection = (connections || []).find(
      ({ id }: { id: string }) => id === showEvaluate,
    );
  }

  function addTag(tag: Tag, connection: Connection | undefined): void {
    mutate(AddTagMutationOptions(tag, connection) as any);
  }

  function deleteTag(tag: Tag, connection: Connection | undefined): void {
    mutateDelete(DeleteTagMutationOptions(tag, connection) as any);
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
        setShowTagGroup={setShowTagGroup}
        setShowEvaluate={setShowEvaluate}
        showModalOnly={true}
        history={history}
        setDone={() => {
        }}
        showModalState={showNewStartupModal}
        onCloseModalEvent={() => setShowNewStartupModal({state: false})}
      />
      <Groups history={history}
              showModalOnly={true}
              showModalState={showNewGroupModal}
              onCloseModalEvent={() => setShowNewGroupModal({state: false})}/>
      {showEvaluate && (
        <EvaluateSelector
          connection={showEvaluateForConnection}
          history={history}
          close={() => {
            setShowEvaluate(undefined);
          }}
        />
      )}
      {showTagGroup && (
        <TagSelector
          title={showTagsForConnection?.creative.name}
          show={showTagsForConnection}
          tagGroups={tagGroups}
          checkedTags={showTagsForConnection?.tags}
          addTag={(tag: Tag) => {
            addTag(tag, showTagsForConnection);
          }}
          deleteTag={(tag: Tag) => {
            deleteTag(tag, showTagsForConnection);
          }}
          close={() => {
            setShowTagGroup(undefined);
          }}
        />
      )}
    </>
  );
};

export default SideBarTreeMenu;
