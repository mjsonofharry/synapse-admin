import React, { useState } from "react";

type Method = "GET" | "PUT" | "POST" | "DELETE";

export function handleFetch<T>(args: {
  url: string;
  method: Method;
  body?: string;
  token?: string;
  onLoad: (data: T) => void;
  onError: () => void;
}) {
  fetch(args.url, {
    method: args.method,
    body: args.body,
    headers: {
      ...(args.token ? { Authorization: `Bearer ${args.token}` } : {}),
    },
  })
    .then((response: Response) => {
      if (!response.ok) {
        args.onError();
        throw Error(response.statusText);
      }
      return response.json() as Promise<T>;
    })
    .then((data: T) => {
      args.onLoad(data);
    })
    .catch(() => {
      args.onError();
    });
}

export function Fetcher<T>(props: {
  url: string;
  method: Method;
  body?: string;
  token?: string;
  children: (args: {
    data?: T;
    loading: boolean;
    error: boolean;
  }) => JSX.Element;
}) {
  const [shouldLoad, setShouldLoad] = useState(true);
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (shouldLoad) {
    setShouldLoad(false);
    handleFetch<T>({
      url: props.url,
      method: props.method,
      body: props.body,
      token: props.token,
      onLoad: (data) => {
        setLoading(false);
        setData(data);
      },
      onError: () => {
        setLoading(false);
        setError(true);
      },
    });
  }

  return props.children({ data, loading, error });
}
