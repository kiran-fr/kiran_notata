import React, { useState } from "react";
import "./ManageStartupsModal.scss";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Modal } from "Components/UI_Kits/Modal/Modal";
import { groupStartupAdd, groupStartupRemove } from "../../../Apollo/Mutations";
import { connectionAutoCompleteName } from "../../../Apollo/Queries";

export default function ManageStartupsModal({ group, close }) {
  // States
  let [isAdding, setIsAdding] = useState({});
  let [isRemoving, setIsRemoving] = useState({});

  // Queries
  let [getStartups, { data, loading }] = useLazyQuery(
    connectionAutoCompleteName
  );

  // Mutations
  let [addStartup] = useMutation(groupStartupAdd);
  let [removeStartup] = useMutation(groupStartupRemove);

  // Data maps
  let suggestions = data?.connectionAutoCompleteName || [];

  suggestions = suggestions.filter(
    ({ creativeId }) =>
      !group.startups?.some(({ creative }) => creativeId === creative.id)
  );

  // TODO: use Settings
  let canAdd = group.iAmAdmin;
  let canRemove = group.iAmAdmin;

  return (
    <Modal
      title="Manage Startups"
      submit={close}
      close={close}
      submitTxt="OK"
      closeTxt="CLOSE"
      children={
        <div className="row">
          <div
            className={`startup-container ${canAdd ? "col-sm-6" : "col-sm-12"}`}
          >
            {group.startups?.map((startup, index) => {
              let { creative } = startup;
              return (
                <div className="startup-record" key={`startup-id-${index}`}>
                  <div className="startup-container__name-container">
                    {canRemove && (
                      <i
                        className={
                          isRemoving[creative.id]
                            ? "icon fa fa-spinner fa-spin"
                            : "icon fa fa-times-circle"
                        }
                        aria-hidden="true"
                        onClick={async () => {
                          if (isRemoving[creative.id]) {
                            return;
                          }

                          setIsRemoving({
                            ...isRemoving,
                            [creative.id]: true,
                          });

                          let variables = {
                            groupId: group.id,
                            creativeId: creative.id,
                          };
                          try {
                            await removeStartup({ variables });
                          } catch (error) {
                            console.log("error");
                          }

                          setIsRemoving({
                            ...isRemoving,
                            [creative.id]: false,
                          });
                        }}
                      />
                    )}

                    <div>
                      <div className="name">{creative?.name}</div>

                      <div className="name-shared-by">
                        Shared by: {startup?.sharedByUser?.family_name}{" "}
                        {startup?.sharedByUser?.given_name}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {canAdd && (
            <div
              className={`startup-container col-sm-6`}
              style={{ padding: 0 }}
            >
              {/*<div className="StartupPage-container">*/}
              <div className="search">
                {(loading && <i className="fa fa-spinner fa-spin" />) || (
                  <span className="material-icons">search</span>
                )}

                <input
                  className="search-box"
                  placeholder="Search Startup"
                  autoComplete="off"
                  type="text"
                  onChange={e => {
                    let search = e.target?.value;
                    getStartups({ variables: { search } });
                  }}
                />
              </div>
              <div className="startup-list">
                {suggestions?.map(suggestion => (
                  <div className="row startup" key={suggestion.creativeId}>
                    <div className="col-sm-8 col-xs-8 name">
                      <span>{suggestion.creativeName}</span>
                    </div>
                    <div
                      className="col-sm-4 col-xs-4 button"
                      onClick={async () => {
                        if (isAdding[suggestion.creativeId]) {
                          return;
                        }

                        setIsAdding({
                          ...isAdding,
                          [suggestion.creativeId]: true,
                        });

                        let variables = {
                          groupId: group.id,
                          creativeId: suggestion.creativeId,
                        };
                        try {
                          await addStartup({ variables });
                        } catch (error) {
                          console.log("error", error);
                        }

                        setIsAdding({
                          ...isAdding,
                          [suggestion.creativeId]: false,
                        });
                      }}
                    >
                      {(isAdding[suggestion.creativeId] && (
                        <i className="fa fa-spinner fa-spin" />
                      )) || <span>+ Add</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      }
      innerClassName="add-startup-modal"
    />
  );
}
