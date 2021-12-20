import React, { useState } from "react";
import { classnames } from "tailwindcss-classnames";
import { Fetcher } from "./generic/Fetch";
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
import Table, { ColumnDefs, Formatters } from "./generic/Table";
import { ContentCard } from "./generic/Content";

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

interface UserFilters {
  user_id: string;
  name: string;
  guests: boolean;
  deactivated: boolean;
  limit: number;
  from: number;
  order_by: keyof User;
  dir: "f" | "b";
}

const userColumns: ColumnDefs<User> = {
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

function encodeFilters(filters: UserFilters) {
  return new URLSearchParams(
    (Object.keys(filters) as Array<keyof UserFilters>).reduce((acc, k) => {
      return { ...acc, [k]: filters[k]?.toString() };
    }, {})
  );
}

function FilterControls(props: {
  filters: UserFilters;
  setFilters: React.Dispatch<UserFilters>;
  setActiveFilters: React.Dispatch<URLSearchParams>;
}): JSX.Element {
  return (
    <form
      className={classnames("my-2", "flex")}
      onSubmit={(event) => {
        event.preventDefault();
        props.setActiveFilters(encodeFilters(props.filters));
      }}
    >
      <label>
        User ID:
        <input
          className={classnames("mx-2")}
          type={"text"}
          value={props.filters.user_id}
          onChange={(event) =>
            props.setFilters({ ...props.filters, user_id: event.target.value })
          }
          placeholder="@username:example.com"
        />
      </label>
      <label>
        Name:
        <input
          className={classnames("mx-2")}
          type={"text"}
          value={props.filters.name}
          onChange={(event) =>
            props.setFilters({ ...props.filters, name: event.target.value })
          }
          placeholder="username"
        />
      </label>
      <label>
        Guests:
        <input
          className={classnames("mx-2")}
          type={"checkbox"}
          checked={props.filters.guests ?? false}
          onChange={() =>
            props.setFilters({
              ...props.filters,
              guests: !(props.filters.guests ?? false),
            })
          }
        />
      </label>
      <label>
        Deactivated:
        <input
          className={classnames("mx-2")}
          type={"checkbox"}
          checked={props.filters.deactivated ?? false}
          onChange={() =>
            props.setFilters({
              ...props.filters,
              deactivated: !(props.filters.deactivated ?? false),
            })
          }
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default function Users(props: { authInfo: AuthInfo }): JSX.Element {
  const [filters, setFilters] = useState<UserFilters>({
    user_id: "",
    name: "",
    guests: true,
    deactivated: true,
    limit: 100,
    from: 0,
    order_by: "name",
    dir: "f",
  });
  const [activeFilters, setActiveFilters] = useState<URLSearchParams>(
    encodeFilters(filters)
  );

  return (
    <Fetcher<{ users: User[] }>
      url={`https://${props.authInfo.server}/_synapse/admin/v2/users?${activeFilters}`}
      method="GET"
      token={props.authInfo.token}
    >
      {({ data, loading, error }) => {
        const users = data?.users ?? [];
        return (
          <ContentCard>
            <FilterControls
              filters={filters}
              setFilters={setFilters}
              setActiveFilters={setActiveFilters}
            />
            <Table<User>
              data={users.map((user) => ({ key: user.name, value: user }))}
              columns={userColumns}
            />
          </ContentCard>
        );
      }}
    </Fetcher>
  );
}
