import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./add-startup.scss";
import validateEmail from "../../../../../utils/validateEmail";
import { useMutation } from "@apollo/client";
import {
  groupUserInvite,
  groupUserInvitationRemove,
  groupUserSetRole,
  groupUserRemove,
} from "../../../../Apollo/Mutations";
import { Loader } from "Components/elements";

export default function InviteMembers({ group }) {
  console.log("group", group);

  // States
  const [isEmail, setIsEmail] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  // Mutations
  const [userInvite, userInviteRes] = useMutation(groupUserInvite);
  const [invitationRemove, invitationRemoveRes] = useMutation(
    groupUserInvitationRemove
  );
  const [setRole, setRoleRes] = useMutation(groupUserSetRole);
  const [userRemove, userRemoveRes] = useMutation(groupUserRemove);

  // Form stuff
  const { register, handleSubmit } = useForm();

  // Data maps
  let isLoading =
    userInviteRes.loading ||
    invitationRemoveRes.loading ||
    setRoleRes.loading ||
    userRemoveRes.loading;

  // Group privileges
  // TODO: use settings
  let canInvite = group.iAmAdmin;
  let canChangeRole = group.iAmAdmin;
  let canRemove = group.iAmAdmin;

  async function onSubmit({ email }, event) {
    if (!canRemove) {
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

    event.target.value = "";
  }

  return (
    <div className="invite-member-modal-container">
      {isLoading && <Loader />}

      <div className="row">
        <div className={`${canInvite ? "col-sm-6" : "col-sm-12"}`}>
          {group.members?.map((member, index) => {
            return (
              <div className="member-record" key={`member-id-${index}`}>
                <div className="invite-member-modal__name-container">
                  {canRemove && (
                    <i
                      className="icon fa fa-times-circle"
                      aria-hidden="true"
                      onClick={() => {
                        let variables = {
                          groupId: group.id,
                          email: member?.user?.email,
                        };
                        userRemove({ variables });
                      }}
                    />
                  )}

                  <div className="name">
                    {member.user?.given_name} {member.user?.family_name}
                  </div>

                  <div
                    className="member-btn"
                    style={{
                      background:
                        member.role === "USER" ? "#FAC76F" : "#C4A9FC",
                    }}
                  >
                    <span>{member.role === "USER" ? "member" : "admin"}</span>

                    {canChangeRole && (
                      <div
                        className="member-role-slct"
                        onClick={() => {
                          let variables = {
                            groupId: group.id,
                            email: member?.user?.email,
                            role: member.role === "USER" ? "ADMIN" : "USER",
                          };
                          setRole({ variables });
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
                    <button type="submit" value="invite">
                      invite
                    </button>
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
                          className="icon fa fa-times-circle"
                          aria-hidden="true"
                          onClick={() => {
                            let variables = {
                              groupId: group.id,
                              email: email,
                            };
                            invitationRemove({ variables });
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
  );
}
