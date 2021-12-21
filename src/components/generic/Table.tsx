import React, { useState } from "react";
import { classnames } from "tailwindcss-classnames";
import moment from "moment";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";

export class Formatters {
  public static yesNo(n?: number): string {
    if (n === 1) {
      return "Yes";
    } else if (n === 0) {
      return "No";
    } else {
      return "";
    }
  }

  public static date(ts?: number): string {
    return ts ? moment.unix(ts / 1000).format("YYYY/MM/DD, hh:mm a") : "";
  }
}

export interface Column {
  label: string;
  formatter?: (x: any) => string;
  truncate?: boolean;
}

export type ColumnDefs<T> = Record<keyof T, Column>;

function Cell<T>(props: { data: T[keyof T]; column: Column }): JSX.Element {
  const formattedData = props.column.formatter
    ? props.column.formatter(props.data)
    : props.data;
  return (
    <td className={classnames("pr-3")}>
      <p
        title={formattedData as string}
        className={classnames(
          "ml-1",
          "text-base",
          "max-w-xs",
          "max-h-12",
          "overflow-hidden",
          props.column.truncate
            ? classnames("break-all")
            : classnames("break-words")
        )}
      >
        {formattedData}
      </p>
    </td>
  );
}

function Row<T>(props: { data: T; columns: ColumnDefs<T> }): JSX.Element {
  return (
    <tr
      className={classnames(
        "bg-gray-900",
        "text-gray-200",
        "border-b",
        "border-gray-100",
        "h-16"
      )}
    >
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

function HeaderCell(props: {
  label: string;
  sorting: boolean;
  sortDirection: number;
  onClick: () => void;
}) {
  return (
    <th className={classnames("pr-3")}>
      <button onClick={props.onClick} className={classnames("flex", "w-full")}>
        <p
          className={classnames(
            "ml-1",
            "text-xs",
            "break-words",
            "overflow-hidden"
          )}
        >
          {props.label}
        </p>
        {props.sorting && (
          <figure className={classnames("ml-1", "w-4", "h-4")}>
            {props.sortDirection === 1 ? (
              <ChevronUpIcon />
            ) : (
              <ChevronDownIcon />
            )}
          </figure>
        )}
        {!props.sorting && <mark className={classnames("ml-1", "w-4")} />}
      </button>
    </th>
  );
}

export default function Table<T>(props: {
  data: { key: string; value: T }[];
  columns: ColumnDefs<T>;
  pageSize: number;
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
    <table className={classnames("w-full", "table-auto", "border-collapse")}>
      <thead>
        <tr className={classnames("bg-gray-50")}>
          {(Object.keys(props.columns) as Array<keyof T>).map((k) => (
            <HeaderCell
              key={k as string}
              label={props.columns[k].label}
              sorting={k === sortKey}
              sortDirection={sortDirection}
              onClick={() => {
                if (sortKey === k) {
                  setSortDirection(-sortDirection);
                } else {
                  setSortKey(k);
                  setSortDirection(1);
                }
              }}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((x) => (
          <Row key={x.key} data={x.value} columns={props.columns} />
        ))}
        {sortedData.length < props.pageSize &&
          Array.from(Array(props.pageSize - sortedData.length).keys()).map(
            (i) => <Row key={i} data={{}} columns={props.columns} />
          )}
      </tbody>
    </table>
  );
}
