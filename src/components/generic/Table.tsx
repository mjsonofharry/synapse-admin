import React, { useState } from "react";
import { classnames } from "tailwindcss-classnames";
import moment from "moment";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";

const headerCellStyles = classnames(
  "ml-1",
  "text-xs",
  "font-light",
  "break-words",
  "overflow-hidden"
);

const dataCellStyles = classnames(
  "pl-1",
  "pr-2",
  "ml-1",
  "text-base",
  "max-w-xs",
  "max-h-12",
  "overflow-hidden",
  "break-words"
);

const rowStyles = classnames(
  "bg-gray-900",
  "hover:bg-gray-800",
  "text-gray-200",
  "border-b",
  "border-gray-100",
  "h-16"
);

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
    return ts !== undefined
      ? moment.unix(ts / 1000).format("YYYY/MM/DD, hh:mm a")
      : "";
  }
}

export interface Column {
  label: string;
  formatter?: (x: any) => React.ReactNode;
}

export type ColumnDefs<T> = Record<keyof T, Column>;

function Cell<T>(props: { data: T[keyof T]; column: Column }): JSX.Element {
  const formattedData = props.column.formatter
    ? props.column.formatter(props.data)
    : props.data;
  return <td className={dataCellStyles}>{formattedData}</td>;
}

function Row<T>(props: {
  data: T;
  columns: ColumnDefs<T>;
  onClick?: (data: T) => void;
  controls?: (data: T) => React.ReactNode;
}): JSX.Element {
  return (
    <tr
      onClick={() => props.onClick && props.onClick(props.data)}
      className={rowStyles}
    >
      {(Object.keys(props.columns) as Array<keyof T>).map((k) => (
        <Cell
          key={k as string}
          data={props.data[k]}
          column={props.columns[k]}
        />
      ))}
      {props.controls && (
        <td className={classnames(dataCellStyles)}>
          {props.controls(props.data)}
        </td>
      )}
    </tr>
  );
}

function EmptyRow(props: { length: number }) {
  return (
    <tr className={rowStyles}>
      {Array.from(Array(props.length).keys()).map((i) => (
        <td key={i} className={dataCellStyles}></td>
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
        <p className={headerCellStyles}>{props.label}</p>
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
  controls?: (data: T) => React.ReactNode;
  pageSize: number;
  onClickRow?: (data: T) => void;
}): JSX.Element {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState(1);

  // TODO: Paginated data needs to be fetched via a callback, not provided as a prop
  // TODO: Sorting needs to be done via API call, not in-memory
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
          {props.controls && (
            <th className={classnames("pr-3")}>
              <p className={headerCellStyles}>Actions</p>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((x) => (
          <Row
            key={x.key}
            data={x.value}
            columns={props.columns}
            controls={props.controls}
            onClick={props.onClickRow}
          />
        ))}
        {sortedData.length < props.pageSize &&
          Array.from(Array(props.pageSize - sortedData.length).keys()).map(
            (i) => (
              <EmptyRow
                key={i}
                length={
                  Object.keys(props.columns).length + (props.controls ? 1 : 0)
                }
              />
            )
          )}
      </tbody>
    </table>
  );
}
