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
import moment from "moment";

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

interface ColumnMeta {
  label: string;
  formatter?: (x: any) => string;
}

function formatNumericalBoolean(n: number): string {
  return n === 1 ? "Yes" : "No";
}

function formatDate(ts: number): string {
  return moment.unix(ts).format("YYYY/MM/DD, hh:mm a");
}

const userColumns: Record<keyof User, ColumnMeta> = {
  name: { label: "Name" },
  is_guest: { label: "Guest", formatter: formatNumericalBoolean },
  admin: { label: "Admin", formatter: formatNumericalBoolean },
  user_type: { label: "Type" },
  deactivated: { label: "Deactivated", formatter: formatNumericalBoolean },
  shadow_banned: { label: "Shadow Banned", formatter: formatNumericalBoolean },
  displayname: { label: "Display Name" },
  avatar_url: { label: "Avatar" },
  creation_ts: { label: "Created", formatter: formatDate },
};

export function UserRow(props: { user: User }): JSX.Element {
  return (
    <tr>
      {(Object.keys(userColumns) as Array<keyof User>).map((k) => {
        const meta = userColumns[k];
        const data = meta.formatter
          ? meta.formatter(props.user[k])
          : props.user[k];
        if (typeof data === "string" && data.length > 32) {
          return (
            <td key={data}>
              <div title={data}>{data.slice(0, 32) + "..."}</div>
            </td>
          );
        } else {
          return <td key={data}>{data}</td>;
        }
      })}
    </tr>
  );
}

export default function UserTable(props: { authInfo: AuthInfo }): JSX.Element {
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
            <table>
              <thead>
                {Object.values(userColumns).map((col) => (
                  <td>{col.label}</td>
                ))}
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserRow key={user.name} user={user} />
                ))}
              </tbody>
            </table>
          </main>
        );
      }}
    </Fetcher>
  );
}
