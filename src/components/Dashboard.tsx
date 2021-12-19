import React from "react";
import { AuthInfo } from "./Auth";

export default function Dashboard(props: { authInfo: AuthInfo }) {
  const motd = `Welcome to the admin dashboard for ${props.authInfo.server}, ${props.authInfo.user}`;

  return (
    <div>
      <p>{motd}</p>
    </div>
  );
}
