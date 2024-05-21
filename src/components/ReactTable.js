import React, { useState } from "react";
import { useTable } from "react-table";


function ReactTable({ data, columns }) {

  // Initialize React Table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  });

  return (
    <table {...getTableProps()} style={{ overflow: 'scroll', border: "solid 1px #1e90ff", width: "100%" }}>
      <thead style={{ backgroundColor: "blue" }}>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: "solid 1px red",
                  background: "#1e90ff",
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "left",
                  padding: "8px"
                }}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} style={{ background: i % 2 === 0 ? "lightgray" : "whitesmoke" }}>
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: "8px",
                      border: "solid 1px gray",
                      background: "white",
                      textAlign: "left"
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ReactTable;
