import React, { useEffect, useState } from "react";
import RadioButton from "../../srv_startup/pages/ui-kits/radio-button";
import InputCheckBox from "../../srv_startup/pages/ui-kits/check-box";
import { useMutation } from "@apollo/client";
import { groupSettingsSet } from "../../../Apollo/Mutations";
import { groupsGetV2 } from "../../../Apollo/Queries";
import defaultData from "../_defaultGroupData";
import { Modal } from "Components/UI_Kits/Modal/Modal";

export default function GroupSettingsModal({ group, close }) {
  const [data, setData] = useState(defaultData);
  const [showMembersPrivacy, setShowMembersPrivacy] = useState(true);
  const [addAll, setAddAll] = useState(false);

  const [mutate, { loading }] = useMutation(groupSettingsSet, {
    refetchQueries: [{ query: groupsGetV2 }],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    if (group?.settings !== data.settings) {
      for (let key in group?.settings) {
        setSettings(key, group?.settings[key]);
      }
    }
  }, [group?.settings]);

  function setSettings(name, val) {
    setData({
      ...data,
      settings: {
        ...data.settings,
        [name]: val,
      },
    });
  }

  async function save() {
    if (loading) return;
    try {
      await mutate({
        variables: {
          groupId: group.id,
          settings: data.settings,
        },
      });
    } catch (error) {
      console.log("error", error);
    }
    close();
  }

  return (
    <Modal
      title="Settings"
      loading={loading}
      submit={save}
      close={close}
      submitTxt="Save"
      closeTxt="Cancel"
      children={
        <div className="settings-containers">
          {(!group || group.iAmAdmin) && (
            <>
              <form>
                <div className="header">
                  <span className="material-icons">share</span>
                  <span className="heading">Stage</span>
                </div>
                <div className="options">
                  <div className="option">
                    <InputCheckBox
                      name="showScores"
                      value="showScores"
                      onChange={() => {
                        setSettings("showScores", !data?.settings?.showScores);
                      }}
                      checked={!!data?.settings?.showScores}
                    />
                    Members can see scores.
                  </div>
                  <div className="option">
                    <InputCheckBox
                      name="showUsers"
                      value="showUsers"
                      onChange={() => {
                        setSettings("showUsers", !data?.settings?.showScores);
                      }}
                      checked={!!data?.settings?.showUsers}
                    />
                    Everyone can see everyone, including individual scores.
                  </div>
                  <div className="option">
                    <InputCheckBox
                      name="addAll"
                      value="addAll"
                      checked={addAll}
                      onChange={() => {
                        setData({
                          ...data,
                          settings: {
                            ...data.settings,
                            chat: !addAll,
                            addUser: !addAll,
                            addEvaluation: !addAll,
                            addStartup: !addAll,
                          },
                        });
                        setAddAll(!addAll);
                      }}
                    />
                    Allow members to share with group.
                    <i
                      className={`fa ${
                        !showMembersPrivacy
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                      aria-hidden="true"
                      onClick={() => setShowMembersPrivacy(!showMembersPrivacy)}
                    />
                    {showMembersPrivacy && (
                      <div className="option-options">
                        <div className="option">
                          <InputCheckBox
                            name="chat"
                            value="chat"
                            onChange={() => {
                              setSettings("chat", !data?.settings?.chat);
                            }}
                            checked={!!data?.settings?.chat}
                          />
                          Members can see and post comments.
                        </div>
                        <div className="option">
                          <InputCheckBox
                            name="addUser"
                            value="addUser"
                            onChange={() => {
                              setSettings("addUser", !data?.settings?.addUser);
                            }}
                            checked={!!data?.settings?.addUser}
                          />
                          Members can invite members.
                        </div>

                        <div className="option">
                          <InputCheckBox
                            name="addEvaluation"
                            value="addEvaluation"
                            onChange={() => {
                              setSettings(
                                "addEvaluation",
                                !data?.settings?.addEvaluation
                              );
                            }}
                            checked={!!data?.settings?.addEvaluation}
                          />
                          Members can share their evaluations.
                        </div>
                        <div className="option">
                          <InputCheckBox
                            name="addStartup"
                            value="addStartup"
                            onChange={() => {
                              setSettings(
                                "addStartup",
                                !data?.settings?.addStartup
                              );
                            }}
                            checked={!!data?.settings?.addStartup}
                          />
                          Members can share their startups.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="header">
                  <span className="material-icons">lock</span>
                  <span className="heading">Privacy</span>
                </div>
                <div className="options">
                  <div className="option">
                    <RadioButton
                      name="isPublic"
                      value="isPublic"
                      label="Private"
                      id="privacy-private"
                      checked={!data?.settings?.isPublic}
                      onChange={() => {
                        setSettings("isPublic", false);
                      }}
                    />
                    <div className="radio-button-description">
                      Guests and team members have to be invited
                    </div>
                  </div>
                  <div className="option">
                    <RadioButton
                      name="isPublic"
                      value="isPublic"
                      label="Public"
                      id="privacy-public"
                      checked={!!data?.settings?.isPublic}
                      onChange={() => {
                        setSettings("isPublic", true);
                      }}
                    />
                    <div className="radio-button-description">
                      Everyone can see and join this group.
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      }
    />
  );
}
