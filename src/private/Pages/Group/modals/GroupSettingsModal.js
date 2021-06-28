import React, { useEffect, useState } from "react";
import RadioButton from "../../../../Components/UI_Kits/from_srv/radio-button";
import InputCheckBox from "../../../../Components/UI_Kits/from_srv/check-box";
import { useMutation } from "@apollo/client";
import { groupSettingsSet } from "../../../Apollo/Mutations";
import { groupsGetV2 } from "../../../Apollo/Queries";
import defaultData from "../_defaultGroupData";
import { Modal } from "Components/UI_Kits/Modal/Modal";
import { omit } from "lodash";
import "./GroupSettings.scss";

export default function GroupSettingsModal({ group, close }) {
  const [settings, setSettingsState] = useState(defaultData.settings);

  const [mutate, { loading }] = useMutation(groupSettingsSet, {
    refetchQueries: [{ query: groupsGetV2 }],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    if (group?.settings) {
      setSettingsState(omit(group.settings, "__typename"));
    }
  }, [group?.settings]);

  function setSettings(name, val) {
    setSettingsState({
      ...settings,
      [name]: val,
    });
  }

  async function save() {
    if (loading) return;
    try {
      let variables = {
        groupId: group.id,
        settings: settings,
      };
      console.log("variables", variables);
      let res = await mutate({ variables });
      console.log("res", res);
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
                  <span className="material-icons">visibility</span>
                  <span className="heading">Allow members to see ...</span>
                </div>
                <div className="options">
                  <div className="option">
                    <InputCheckBox
                      name="showSummaries"
                      value="showSummaries"
                      onChange={() => {
                        setSettings("showSummaries", !settings?.showSummaries);
                      }}
                      checked={!!settings?.showSummaries}
                    />
                    ... score summaries
                  </div>
                  <div className="option">
                    <InputCheckBox
                      name="showUsers"
                      value="showUsers"
                      onChange={() => {
                        setSettings("showUsers", !settings?.showUsers);
                      }}
                      checked={!!settings?.showUsers}
                    />
                    ... each other, including individual scores.
                  </div>
                </div>

                <div className="header">
                  <span className="material-icons">share</span>
                  <span className="heading">Allow members to share ...</span>
                </div>
                <div className="options">
                  <div className="option">
                    <InputCheckBox
                      name="chat"
                      value="chat"
                      onChange={() => {
                        setSettings("chat", !settings?.chat);
                      }}
                      checked={!!settings?.chat}
                    />
                    ... comments
                  </div>

                  <div className="option">
                    <InputCheckBox
                      name="addEvaluation"
                      value="addEvaluation"
                      onChange={() => {
                        setSettings("addEvaluation", !settings?.addEvaluation);
                      }}
                      checked={!!settings?.addEvaluation}
                    />
                    ... evaluations
                  </div>
                  <div className="option">
                    <InputCheckBox
                      name="addStartup"
                      value="addStartup"
                      onChange={() => {
                        setSettings("addStartup", !settings?.addStartup);
                      }}
                      checked={!!settings?.addStartup}
                    />
                    ... startups
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
                      label="PRIVATE: everybody has to be invited"
                      id="privacy-private"
                      checked={!settings?.isPublic}
                      onChange={() => {
                        setSettings("isPublic", false);
                      }}
                    />
                  </div>
                  <div className="option">
                    <RadioButton
                      name="isPublic"
                      value="isPublic"
                      label="PUBLIC: anyone can join"
                      id="privacy-public"
                      checked={!!settings?.isPublic}
                      onChange={() => {
                        setSettings("isPublic", true);
                      }}
                    />
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
