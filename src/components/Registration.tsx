import React, { useState } from "react";

import { Fetcher, handleFetch } from "./generic/Fetch";
import { AuthInfo } from "./Login";
import Table, { ColumnDefs, Formatters } from "./generic/Table";
import { ContentCard } from "./generic/Content";
import { classnames } from "tailwindcss-classnames";
import { EyeIcon, EyeOffIcon, XIcon } from "@heroicons/react/solid";
import { IconButton, LabelledButton, SubmitButton } from "./generic/Button";
import Modal from "./generic/Modal";

interface CreateTokenRequest {
  token?: string;
  uses_allowed: number;
  expiry_time: number;
  length?: number;
}

interface RegistrationToken {
  token: string;
  uses_allowed: number;
  pending: number;
  completed: number;
  expiry_time?: number;
}

const columns: ColumnDefs<RegistrationToken> = {
  token: {
    label: "Token",
    formatter: (token: string) => <TokenCell token={token} />,
  },
  uses_allowed: { label: "Max Uses" },
  pending: { label: "Pending Uses" },
  completed: { label: "Completed Uses" },
  expiry_time: { label: "Expiry", formatter: Formatters.date },
};

function TokenCell(props: { token: string }): JSX.Element {
  const [hidden, setHidden] = useState(true);
  if (hidden) {
    return (
      <>
        <IconButton
          type="cancel"
          icon={EyeOffIcon}
          onClick={() => setHidden(false)}
          className={classnames("inline", "mr-2")}
        />
        <span className={classnames("italic")}>Hidden</span>
      </>
    );
  } else {
    return (
      <>
        <IconButton
          type="cancel"
          icon={EyeIcon}
          onClick={() => setHidden(true)}
          className={classnames("inline", "mr-2")}
        />
        <span>{props.token}</span>
      </>
    );
  }
}

function CreateTokenForm(props: {
  authInfo: AuthInfo;
  onSubmit: () => void;
  onLoad: () => void;
}) {
  const now = new Date();
  const today = Formatters.dateInput(now);
  const [token, setToken] = useState<string | null>(null);
  const [usesAllowed, setUsesAllowed] = useState(1);
  const [expiryDate, setExpiryDate] = useState<string>(today);
  const [expiryTime, setExpiryTime] = useState<string>("23:59");
  const [length, setLength] = useState<number | null>(null);
  const expiryTimestamp = Date.parse(`${expiryDate}T${expiryTime}`);
  const invalidTimestamp = now.getTime() > expiryTimestamp;

  return (
    <form
      className={classnames("flex", "flex-col", "h-full")}
      onSubmit={(event) => {
        event.preventDefault();
        const body: CreateTokenRequest = {
          ...(token ? { token: token } : {}),
          ...(length ? { length: length } : {}),
          uses_allowed: usesAllowed,
          expiry_time: expiryTimestamp,
        };
        handleFetch<unknown>({
          url: `https://${props.authInfo.server}/_synapse/admin/v1/registration_tokens/new`,
          method: "POST",
          token: props.authInfo.token,
          body: JSON.stringify(body),
          onLoad: () => props.onLoad(),
          onError: () => alert("Token creation failed"),
        });
        props.onSubmit();
      }}
    >
      <p className={classnames("font-extralight")}>
        For a randomly generated registration token, leave the name field blank
        and select the desired token length.
      </p>
      <label className={classnames("my-2", "flex", "justify-between")}>
        Name (optional):
        <input
          className={classnames("mx-2", "px-2")}
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
          className={classnames("mx-2", "px-2")}
          type="number"
          value={usesAllowed}
          onChange={(event) => setUsesAllowed(parseInt(event.target.value))}
          required={true}
          name="uses_allowed"
          min={1}
        />
      </label>
      <label className={classnames("my-2", "flex", "justify-between")}>
        Expiry Date:
        <input
          className={classnames("mx-2", "px-2")}
          type="date"
          value={expiryDate}
          onChange={(event) => setExpiryDate(event.target.value)}
          required={true}
          name="expiry_date"
          min={today}
        />
      </label>
      <label className={classnames("my-2", "flex", "justify-between")}>
        Expiry Time:
        <input
          className={classnames("mx-2", "px-2")}
          type="time"
          value={expiryTime}
          onChange={(event) => setExpiryTime(event.target.value)}
          required={true}
          name="expiry_time"
        />
      </label>
      <label className={classnames("my-2", "flex", "justify-between")}>
        Length (optional):
        <input
          className={classnames("mx-2", "px-2")}
          type="number"
          value={length ?? 16}
          onChange={(event) => setLength(parseInt(event.target.value))}
          name="length"
          min={1}
        />
      </label>
      {invalidTimestamp && (
        <p className={classnames("text-red-500")}>
          Expiry date is set in the past!
        </p>
      )}
      <SubmitButton
        className={classnames("mt-auto")}
        disabled={invalidTimestamp}
      />
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
              <Modal
                title="Create Registration Token"
                hide={() => setCreatingToken(false)}
              >
                <CreateTokenForm
                  authInfo={props.authInfo}
                  onSubmit={() => setCreatingToken(false)}
                  onLoad={() => {
                    setFetchId(-fetchId);
                    setCreatingToken(false);
                  }}
                />
              </Modal>
            )}
            <header className={classnames("text-2xl", "font-bold", "pb-4")}>
              Registration Tokens
            </header>
            <LabelledButton
              type="create"
              label="Create Token"
              onClick={() => setCreatingToken(true)}
              className={classnames("mb-4")}
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
