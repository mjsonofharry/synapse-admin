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
import Table, { ColumnDefs, Formatters } from "./Table";

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

const columns: ColumnDefs<User> = {
  name: { label: "ID" },
  is_guest: { label: "Guest", formatter: Formatters.yesNo },
  admin: { label: "Admin", formatter: Formatters.yesNo },
  user_type: { label: "Type", formatter: Formatters.optional },
  deactivated: { label: "Deactivated", formatter: Formatters.yesNo },
  shadow_banned: { label: "Banned", formatter: Formatters.yesNo },
  displayname: { label: "Name" },
  avatar_url: { label: "Avatar" },
  creation_ts: { label: "Created", formatter: Formatters.date },
};

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
          <main>
            <form
              className={classnames("my-2")}
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
            <Table<User>
              data={users.map((user) => ({ key: user.name, value: user }))}
              columns={columns}
            />
          </main>
        );
      }}
    </Fetcher>
  );
}
