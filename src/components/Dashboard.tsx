import React from "react";
import { AuthInfo } from "./Login";
import Users from "./Users";

export default function Dashboard(props: { authInfo: AuthInfo }) {
  const motd = `Welcome to the admin dashboard for ${props.authInfo.server}, ${props.authInfo.user}`;

  return (
    <main>
      <p>{motd}</p>
      <Users authInfo={props.authInfo} />
    </main>
  );
}
