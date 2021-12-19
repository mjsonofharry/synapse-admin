import React, { useState } from "react";
import { classnames } from "tailwindcss-classnames";
import { Fetcher } from "./Fetch";
import { AuthInfo } from "./Login";
import {
  BanIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  GlobeAltIcon,
  HomeIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/solid";

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

function UserAttribute(props: {
  label: string;
  iconType: (props: React.ComponentProps<"svg">) => JSX.Element;
}): JSX.Element {
  const icon = React.createElement(props.iconType, {
    className: classnames("w-4", "h-4", "mt-1"),
  });
  return (
    <figure className={classnames("flex", "px-2")}>
      {icon}
      <span className={classnames("px-1")}>{props.label}</span>
    </figure>
  );
}

function UserCard(props: { user: User }): JSX.Element {
  return (
    <article className={classnames("my-2", "p-4", "bg-gray-50", "shadow-sm")}>
      <p className={classnames("text-2xl")}>{props.user.name}</p>
      <p className={classnames("text-lg", "pb-2")}>
        ({props.user.displayname})
      </p>
      <section className={classnames("flex", "pb-4")}>
        {props.user.is_guest === 1 ? (
          <UserAttribute label="Guest" iconType={GlobeAltIcon} />
        ) : (
          <UserAttribute label="Resident" iconType={HomeIcon} />
        )}
        {props.user.admin === 1 ? (
          <UserAttribute label="Administrator" iconType={ShieldCheckIcon} />
        ) : (
          <UserAttribute label="User" iconType={UserIcon} />
        )}
        <UserAttribute
          label={props.user.user_type || "Default"}
          iconType={IdentificationIcon}
        />
        {props.user.shadow_banned === 1 ? (
          <UserAttribute label="Shadow Banned" iconType={EyeOffIcon} />
        ) : (
          <UserAttribute label="Not Shadow Banned" iconType={EyeIcon} />
        )}
        {props.user.deactivated === 1 ? (
          <UserAttribute label="Deactivated" iconType={BanIcon} />
        ) : (
          <UserAttribute label="Activated" iconType={CheckCircleIcon} />
        )}
      </section>
    </article>
  );
}

export default function Users(props: { authInfo: AuthInfo }): JSX.Element {
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  return (
    <Fetcher<{ users: User[] }>
      url={`https://${props.authInfo.server}/_synapse/admin/v2/users`}
      method="GET"
      token={props.authInfo.token}
    >
      {({ data, loading, error }) => {
        const users =
          data && activeSearch
            ? data.users.filter(
                (user) =>
                  user.name.includes(activeSearch) ||
                  user.displayname.includes(activeSearch) || 
                  user.user_type?.includes(activeSearch)
              )
            : data?.users ?? [];

        return (
          <main className={classnames("flex", "flex-col")}>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setActiveSearch(search);
              }}
            >
              <label>
                Search users:
                <input
                  className={classnames("mx-2")}
                  type={"text"}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Username, user type, etc..."
                  name="search"
                />
              </label>
              <input type="submit" value="Submit" />
            </form>
            {users.map((user) => (
              <UserCard key={user.name} user={user} />
            ))}
          </main>
        );
      }}
    </Fetcher>
  );
}
