import React, { useState } from "react";
import { classnames } from "tailwindcss-classnames";
import moment from "moment";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";

export class Formatters {
  public static yesNo(n: number): string {
    return n === 1 ? "Yes" : "No";
  }

  public static date(ts: number): string {
    return moment.unix(ts / 1000).format("YYYY/MM/DD, hh:mm a");
  }

  public static optional(s: string): string {
    return s ? s : "N/A";
  }
}

export interface Column {
  label: string;
  formatter?: (x: any) => string;
}

export type ColumnDefs<T> = Record<keyof T, Column>;

function Cell<T>(props: { data: T[keyof T]; column: Column }): JSX.Element {
  const formattedData = props.column.formatter
    ? props.column.formatter(props.data)
    : props.data;
  return (
    <td className={classnames("pr-3")}>
      <p className={classnames("max-w-xs", "overflow-hidden")}>
        {formattedData}
      </p>
    </td>
  );
}

function Row<T>(props: { data: T; columns: ColumnDefs<T> }): JSX.Element {
  return (
    <tr>
      {(Object.keys(props.columns) as Array<keyof T>).map((k) => (
        <Cell
          key={k as string}
          data={props.data[k]}
          column={props.columns[k]}
        />
      ))}
    </tr>
  );
}

export default function Table<T>(props: {
  data: { key: string; value: T }[];
  columns: ColumnDefs<T>;
}): JSX.Element {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState(1);

  if (props.data.length === 0) {
    return <p className={classnames("text-3xl")}>No Results</p>;
  }

  const sortedData =
    sortKey !== null
      ? props.data.sort((a, b) => {
          const lhs = a.value[sortKey];
          const rhs = b.value[sortKey];
          if (lhs < rhs) {
            return -1 * sortDirection;
          } else if (lhs > rhs) {
            return 1 * sortDirection;
          } else {
            return 0;
          }
        })
      : props.data;

  return (
    <table>
      <thead>
        <tr>
          {(Object.keys(props.columns) as Array<keyof T>).map((k) => (
            <td key={k as string} className={classnames("pr-3")}>
              <button
                onClick={() => {
                  if (sortKey === k) {
                    setSortDirection(-sortDirection);
                  } else {
                    setSortKey(k);
                    setSortDirection(1);
                  }
                }}
                className={classnames("flex")}
              >
                <p className={classnames("text-lg")}>
                  {props.columns[k].label}
                </p>
                {k === sortKey && (
                  <figure className={classnames("mt-1", "ml-1", "w-4", "h-4")}>
                    {sortDirection === 1 ? (
                      <ChevronUpIcon />
                    ) : (
                      <ChevronDownIcon />
                    )}
                  </figure>
                )}
                {k !== sortKey && (
                  <mark className={classnames("ml-1", "w-4")} />
                )}
              </button>
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((x) => (
          <Row key={x.key} data={x.value} columns={props.columns} />
        ))}
      </tbody>
    </table>
  );
}
