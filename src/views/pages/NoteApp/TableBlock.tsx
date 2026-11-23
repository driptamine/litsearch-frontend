import React, { useCallback } from "react";
import { styled } from "@linaria/react";

const TableBlock = ({ index, columns, rows, onTableChange }) => {
  const emitChange = useCallback((newCols, newRows) => {
    onTableChange(index, newCols, newRows);
  }, [index, onTableChange]);

  const setCell = (rowIdx, colIdx, value) => {
    const next = rows.map((r, ri) =>
      ri === rowIdx ? r.map((c, ci) => (ci === colIdx ? value : c)) : r
    );
    emitChange(columns, next);
  };

  const setColumn = (colIdx, value) => {
    const next = columns.map((c, ci) => (ci === colIdx ? value : c));
    emitChange(next, rows);
  };

  const addRow = () => {
    emitChange(columns, [...rows, Array(columns.length).fill("")]);
  };

  const addColumn = () => {
    const name = `Col ${columns.length + 1}`;
    emitChange([...columns, name], rows.map((r) => [...r, ""]));
  };

  const removeRow = (rowIdx) => {
    if (rows.length <= 1) return;
    emitChange(columns, rows.filter((_, i) => i !== rowIdx));
  };

  const removeColumn = (colIdx) => {
    if (columns.length <= 1) return;
    emitChange(
      columns.filter((_, i) => i !== colIdx),
      rows.map((r) => r.filter((_, i) => i !== colIdx))
    );
  };

  return (
    <Wrapper>
      <Table>
        <thead>
          <tr>
            <th style={{ width: 24 }} />
            {columns.map((col, ci) => (
              <th key={ci}>
                <HeaderInput
                  value={col}
                  onChange={(e) => setColumn(ci, e.target.value)}
                  placeholder="Header"
                />
                {columns.length > 1 && (
                  <RemoveBtn onClick={() => removeColumn(ci)} title="Remove column">×</RemoveBtn>
                )}
              </th>
            ))}
            <AddColBtn onClick={addColumn} title="Add column">+</AddColBtn>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              <td className="row-label">
                <RowLabel>{ri + 1}</RowLabel>
                {rows.length > 1 && (
                  <RemoveBtn onClick={() => removeRow(ri)} title="Remove row">×</RemoveBtn>
                )}
              </td>
              {row.map((cell, ci) => (
                <td key={ci}>
                  <CellInput
                    value={cell}
                    onChange={(e) => setCell(ri, ci, e.target.value)}
                    placeholder="..."
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <AddRowBtn onClick={addRow}>+ Add row</AddRowBtn>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 8px 0;
  overflow-x: auto;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-size: 14px;

  th, td {
    border: 1px solid #d0d0d0;
    padding: 4px 6px;
    min-width: 100px;
    position: relative;
  }

  th {
    background: #f0f0f0;
    font-weight: 600;
    text-align: left;
  }

  td.row-label {
    min-width: 32px;
    text-align: center;
    background: #f5f5f5;
    padding: 4px 2px;
  }
`;

const HeaderInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
`;

const CellInput = styled.input`
  border: none;
  outline: none;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  background: transparent;

  &:focus {
    background: #fafafa;
  }
`;

const RowLabel = styled.span`
  color: #999;
  font-size: 12px;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #ccc;
  font-size: 14px;
  padding: 0 2px;
  line-height: 1;
  position: absolute;
  right: 2px;
  top: 2px;

  &:hover {
    color: #e33;
  }
`;

const AddColBtn = styled.th`
  border: 1px dashed #d0d0d0;
  background: none;
  cursor: pointer;
  font-size: 16px;
  color: #999;
  text-align: center;
  min-width: 32px;
  padding: 4px;
  user-select: none;

  &:hover {
    background: #e8f4ff;
    color: #1a73e8;
  }
`;

const AddRowBtn = styled.button`
  margin: 6px 0;
  background: none;
  border: 1px dashed #d0d0d0;
  border-radius: 4px;
  padding: 6px 16px;
  cursor: pointer;
  font-size: 13px;
  color: #888;
  width: 100%;
  text-align: center;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

export default TableBlock;
