import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "@apollo/client";
import { Startups } from "Apollo/Queries/groupsGet";
import {
  connectionsGet,
  groupsGet,
  tagGroupGet,
  userGet,
} from "Apollo/Queries";
import {
  connectionTagAdd,
  connectionTagRemove,
  connectionPut,
} from "Apollo/Mutations";

import { dashboard, group, signOut, settings } from "pages/definitions";
import CreateNewStartup from "pages/private/Dashboard/Connections/CreateStartup";
import Groups, { GroupsData } from "pages/private/Groups/Groups";
import EvaluateSelector from "pages/private/Dashboard/Connections/EvaluateStartup";
import TagSelector from "Components/TagSelector/TagSelector";
import { Connection, Tag } from "pages/private/Dashboard/Connections/types";
import {
  AddTagMutationOptions,
  DeleteTagMutationOptions,
} from "pages/private/Dashboard/Connections/Connections";
import { hideMobileNavigationMenu } from "Modules/menu";
import styles from "./SideBarTreeMenu.module.css";

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
  showRightMenu?: boolean;
};

const SideBarTreeMenu = ({ location, history }: any) => {
  const menuItems: MenuItem[] = [
    {
      key: "startups",
      label: "MY STARTUPS",
      link: dashboard,
      root: true,
      icon: "fal fa-plus",
      action: () => setShowNewStartupModal({ state: true }),
    },
    {
      key: "groups",
      label: "GROUPS",
      link: group,
      root: true,
      icon: "fal fa-plus",
      action: () => setShowNewGroupModal({ state: true }),
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
  const [loadingState, setLoadingState] = useState<string | undefined>(undefined);

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
  // HANDLE ACTION MENU CLICK REGION
  // ================
  const visibleMobileLeftMenu = useSelector((state: any) => state.menu.visibleMobileLeftMenu);

  // visibleMobileLeftMenu && menuItems.unshift({
  //   key: "notata",
  //   label: "NOTATA",
  //   link: dashboard,
  //   root: true,
  // });
  const dispatch = useDispatch();

  const useOnClickOutside = (ref: any, handler: any) => {
    useEffect(() => {
      const listener = (event: MouseEvent) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
      };
    }, [ref, handler]);
  };

  const menuRef = useRef<any>(null);
  useOnClickOutside(menuRef, () => dispatch(hideMobileNavigationMenu()));

  useEffect(() => {
    changeSelected(location.pathname);
  }, [location, menuRef]);

  // ================
  // QUERY REGION
  // ================

  const groupsQuery = useQuery<GroupsData>(groupsGet, { fetchPolicy: "cache-first" });
  const connectionsQuery = useQuery(connectionsGet, { fetchPolicy: "cache-first" });
  const tagGroupsQuery = useQuery(tagGroupGet, { fetchPolicy: "cache-first" });
  const userQuery = useQuery(userGet, { fetchPolicy: "cache-first" });
  const connections = connectionsQuery.data?.connectionsGet || [];
  const user = userQuery.data?.userGet;
  const tagGroups = tagGroupsQuery.data?.accountGet.tagGroups || [];
  const [mutateConnectionTagAdd] = useMutation(connectionTagAdd);
  const [mutateconnectionTagRemove] = useMutation(connectionTagRemove);
  const [mutateConnectionPut] = useMutation(connectionPut);

  if (groupsQuery.data?.groupsGet.length) {
    const index = menuItems.findIndex((item) => item.key === "groups");
    groupsQuery.data.groupsGet
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(group => {

        const isAdmin = group.members.some(
          ({ email, role }) => email === user.email && role === "admin"
        );

        const startups = new Map<string, Startups[]>();

        group.startups.forEach((s) => {
          startups.get(s.creativeId) ?
            startups.set(s.creativeId, [...startups.get(s.creativeId) || [], s]) :
            startups.set(s.creativeId, [s]);
        });

        menuItems[index].nodes?.push({
          key: group.id,
          label: group.name,
          link: `/dashboard/group/${group.id}`,
          icon: isAdmin ? "fal fa-cog" : "",
          selected: (selectedNodes.has(`/dashboard/group/${group.id}`) || selectedNodes.has(`/dashboard/group/${group.id}/settings`)),
          action: () => isAdmin && history.push(`/dashboard/group/${group.id}/settings`),
          showRightMenu: true,
          nodes: [...startups]
            .sort((a, b) => a[1][0].connection?.creative?.name.localeCompare(b[1][0].connection?.creative?.name))
            .map(([creativeId, value]) => {

              const haveAddedStartup = connections.find((c: Connection) => c.creativeId === creativeId);
              return {
                key: creativeId,
                link: haveAddedStartup && `/dashboard/startup_page/${haveAddedStartup.id}?group=${group.id}`,
                label: value[0].connection?.creative?.name,
                nodes: [],
                selected: haveAddedStartup && selectedNodes.has(`/dashboard/startup_page/${haveAddedStartup.id}?group=${group.id}`),
                showHashTag: true,
                icon: !haveAddedStartup && (loadingState !== creativeId) ? "fal fa-cloud-download" : loadingState === creativeId ? "fa fa-spinner fa-spin" : "",
                action: () => !haveAddedStartup && addStartup(creativeId)
              } as MenuItem;
            }),
        });
      });
  }

  // ================
  // NODE REGION
  // ================

  function NodeItems({ node, level }: { node: MenuItem, level: number }): JSX.Element {
    const collapsed = !expandedState.has(node.key);
    const hasSelectedChildItem = itemOrItemNodesSelected(node);
    if (node.nodes?.length) {
      return (
        <>
          <li className={classnames(node.root && styles.root_node)}>
            <Item
              key={node.key}
              node={node}
              level={level++}
              expandable={true}
              collapsed={collapsed}
              hasSelectedChildItem={hasSelectedChildItem}
            />
            <ul className={classnames(collapsed && styles.collapsed)}>
              {node.nodes.map((item, i) => (
                <NodeItems node={item} key={`${node.key}-${i}`} level={level} />
              ))}
            </ul>
          </li>

          {collapsed &&
            node.nodes
              .filter(item => itemOrItemNodesSelected(item))
              .map((item, i) => (
                <li key={`not-collapsed-${i}`}>
                  <ul>
                    <NodeItems
                      node={item}
                      key={`${node.key}-${i}`}
                      level={level}
                    />
                  </ul>
                </li>
              ))}
        </>
      );
    }
    return (
      <li className={classnames(node.root && styles.root_node)}>
        <Item
          key={node.key}
          node={node}
          expandable={false}
          hasSelectedChildItem={hasSelectedChildItem}
          collapsed={collapsed}
          level={level++}
        />
      </li>
    );
  }

  function itemOrItemNodesSelected(item: MenuItem): boolean {
    return item.selected || item.nodes?.some(i => i.selected) || false;
  }

  function Item({
    node,
    level,
    expandable,
    collapsed,
    hasSelectedChildItem,
  }: {
    node: MenuItem;
    level: number;
    expandable: boolean;
    collapsed: boolean;
    hasSelectedChildItem: boolean;
  }): JSX.Element {
    return (
      <div
        className={`${styles.item} ${
          (node.root || (collapsed && hasSelectedChildItem)) && styles.root_item
        } ${
          (node.selected || selectedNodes.has(node.link)) &&
          styles.selected_item
        }`}
      >
        {expandable && (
          <i
            onClick={e => {
              e.stopPropagation();
              changeExpanded(node.key);
            }}
            className={`${
              !expandedState.has(node.key) ? styles.caret : styles.caret_down
            } fas fa-caret-right`}
          />
        )}
        {node.showHashTag && <span className={styles.hash_tag}>#</span>}
        {
          node.link ?
            <Link to={{pathname: node.link, state: { rightMenu: node.showRightMenu} }} className={styles.link} style={{maxWidth: `${203 - 27 * level}px`}}>
              {node.label}
            </Link> :
            <span className={styles.link} style={{maxWidth: `${203 - 27 * level}px`}}>{node.label}</span>
        }
        {node.icon && (
          <i
            onClick={node.action}
            className={classnames(styles.node_item_icon, node.icon)}
          />
        )}
      </div>
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
      ({ id }: { id: string }) => id === showEvaluate
    );
  }

  function addTag(tag: Tag, connection: Connection | undefined): void {
    mutateConnectionTagAdd(AddTagMutationOptions(tag, connection) as any);
  }

  function deleteTag(tag: Tag, connection: Connection | undefined): void {
    mutateconnectionTagRemove(DeleteTagMutationOptions(tag, connection) as any);
  }

  async function addStartup(creativeId: string) {
    setLoadingState(creativeId);
    try {
      await mutateConnectionPut({
        variables: {
          creativeId: creativeId,
        },
        update: (proxy, { data: { connectionPut } }) => {
          const data: any = proxy.readQuery({
            query: connectionsGet,
          });
          proxy.writeQuery({
            query: connectionsGet,
            data: {
              connectionsGet: [...data.connectionsGet, connectionPut],
            },
          });
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(undefined);
    }
  }

  return (
    <>
      <div
        ref={menuRef}
        className={classnames(
          styles.sidebar_container,
          !visibleMobileLeftMenu
            ? styles.closed_mobile_container
            : styles.open_mobile_container
        )}
      >
        <div className={styles.menu_container}>
          <ul>
            {menuItems.map((item, i) => (
              <NodeItems node={item} key={`root-${i}`} level={0} />
            ))}
          </ul>
        </div>
      </div>
      <CreateNewStartup
        setShowTagGroup={setShowTagGroup}
        setShowEvaluate={setShowEvaluate}
        showModalOnly={true}
        history={history}
        setDone={() => {}}
        showModalState={showNewStartupModal}
        onCloseModalEvent={() => setShowNewStartupModal({ state: false })}
      />
      <Groups
        history={history}
        showModalOnly={true}
        showModalState={showNewGroupModal}
        onCloseModalEvent={() => setShowNewGroupModal({ state: false })}
      />
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
