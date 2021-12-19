import React from "react";
import { useState } from "react";
import { classnames } from "tailwindcss-classnames";

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

export default function Auth(props: {
  setAuthInfo: React.Dispatch<React.SetStateAction<AuthInfo | null>>;
}): JSX.Element {
  const [server, setServer] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className={classnames("flex", "flex-col", "w-96")}
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);
        const content: LoginRequest = {
          type: "m.login.password",
          user: user,
          password: password,
        };
        fetch(`https://${server}/_matrix/client/r0/login`, {
          method: "POST",
          body: JSON.stringify(content),
        })
          .then((response: Response) => {
            if (!response.ok) {
              setError(response.statusText);
              throw Error(response.statusText);
            }
            return response.json() as Promise<LoginResponse>;
          })
          .then((data: LoginResponse) => {
            setError("");
            props.setAuthInfo({ server, user, token: data.access_token });
          })
          .catch(() => {
            setError("Login failed");
          })
          .finally(() => {
            setPassword("******");
            setLoading(true);
          });
      }}
    >
      <label className={classnames("my-2")}>
        Matrix server:
        <input
          className={classnames("mx-2")}
          type="text"
          value={server}
          onChange={(e) => setServer(e.target.value)}
          placeholder="matrix.example.com"
        />
      </label>
      <label className={classnames("my-2")}>
        Username:
        <input
          className={classnames("mx-2")}
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="user@example.com"
        />
      </label>
      <label className={classnames("my-2")}>
        Password:
        <input
          className={classnames("mx-2")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
      </label>
      {loading && <p>Logging in...</p>}
      {error && <p className={classnames("text-red-500")}>{error}</p>}
      <input type="submit" value="Submit" disabled={loading} />
    </form>
  );
}
