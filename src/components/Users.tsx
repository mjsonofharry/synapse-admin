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
  PencilAltIcon,
  ShieldCheckIcon,
  UserIcon,
  XIcon,
} from "@heroicons/react/solid";
import Table, { ColumnDefs, Formatters } from "./generic/Table";
import { ContentCard } from "./generic/Content";
import Modal from "./generic/Modal";
import Tooltip from "./generic/Tooltip";
import { IconButton, SubmitButton } from "./generic/Button";

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

function Avatar(props: { server: string; mxc: string }): JSX.Element {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);

  if (!props.mxc) {
    return <></>;
  }
  const resource = props.mxc.replace("mxc://", "");
  const contentUrl = `https://${props.server}/_matrix/media/r0/thumbnail/${resource}?width=128&height=128&method=crop`;
  return (
    <>
      <Tooltip show={showFeedback} text="Copied!" />
      <Tooltip show={showHint} text="Copy to clipboard" />
      <img
        onClick={() => {
          navigator.clipboard.writeText(contentUrl);
          setShowFeedback(true);
          setShowHint(false);
        }}
        onMouseEnter={() => {
          if (!showFeedback) {
            setShowHint(true);
          }
        }}
        onMouseLeave={() => {
          if (showFeedback) {
            setShowFeedback(false);
          }
          if (showHint) {
            setShowHint(false);
          }
        }}
        className={classnames("cursor-pointer", "rounded-2xl")}
        title={contentUrl}
        src={contentUrl}
        width={32}
        height={32}
      />
    </>
  );
}

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
      className={classnames("flex", "flex-wrap", "pb-4")}
      onSubmit={(event) => {
        event.preventDefault();
        props.setActiveFilters(encodeFilters(props.filters));
      }}
    >
      <label className={classnames("leading-loose")}>
        User ID:
        <input
          className={classnames("mx-2", "px-2", "leading-loose")}
          type={"text"}
          value={props.filters.user_id}
          onChange={(event) =>
            props.setFilters({ ...props.filters, user_id: event.target.value })
          }
          placeholder="@username:example.com"
        />
      </label>
      <label className={classnames("leading-loose")}>
        Name:
        <input
          className={classnames("mx-2", "px-2", "leading-loose")}
          type={"text"}
          value={props.filters.name}
          onChange={(event) =>
            props.setFilters({ ...props.filters, name: event.target.value })
          }
          placeholder="username"
        />
      </label>
      <label className={classnames("leading-loose")}>
        Guests:
        <input
          className={classnames("mx-2", "px-2")}
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
      <label className={classnames("leading-loose")}>
        Deactivated:
        <input
          className={classnames("mx-2", "px-2")}
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
      <SubmitButton className={classnames("ml-auto")} />
    </form>
  );
}

function UserModal(props: { user: User }): JSX.Element {
  return <p>test</p>;
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
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const userColumns: ColumnDefs<User> = {
    name: { label: "ID" },
    is_guest: { label: "Guest", formatter: Formatters.yesNo },
    admin: { label: "Admin", formatter: Formatters.yesNo },
    user_type: { label: "Type" },
    deactivated: { label: "Deactivated", formatter: Formatters.yesNo },
    shadow_banned: { label: "Banned", formatter: Formatters.yesNo },
    displayname: { label: "Name" },
    avatar_url: {
      label: "Avatar",
      formatter: (mxc: string) => (
        <Avatar server={props.authInfo.server} mxc={mxc} />
      ),
    },
    creation_ts: { label: "Created", formatter: Formatters.date },
  };

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
            {editingUser && (
              <Modal hide={() => setEditingUser(null)}>
                <UserModal user={editingUser} />
              </Modal>
            )}
            <header className={classnames("text-2xl", "font-bold")}>
              Users
            </header>
            <FilterControls
              filters={filters}
              setFilters={setFilters}
              setActiveFilters={setActiveFilters}
            />
            <Table<User>
              data={users.map((user) => ({ key: user.name, value: user }))}
              columns={userColumns}
              pageSize={5}
              controls={(user) => (
                <div className={classnames("flex", "justify-center")}>
                  <IconButton
                    type="confirm"
                    icon={PencilAltIcon}
                    onClick={() => setEditingUser(user)}
                    className={classnames("inline", "mx-1")}
                  />
                </div>
              )}
            />
          </ContentCard>
        );
      }}
    </Fetcher>
  );
}
