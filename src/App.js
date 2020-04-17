/* eslint-disable no-extend-native */
import React, { useState, useEffect } from 'react';
import './App.scss';

Object.defineProperty(Array.prototype, 'chunk', {
  value: function (chunkSize) {
    var temporal = [];

    for (var i = 0; i < this.length; i += chunkSize) {
      temporal.push(this.slice(i, i + chunkSize));
    }

    return temporal;
  },
});

const transpose = (matrix) =>
  matrix.reduce(($, row) => row.map((_, i) => [...($[i] || []), row[i]]), []);

const joinGrid = (grid) => {
  const rows = [];
  grid.forEach((array) => rows.push(array.join('')));
  return rows.join('');
};

const encryptGridToString = (grid) => {};

const makeGrid = (rows, columns, symbol = '') =>
  new Array(rows * columns).fill(symbol).chunk(columns);

function App() {
  const [columns, setColumns] = useState(4);
  const [rows, setRows] = useState(3);

  const initialTextGrid = makeGrid(rows, columns);
  const [textGrid, setTextGrid] = useState(initialTextGrid);

  const initialColumnsOrder = [...new Array(columns).keys()];
  const [columnsOrder, setColumnsOrder] = useState(initialColumnsOrder);

  const initialRowsOrder = [...new Array(rows).keys()];
  const [rowsOrder, setRowsOrder] = useState(initialRowsOrder);

  useEffect(() => {
    setTextGrid(makeGrid(rows, columns));
    setColumnsOrder([...new Array(columns).keys()]);
    setRowsOrder([...new Array(rows).keys()]);
  }, [columns, rows]);

  useEffect(() => {
    setTextGrid(makeGrid(rows, columns));
  }, [columnsOrder, rowsOrder]);

  const sourceStringToEncryptedGrid = (value) => {
    let tempGrid = textGrid;

    const textArray = value.split('').chunk(columns);

    for (let row = 0; row < tempGrid.length; row++) {
      for (let column = 0; column < tempGrid[row].length; column++) {
        if (textArray[row]) {
          tempGrid[row][column] = textArray[row][column] || '';
        } else {
          tempGrid[row] = new Array(columns).fill('');
        }
      }
    }

    let tempEncryptedGrid = makeGrid(rows, columns);

    for (let i = 0; i < rowsOrder.length; i++) {
      tempEncryptedGrid[rowsOrder[i]] = tempGrid[i];
    }
    return tempEncryptedGrid;
  };

  const getEncryptedString = () => {
    let str = '';
    for (let column = 0; column < columnsOrder.length; column++) {
      for (let row = 0; row < rows; row++) str += textGrid[row][column];
    }
    return str;
  };

  const handleDecryptInput = ({ target: { value } }) => {
    if (value > rows * columns) return;

    const encryptedGrid = sourceStringToEncryptedGrid(value);

    setTextGrid([...encryptedGrid]);
  };

  const handleEncryptInput = ({ target: { value } }) => {};

  const stringToArray = (s) => s.split(',').map((v) => parseInt(v));

  return (
    <div className='App'>
      <div>
        <div className='input'>
          <span>Кількість стовпців</span>
          <input
            type='text'
            onChange={({ target: { value } }) =>
              setColumns(parseInt(value) || columns)
            }
            value={columns}
          />
        </div>
        <div className='input'>
          <span>Порядок стовпців</span>
          <input
            type='text'
            onChange={({ target: { value } }) =>
              setColumnsOrder(stringToArray(value) || columnsOrder)
            }
            value={columnsOrder}
          />
        </div>
        <div className='input'>
          <span>Кількість рядків</span>
          <input
            type='text'
            onChange={({ target: { value } }) =>
              setRows(parseInt(value) || rows)
            }
            value={rows}
          />
        </div>
        <div className='input'>
          <span>Порядок рядків</span>
          <input
            type='text'
            onChange={({ target: { value } }) =>
              setRowsOrder(stringToArray(value) || columnsOrder)
            }
            value={rowsOrder}
          />
        </div>
        <div className='input'>
          <span>Розшифрований текст</span>
          <input
            type='text'
            onChange={handleDecryptInput}
            // value={joinGrid(textGrid)}
          />
        </div>
        <div className='input'>
          <span>Зашифрований текст</span>
          <input
            type='text'
            onChange={handleEncryptInput}
            value={getEncryptedString()}
          />
        </div>
      </div>
      {textGrid.some((e) => e.some((c) => c === '')) ? (
        <div>
          <i>Переконайтесь що усі клітинки заповнені</i>
          <div>&nbsp;</div>
        </div>
      ) : null}
      {textGrid.length > 1 ? null : (
        <div>
          <i>Текст повинет містити не менше {columns + 1} символів</i>
          <div>&nbsp;</div>
        </div>
      )}

      <table>
        {textGrid.map((row) => (
          <th>
            {row.map((char) => (
              <td>{char}</td>
            ))}
          </th>
        ))}
      </table>
    </div>
  );
}

export default App;
