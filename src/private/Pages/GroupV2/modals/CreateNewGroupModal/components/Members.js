import React, { useState } from "react";
import { Dropdown } from "Components/UI_Kits/Dropdown";
import { useQuery } from "@apollo/client";
import { groupsGetV2 } from "../../../../../Apollo/Queries";
import validateEmail from "../../../../../../utils/validateEmail";
import { useForm } from "react-hook-form";

export default function Members({ data, setData }) {
  // States
  const [isEmail, setIsEmail] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [selected, setSelected] = useState();

  // Queries
  let groupsQuery = useQuery(groupsGetV2);

  // Data maps
  let items = groupsQuery?.data?.groupsGetV2 || [];

  // Form stuff
  const { register, handleSubmit, setValue } = useForm();

  async function onSubmit({ email }) {
    setData({
      ...data,
      members: [...data.members, email.toLocaleLowerCase().trim()],
    });
    setValue("email", "");
    setIsEmail(false);
  }

  return (
    <div className="startup-container">
      <div className="add-startups row">
        <div className="col-sm-7 col-xs-12 add-text">
          Add members from an existing group:
        </div>
        <div className="col-sm-3 col-xs-12 drop-down">
          <Dropdown
            title="Group"
            items={items}
            setSelectedItem={item => {
              setSelected(item);
            }}
          />
        </div>
        <div className="" />
      </div>

      <div className="startup-list">
        {selected?.members?.map(({ user }) => (
          <div className="row startup" key={user.email}>
            <div className="col-sm-8 col-xs-8 email">
              {/*<i className="fal fa-times" />*/}
              <div>
                {user.given_name} {user.family_name}
              </div>
              <div>{user.email}</div>
            </div>
            <div
              className="col-sm-4 col-xs-4 button invite-button"
              onClick={() => {
                setData({
                  ...data,
                  members: [...data.members, user.email],
                });
              }}
            >
              {data.members.some(m => m === user.email)
                ? "invited"
                : "+ Invite"}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="search">
          <span class="material-icons">search</span>
          <input
            className="search-box"
            placeholder="Type email"
            type="text"
            ref={register}
            name="email"
            onChange={e => {
              let val = e.target.value?.toLocaleLowerCase().trim();
              setIsEmail(validateEmail(val));
              setIsDuplicate(data.members?.some(member => member === val));
            }}
          />
        </div>

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

      {/*<div className="StartupPage-list">*/}
      {/*  <div className="row StartupPage">*/}
      {/*    <div className="col-sm-8 col-xs-8 email">*/}
      {/*      <i className="fal fa-times" />*/}
      {/*      <span>denisgolvanov@gmail.com</span>*/}
      {/*    </div>*/}
      {/*    <div className="col-sm-4 col-xs-4 button invite-button">+ Invite</div>*/}
      {/*  </div>*/}
      {/*  <div className="row StartupPage">*/}
      {/*    <div className="col-sm-8 col-xs-8 email">*/}
      {/*      <i className="fal fa-times" />*/}
      {/*      <span>denisgolvanov@gmail.com</span>*/}
      {/*    </div>*/}
      {/*    <div className="col-sm-4 col-xs-4 button invite-button">+ Invite</div>*/}
      {/*  </div>*/}
      {/*  <div className="row StartupPage">*/}
      {/*    <div className="col-sm-8 col-xs-8 email">*/}
      {/*      <i className="fal fa-times" />*/}
      {/*      <span>denisgolvanov@gmail.com</span>*/}
      {/*    </div>*/}
      {/*    <div className="col-sm-4 col-xs-4 button invite-button">+ Invite</div>*/}
      {/*  </div>*/}
      {/*  <div className="row StartupPage">*/}
      {/*    <div className="col-sm-8 col-xs-8 email">*/}
      {/*      <i className="fal fa-times" />*/}
      {/*      <span>denisgolvanov@gmail.com</span>*/}
      {/*    </div>*/}
      {/*    <div className="col-sm-4 col-xs-4 button invite-button">+ Invite</div>*/}
      {/*  </div>*/}
      {/*  <div className="row StartupPage">*/}
      {/*    <div className="col-sm-8 col-xs-8 email">*/}
      {/*      <i className="fal fa-times" />*/}
      {/*      <span>denisgolvanov@gmail.com</span>*/}
      {/*    </div>*/}
      {/*    <div className="col-sm-4 col-xs-4 button invite-button">+ Invite</div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div className="startup-list">
        <hr />
        {data.members.map(email => {
          return (
            <div className="row startup" key={email}>
              <div className="col-sm-8 col-xs-8 name">
                <i
                  className="fal fa-times"
                  onClick={() => {
                    setData({
                      ...data,
                      members: data.members.filter(member => member !== email),
                    });
                  }}
                />
                <span>{email}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
