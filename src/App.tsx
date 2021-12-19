import React, { useState } from "react";
import { classnames } from "tailwindcss-classnames";
import Auth, { AuthInfo } from "./components/Auth";
import Dashboard from "./components/Dashboard";

function App() {
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null);

  console.log(authInfo)

  return (
    <div className={classnames("m-10")}>
      {!authInfo && <Auth setAuthInfo={setAuthInfo} />}
      {authInfo && <Dashboard authInfo={authInfo} />}
    </div>
  );
}

export default App;
