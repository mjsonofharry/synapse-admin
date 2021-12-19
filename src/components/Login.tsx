import React from "react";
import { useState } from "react";
import { classnames } from "tailwindcss-classnames";
import { handleFetch } from "./Fetch";

export interface AuthInfo {
  server: string;
  user: string;
  token: string;
}

interface LoginRequest {
  type: "m.login.password";
  user: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  home_server: string;
  user_id: string;
}

export default function Login(props: {
  setAuthInfo: React.Dispatch<React.SetStateAction<AuthInfo | null>>;
}): JSX.Element {
  const [server, setServer] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchContent: LoginRequest = {
    type: "m.login.password",
    user: user,
    password: password,
  };

  return (
    <form
      className={classnames("flex", "flex-col", "w-96")}
      onSubmit={(event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        handleFetch<LoginResponse>({
          url: `https://${server}/_matrix/client/r0/login`,
          method: "POST",
          body: JSON.stringify(fetchContent),
          onLoad: (data) => {
            setError("");
            setPassword("******");
            setLoading(false);
            props.setAuthInfo({ server, user, token: data.access_token });
          },
          onError: () => {
            setError("Login failed");
            setPassword("******");
            setLoading(false);
          },
        });
      }}
    >
      <label className={classnames("my-2")}>
        Matrix server:
        <input
          className={classnames("mx-2")}
          type="text"
          value={server}
          onChange={(event) => setServer(event.target.value)}
          placeholder="matrix.example.com"
        />
      </label>
      <label className={classnames("my-2")}>
        Username:
        <input
          className={classnames("mx-2")}
          type="text"
          value={user}
          onChange={(event) => setUser(event.target.value)}
          placeholder="user@example.com"
        />
      </label>
      <label className={classnames("my-2")}>
        Password:
        <input
          className={classnames("mx-2")}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="password"
        />
      </label>
      {loading && <p>Logging in...</p>}
      {error && <p className={classnames("text-red-500")}>{error}</p>}
      <input type="submit" value="Submit" disabled={loading} />
    </form>
  );
}
