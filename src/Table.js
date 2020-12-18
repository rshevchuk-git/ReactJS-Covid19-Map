import React from "react";
import numeral from "numeral";
import "./Table.css";

function Table({countries}) {
  return (
    <div className="table">
      <table>
        <tbody>
          {countries.map(({country, cases}, key) => (
            <tr key={key}>
              <td>{country}</td>
              <td>
                <strong>{numeral(cases).format("0,0")}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
