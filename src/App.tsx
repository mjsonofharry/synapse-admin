import React, { useState } from "react";
import { classnames } from "tailwindcss-classnames";
import Login, { AuthInfo } from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null);

  return (
    <div className={classnames("h-screen", "w-screen", "bg-gray-100")}>
      {!authInfo && <Login setAuthInfo={setAuthInfo} />}
      {authInfo && <Dashboard authInfo={authInfo} setAuthInfo={setAuthInfo} />}
    </div>
  );
}

export default App;
