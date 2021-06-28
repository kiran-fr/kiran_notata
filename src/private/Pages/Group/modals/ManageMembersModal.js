import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "Components/UI_Kits/Modal/Modal";

import validateEmail from "../../../../utils/validateEmail";
import { useMutation } from "@apollo/client";
import {
  groupUserInvite,
  groupUserInvitationRemove,
  groupUserSetRole,
  groupUserRemove,
} from "../../../Apollo/Mutations";

export default function ManageMembersModal({ group, close }) {
  // States
  const [isEmail, setIsEmail] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isRemovingUser, setIsRemovingUser] = useState({});
  const [isRemovingInv, setIsRemovingInv] = useState({});
  const [isChangingRole, setIsChangingRole] = useState({});

  // Mutations
  const [userInvite, userInviteRes] = useMutation(groupUserInvite);
  const [invitationRemove] = useMutation(groupUserInvitationRemove);
  const [setRole] = useMutation(groupUserSetRole);
  const [userRemove] = useMutation(groupUserRemove);

  // Form stuff
  const { register, handleSubmit, setValue } = useForm();

  // Group privileges
  let canInvite = group.iAmAdmin || group.settings.addUser;
  let canChangeRole = group.iAmAdmin;
  let canRemove = group.iAmAdmin;

  async function onSubmit({ email }, event) {
    if (!canInvite) {
      return;
    }

    let variables = {
      groupId: group.id,
      email: email.toLocaleLowerCase().trim(),
    };
    try {
      await userInvite({ variables });
    } catch (error) {
      console.log("error", error);
    }

    setValue("email", "");
    setIsEmail(false);
  }

  return (
    <Modal
      title="Invite Members"
      submit={close}
      close={close}
      submitTxt="OK"
      closeTxt="CLOSE"
      innerClassName="invite-member-modal"
      children={
        <div className="invite-member-modal-container">
          <div className="row">
            <div className={`${canInvite ? "col-sm-6" : "col-sm-12"}`}>
              {group.members?.map((member, index) => {
                return (
                  <div className="member-record" key={`member-id-${index}`}>
                    <div className="invite-member-modal__name-container">
                      {canRemove && (
                        <i
                          className={
                            isRemovingUser[member.user?.email]
                              ? "fa fa-spinner fa-spin"
                              : "icon fa fa-times-circle"
                          }
                          aria-hidden="true"
                          onClick={async () => {
                            let email = member?.user?.email;

                            if (isRemovingUser[email]) {
                              return;
                            }

                            setIsRemovingUser({
                              ...isRemovingUser,
                              [email]: true,
                            });

                            let variables = {
                              groupId: group.id,
                              email: email,
                            };

                            try {
                              await userRemove({ variables });
                            } catch (error) {
                              console.log("error", error);
                            }

                            setIsRemovingUser({
                              ...isRemovingUser,
                              [email]: false,
                            });
                          }}
                        />
                      )}

                      <div className="name">
                        {member.user?.given_name} {member.user?.family_name}{" "}
                        {member.user?.isMe && " (you)"}
                      </div>

                      <div
                        className="member-btn"
                        style={{
                          background:
                            member.role === "USER" ? "#FAC76F" : "#C4A9FC",
                        }}
                      >
                        <span>
                          {isChangingRole[member.user?.email] ? (
                            <i
                              className="fa fa-spinner fa-spin"
                              style={{ color: "white" }}
                            />
                          ) : member.role === "USER" ? (
                            "member"
                          ) : (
                            "admin"
                          )}
                        </span>

                        {canChangeRole && (
                          <div
                            className="member-role-slct"
                            onClick={async () => {
                              let email = member.user?.email;

                              if (isChangingRole[email]) {
                                return;
                              }

                              setIsChangingRole({
                                ...isChangingRole,
                                [email]: true,
                              });

                              let variables = {
                                groupId: group.id,
                                email: member?.user?.email,
                                role: member.role === "USER" ? "ADMIN" : "USER",
                              };

                              try {
                                await setRole({ variables });
                              } catch (error) {
                                console.log("error", error);
                              }

                              setIsChangingRole({
                                ...isChangingRole,
                                [email]: false,
                              });
                            }}
                          >
                            <div>
                              {member.role === "USER" && (
                                <i className="far fa-check" />
                              )}
                              user
                            </div>
                            <div>
                              {member.role === "ADMIN" && (
                                <i className="far fa-check" />
                              )}
                              admin
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`email ${!canRemove && "email-2"}`}>
                      {member.user?.email}
                    </div>
                  </div>
                );
              })}
            </div>

            {canInvite && (
              <div className="col-sm-6">
                <div className="search">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                      className="search-box"
                      placeholder="Type email"
                      type="text"
                      name="email"
                      ref={register}
                      onChange={e => {
                        let val = e.target.value?.toLocaleLowerCase().trim();
                        setIsEmail(validateEmail(val));
                        setIsDuplicate(
                          group.members?.some(({ user }) => user?.email === val)
                        );
                      }}
                    />

                    {isDuplicate && (
                      <div className="is-duplicate">
                        That user is already member of this group
                      </div>
                    )}

                    {isEmail && !isDuplicate && (
                      <div className="submit-button-container">
                        {(userInviteRes.loading && (
                          <i className="fa fa-spinner fa-spin" />
                        )) || (
                          <button type="submit" value="invite">
                            invite
                          </button>
                        )}
                      </div>
                    )}
                  </form>
                </div>
                <div className="startup-list">
                  {group.pendingInvitations?.map(({ email }, index) => {
                    return (
                      <div className="member-record" key={`member-id-${index}`}>
                        <div className="invite-member-modal__name-container">
                          <div className="name">
                            <i
                              className={
                                isRemovingInv[email]
                                  ? "fa fa-spinner fa-spin"
                                  : "icon fa fa-times-circle"
                              }
                              aria-hidden="true"
                              onClick={async () => {
                                if (isRemovingInv[email]) {
                                  return;
                                }

                                setIsRemovingInv({
                                  ...isRemovingInv,
                                  [email]: true,
                                });

                                let variables = {
                                  groupId: group.id,
                                  email: email,
                                };
                                try {
                                  await invitationRemove({ variables });
                                } catch (error) {
                                  console.log("error", error);
                                }

                                setIsRemovingInv({
                                  ...isRemovingInv,
                                  [email]: false,
                                });
                              }}
                            />
                            {email}
                          </div>
                          <div className="pending-btn member-btn">PENDING</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
