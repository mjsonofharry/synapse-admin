import React, { useState } from "react";
import { classnames } from "tailwindcss-classnames";
import Auth, { AuthInfo } from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null);

  return (
    <div className={classnames("m-10")}>
      {!authInfo && <Auth setAuthInfo={setAuthInfo} />}
      {authInfo && <Dashboard authInfo={authInfo} />}
    </div>
  );
}

export default App;
