import React, { useState } from "react";
import { useTable } from "react-table";

const data = [
  { "1st Trimester Registration (%)": 38.1, "Institutional Delivery (%)": 33.33, "Low Birth Weight (%)": 0, "Percentage Test": 33.33, "Percentage Test": 0  },
  { "1st Trimester Registration (%)": 80, "Institutional Delivery (%)": null, "Low Birth Weight (%)": null,  "Percentage Test": 33.33, "Percentage Test": 0  },
  { "1st Trimester Registration (%)": 60, "Institutional Delivery (%)": 0, "Low Birth Weight (%)": 0,  "Percentage Test": 33.33, "Percentage Test": 0  },
  { "1st Trimester Registration (%)": 80, "Institutional Delivery (%)": 15.15, "Low Birth Weight (%)": 0,  "Percentage Test": 33.33, "Percentage Test": 0  },
  { "1st Trimester Registration (%)": 67.42, "Institutional Delivery (%)": 53.13, "Low Birth Weight (%)": 6.45,  "Percentage Test": 33.33, "Percentage Test": 0  }
];

const columns_1 = [
  {
    Header: "1st Trimester Registration (%)",
    accessor: "1st Trimester Registration (%)"
  },
  {
    Header: "Institutional Delivery (%)",
    accessor: "Institutional Delivery (%)"
  },
  {
    Header: "Low Birth Weight (%)",
    accessor: "Low Birth Weight (%)"
  }
];


function ReactTable({ data, columns }) {

  // Initialize React Table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  });

  return (
    <table {...getTableProps()} style={{ overflow: 'scroll', border: "solid 1px blue", width: "100%" }}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: "solid 1px red",
                  background: "aliceblue",
                  color: "black",
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
