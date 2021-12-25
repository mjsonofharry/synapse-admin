import React, { useState } from "react";

import { Fetcher, handleFetch } from "./generic/Fetch";
import { AuthInfo } from "./Login";
import Table, { ColumnDefs, Formatters } from "./generic/Table";
import { ContentCard } from "./generic/Content";
import { classnames } from "tailwindcss-classnames";
import { PlusCircleIcon, XIcon } from "@heroicons/react/solid";
import { IconButton, LabelledButton } from "./generic/Button";
import Modal from "./generic/Modal";

interface RegistrationToken {
  token: string;
  uses_allowed: number;
  pending: number;
  completed: number;
  expiry_time?: number;
}

const columns: ColumnDefs<RegistrationToken> = {
  token: { label: "Token" },
  uses_allowed: { label: "Max Uses" },
  pending: { label: "Pending Uses" },
  completed: { label: "Completed Uses" },
  expiry_time: { label: "Expiry", formatter: Formatters.date },
};

function CreateTokenForm() {
  const [token, setToken] = useState<string | null>(null);
  const [usesAllowed, setUsesAllowed] = useState(1);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [expiryTime, setExpiryTime] = useState<string | null>(null);
  const [length, setLength] = useState<number | null>(null);

  return (
    <form className={classnames("flex", "flex-col")}>
      <label className={classnames("my-2", "flex", "justify-between")}>
        Name (optional):
        <input
          className={classnames("mx-2")}
          type="text"
          value={token ?? ""}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Leave blank for random"
          required={false}
          name="token"
        />
      </label>
      <label className={classnames("my-2", "flex", "justify-between")}>
        Uses Allowed:
        <input
          className={classnames("mx-2")}
          type="number"
          value={usesAllowed}
          onChange={(event) => setUsesAllowed(parseInt(event.target.value))}
          required={true}
          name="uses_allowed"
        />
      </label>
      <label className={classnames("my-2", "flex", "justify-between")}>
        Expiry Date:
        <input
          className={classnames("mx-2")}
          type="date"
          value={expiryDate ?? new Date().toDateString()}
          onChange={(event) => setExpiryDate(event.target.value)}
          required={true}
          name="expiry_date"
        />
      </label>
      <label className={classnames("my-2", "flex", "justify-between")}>
        Expiry Time:
        <input
          className={classnames("mx-2")}
          type="time"
          value={expiryTime ?? "11:59"}
          onChange={(event) => setExpiryTime(event.target.value)}
          required={true}
          name="expiry_time"
        />
      </label>
      <label className={classnames("my-2", "flex", "justify-between")}>
        Length (optional):
        <input
          className={classnames("mx-2")}
          type="number"
          value={length ?? 16}
          onChange={(event) => setLength(parseInt(event.target.value))}
          name="length"
        />
      </label>
    </form>
  );
}

export default function Registration(props: {
  authInfo: AuthInfo;
}): JSX.Element {
  const [fetchId, setFetchId] = useState(-1);
  const [creatingToken, setCreatingToken] = useState(false);

  return (
    <Fetcher<{ registration_tokens: RegistrationToken[] }>
      id={fetchId}
      url={`https://${props.authInfo.server}/_synapse/admin/v1/registration_tokens`}
      method="GET"
      token={props.authInfo.token}
    >
      {({ data, loading, error }) => {
        const tokens = data?.registration_tokens ?? [];
        return (
          <ContentCard>
            {creatingToken && (
              <Modal hide={() => setCreatingToken(false)}>
                <CreateTokenForm />
              </Modal>
            )}
            <header className={classnames("text-2xl", "font-bold", "pb-4")}>
              Registration Tokens
            </header>
            <LabelledButton
              type="create"
              label="Create Token"
              onClick={() => setCreatingToken(true)}
              classNames={classnames("mb-4")}
            />
            <Table
              data={tokens.map((token) => ({ key: token.token, value: token }))}
              columns={columns}
              pageSize={5}
              controls={(token) => (
                <div className={classnames("flex", "justify-center")}>
                  <IconButton
                    type="delete"
                    icon={XIcon}
                    onClick={() =>
                      handleFetch({
                        url: `https://${props.authInfo.server}/_synapse/admin/v1/registration_tokens/${token.token}`,
                        method: "DELETE",
                        token: props.authInfo.token,
                        onLoad: () => setFetchId(-fetchId),
                        onError: () => alert("Failed to delete token!"),
                      })
                    }
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
