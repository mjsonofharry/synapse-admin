import { ClipboardCheckIcon, LogoutIcon, UsersIcon } from "@heroicons/react/solid";
import React, { useState } from "react";
import { classnames } from "tailwindcss-classnames";
import { AuthInfo } from "./Login";
import UserTable from "./Users";

type AppView = "users" | "registration";

export function SidebarButton(props: {
  label: string;
  selected: boolean;
  onClick: () => void;
  iconType: (props: React.ComponentProps<"svg">) => JSX.Element;
}): JSX.Element {
  const icon = React.createElement(props.iconType, {
    className: classnames("w-6", "h-6", "mt-1"),
  });
  return (
    <button
      className={classnames(
        "flex",
        "w-full",
        "p-2",
        "mb-3",
        "shadow-sm",
        props.selected
          ? classnames("bg-gray-200")
          : classnames("bg-gray-50", "hover:bg-gray-100")
      )}
      onClick={() => props.onClick()}
    >
      {icon}
      <p className={classnames("text-2xl", "ml-2")}>{props.label}</p>
    </button>
  );
}

export default function Dashboard(props: {
  authInfo: AuthInfo;
  setAuthInfo: React.Dispatch<React.SetStateAction<AuthInfo | null>>;
}) {
  const [appView, setAppView] = useState<AppView>("users");
  const motd = `Welcome to the admin dashboard for ${props.authInfo.server}, ${props.authInfo.user}`;

  return (
    <main className={classnames("flex")}>
      <div className={classnames("w-72", "p-4")}>
        <p className={classnames("text-sm", "mb-2")}>{motd}</p>
        <SidebarButton
          selected={appView == "users"}
          label="Users"
          onClick={() => setAppView("users")}
          iconType={UsersIcon}
        />
        <SidebarButton
          selected={appView == "registration"}
          label="Registration"
          onClick={() => setAppView("registration")}
          iconType={ClipboardCheckIcon}
        />
        <SidebarButton
          selected={false}
          label="Logout"
          onClick={() => {
            props.setAuthInfo(null)
            window.location.reload()
          }}
          iconType={LogoutIcon}
        />
      </div>
      {appView === "users" && <UserTable authInfo={props.authInfo} />}
    </main>
  );
}
