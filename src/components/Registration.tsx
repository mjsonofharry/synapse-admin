import React from "react";
import { Fetcher } from "./generic/Fetch";
import { AuthInfo } from "./Login";
import Table, { ColumnDefs, Formatters } from "./generic/Table";
import { ContentCard } from "./generic/Content";

interface Token {
  token: string;
  uses_allowed: number;
  pending: number;
  completed: number;
  expiry_time?: number;
}

const columns: ColumnDefs<Token> = {
  token: { label: "Token" },
  uses_allowed: { label: "Max Uses" },
  pending: { label: "Pending Uses" },
  completed: { label: "Completed Uses" },
  expiry_time: { label: "Expiry", formatter: Formatters.date },
};

export default function Registration(props: {
  authInfo: AuthInfo;
}): JSX.Element {
  return (
    <Fetcher<{ registration_tokens: Token[] }>
      url={`https://${props.authInfo.server}/_synapse/admin/v1/registration_tokens`}
      method="GET"
      token={props.authInfo.token}
    >
      {({ data, loading, error }) => {
        const tokens = data?.registration_tokens ?? [];
        return (
          <ContentCard>
            <Table
              data={tokens.map((token) => ({ key: token.token, value: token }))}
              columns={columns}
              pageSize={5}
            />
          </ContentCard>
        );
      }}
    </Fetcher>
  );
}
