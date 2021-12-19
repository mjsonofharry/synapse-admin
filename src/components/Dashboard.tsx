import React, { useState } from "react";
import { AuthInfo } from "./Auth";

export default function Dashboard(props: {authInfo: AuthInfo}) {
    return <div>Welcome {props.authInfo.user}</div>
}