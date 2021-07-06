import React, { useState } from "react";
import "./YourTeam.scss";
import { ICONPOSITION } from "../../constants";
import ButtonWithIcon from "../../../../Components/UI_Kits/from_srv/button-with-icon";
import { Modal } from "Components/UI_Kits/Modal/Modal";
import { useMutation, useQuery } from "@apollo/client";
import { accountGet, accountInvitationsGet } from "../../../Apollo/Queries";
import validateEmail from "../../../../utils/validateEmail";
import {
  accountInviteCreate,
  accountInviteDelete,
  accountUserRemove,
} from "../../../Apollo/Mutations";
import { settings } from "../../../../definitions";
import { Loader } from "../../../../Components/elements";

export default function YourTeam({ history }) {
  // States
  const [isEmail, setIsEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);

  const [teamLoaders, setTeamLoaders] = useState({});
  const [pendingLoaders, setPendingLoaders] = useState({});

  // Queries
  const accountQuery = useQuery(accountGet);
  const invitationsQuery = useQuery(accountInvitationsGet);

  // Mutations
  const [removeUser] = useMutation(accountUserRemove);

  const [inviteUser, inviteUserRes] = useMutation(accountInviteCreate, {
    refetchQueries: [{ query: accountInvitationsGet }],
  });

  const [removeInvitation] = useMutation(accountInviteDelete, {
    refetchQueries: [{ query: accountInvitationsGet }],
  });

  // Data maps
  let account = accountQuery?.data?.accountGet || {};
  let invitations = invitationsQuery?.data?.accountInvitationsGet || [];

  let isLoading =
    (!accountQuery.data && accountQuery.loading) ||
    (!invitationsQuery.data && invitationsQuery.loading);

  return (
    <div className="your-team-container">
      {isLoading && <Loader />}

      <div className="card your-team-container__card">
        <div className="card-heading your-team-container__heading">
          <i
            className="fa fa-chevron-left"
            aria-hidden="true"
            onClick={() => history.push(settings)}
          />
          Your team
        </div>
        <div className="your-team">
          <div className="your-team__header">Team members</div>
          <div className="your-team__members">
            {account.members?.map(member => {
              return (
                <div
                  className="your-team__members__member"
                  key={`member-id-${member.email}`}
                >
                  <i
                    className={
                      teamLoaders[member.email]
                        ? "fa fa-spinner fa-spin"
                        : "fa fa-times-circle"
                    }
                    aria-hidden="true"
                    style={{
                      visibility: member.isMe ? "hidden" : "visible",
                    }}
                    onClick={async () => {
                      if (teamLoaders[member.email]) {
                        return;
                      }

                      setTeamLoaders({
                        ...teamLoaders,
                        [member.email]: true,
                      });

                      let variables = { email: member.email };
                      try {
                        await removeUser({ variables });
                      } catch (error) {
                        console.log("error", error);
                      }

                      setTeamLoaders({
                        ...teamLoaders,
                        [member.email]: false,
                      });
                    }}
                  />

                  <div>
                    <div className="name">
                      {member.given_name} {member.family_name}
                      {member.isMe && " (you)"}
                    </div>

                    <div className="email">{member.email}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {!!invitations.length && (
            <>
              <div className="your-team__header your-team__pending-invitation">
                Pending invitations
              </div>

              <div className="your-team__members">
                {invitations.map(({ email }) => (
                  <div className="your-team__members__member" key={email}>
                    <i
                      className={
                        pendingLoaders[email]
                          ? "fa fa-spinner fa-spin"
                          : "fa fa-times-circle"
                      }
                      aria-hidden="true"
                      onClick={async () => {
                        if (pendingLoaders[email]) {
                          return;
                        }

                        setPendingLoaders({
                          ...pendingLoaders,
                          [email]: true,
                        });

                        let variables = { email };
                        try {
                          await removeInvitation({ variables });
                        } catch (error) {
                          console.log("error", error);
                        }

                        setPendingLoaders({
                          ...pendingLoaders,
                          [email]: false,
                        });
                      }}
                    />
                    {email}
                  </div>
                ))}
              </div>
            </>
          )}

          <hr />

          <div className="your-team__email">Invite new member</div>
          <div className="your-team__pending-invite-container">
            <input
              type="text"
              placeholder="name@email.com"
              autoComplete="off"
              className="your-team__pending-invite-container__search-user"
              value={email}
              onChange={e => {
                let val = e.target.value.trim().toLocaleLowerCase();
                setIsEmail(validateEmail(val));
                setEmail(val);
              }}
            />

            <ButtonWithIcon
              className={`your-team__pending-invite-container__invite-btn ${
                isEmail && "active"
              }`}
              iconName="add"
              text="invite"
              iconPosition={ICONPOSITION.START}
              loading={inviteUserRes.loading}
              onClick={async () => {
                if (!isEmail || !email) {
                  return;
                }

                if (inviteUserRes.loading) {
                  return;
                }

                let variables = { email };
                try {
                  await inviteUser({ variables });
                } catch (error) {
                  console.log("error", error);
                }

                setEmail("");
                setIsEmail(false);
              }}
            />
          </div>
        </div>
      </div>

      {deleteModal && (
        <Modal
          title="Delete member from your team"
          submit={() => {
            setDeleteModal(false);
          }}
          close={() => {
            setDeleteModal(false);
          }}
          submitTxt="Delete"
          closeTxt="Cancel"
          submitButtonStyle="secondary"
          children={
            <p className="delete-member-modal-from-team">
              Are you sure you want to delete the member (daria.kys29@gmail.com)
              from your team?
            </p>
          }
        />
      )}
    </div>
  );
}
