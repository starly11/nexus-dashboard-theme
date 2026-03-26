import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./Card";

type TableValue = unknown;

function getTableCellValue<T extends object>(item: T, columnKey: keyof T | string): TableValue {
  if (Object.prototype.hasOwnProperty.call(item, columnKey)) {
    return Reflect.get(item, columnKey);
  }

  return undefined;
}

function getTableRowKey<T extends object>(item: T, rowIndex: number): string | number {
  if ("id" in item && (typeof item.id === "string" || typeof item.id === "number")) {
    return item.id;
  }

  return `row-${rowIndex}`;
}

export interface TableColumn<T extends object> {
  key: keyof T | string;
  header: string;
  render?: (value: TableValue, item: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T extends object> {
  title?: string;
  description?: string;
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  actions?: React.ReactNode;
  onRowClick?: (item: T) => void;
  footer?: React.ReactNode;
}

export function Table<T extends object>({
  title,
  description,
  columns,
  data,
  className = "",
  actions,
  onRowClick,
  footer,
}: TableProps<T>): React.JSX.Element {
  return (
    <Card className={`overflow-hidden ${className}`} padding="none">
      {title || description || actions ? (
        <CardHeader className="surface-header-subtle border-b border-outline-variant/10 px-6 py-5">
          <div>
            {title ? <CardTitle>{title}</CardTitle> : null}
            {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
          </div>
          {actions}
        </CardHeader>
      ) : null}
      <div className="overflow-x-auto bg-gradient-to-b from-surface-container/80 to-surface-container-low/60">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-high/35 font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/55">
              {columns.map((column) => (
                <th key={column.header} className={`px-6 py-4 font-semibold ${column.className ?? ""}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {data.map((item, rowIndex) => (
              <tr
                key={getTableRowKey(item, rowIndex)}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                className={`group relative transition-all duration-300 ${
                  onRowClick ? "cursor-pointer hover:bg-surface-container-high/50" : "hover:bg-surface-container-low/40"
                } ${rowIndex % 2 === 0 ? "bg-white/[0.015]" : "bg-transparent"}`}
              >
                {columns.map((column, colIndex) => {
                  const rawValue = getTableCellValue(item, column.key);

                  return (
                    <td key={`${String(column.key)}-${column.header}-${colIndex}`} className={`px-6 py-4 align-middle ${column.className ?? ""}`}>
                      {column.render ? column.render(rawValue, item) : String(rawValue ?? "")}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer ? <div className="border-t border-outline-variant/10 bg-surface-container-high/20">{footer}</div> : null}
    </Card>
  );
}
