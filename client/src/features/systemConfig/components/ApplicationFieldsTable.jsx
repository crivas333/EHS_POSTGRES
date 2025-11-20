import React, { useState, useEffect } from "react";

const ApplicationFieldsTable = ({ appFields, editRow, deleteUser }) => {
  const [sortedFields, setSortedFields] = useState([]);

  // Sort whenever appFields change
  useEffect(() => {
    const sorted = [...appFields].sort((a, b) =>
      a.fieldData.toUpperCase().localeCompare(b.fieldData.toUpperCase())
    );
    setSortedFields(sorted);
  }, [appFields]);

  return (
    <table>
      <thead>
        <tr>
          <th>Campo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {sortedFields.length > 0 ? (
          sortedFields.map((data) => {
            // Ensure id exists and is unique
            const key = data.id ;
            return (
              <tr key={key}>
                <td>{data.fieldData}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => editRow(data)}
                    className="button muted-button"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteUser(data.id)}
                    className="button muted-button"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={2}>No data</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ApplicationFieldsTable;

