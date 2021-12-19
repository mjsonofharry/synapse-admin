import React, { useState } from "react";
import { classnames } from "tailwindcss-classnames";
import { Fetcher } from "./Fetch";
import { AuthInfo } from "./Login";

interface User {
  name: string;
  is_guest: number;
  admin: number;
  user_type?: string;
  deactivated: number;
  shadow_banned: number;
  displayname: string;
  avatar_url?: string;
  creation_ts: number;
}

function UserAttribute(props: {attribute: number, label: string}): JSX.Element {
    if (props.attribute === 1) {
        return <p className={classnames("text-sm")}>{props.label}</p>
    } else {
        return <></>
    }
}

function UserCard(props: { user: User }): JSX.Element {
  return (
    <article className={classnames("my-2")}>
      <p className={classnames("text-lg")}>{props.user.name} ({props.user.displayname})</p>
      <UserAttribute attribute={props.user.is_guest} label="Guest" />
      <UserAttribute attribute={props.user.admin} label="Admin" />
      <UserAttribute attribute={props.user.deactivated} label="Deactivated" />
    </article>
  );
}

export default function Users(props: { authInfo: AuthInfo }): JSX.Element {
  return (
    <Fetcher<{ users: User[] }>
      url={`https://${props.authInfo.server}/_synapse/admin/v2/users`}
      method="GET"
      token={props.authInfo.token}
    >
      {({ data, loading, error }) => {
        return (
          <main className={classnames("flex", "flex-col")}>
            {data?.users.map((user) => (
              <UserCard key={user.name} user={user} />
            ))}
          </main>
        );
      }}
    </Fetcher>
  );
}
