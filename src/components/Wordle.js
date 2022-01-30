import { useState, useEffect } from 'react';

export default function Wordle() {
  const [inputWord, setInputWord] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentBox, setCurrentBox] = useState(0);
  const [wordleGrid, setWordleGrid] = useState(
    {
      0: {},
      1: {},
      2: {},
      3: {},
      4: {},
      5: {}
    }
  );

  const onClickBegin = () => {
    setIsStarted(true);
  }

  const updateGridAt = (row, col, val) => {
    return setWordleGrid(
      {
        ...wordleGrid,
        [row]: {
          ...wordleGrid[row],
          [col]: val
        }
      }
    )
  }

  const getWordSize = () => inputWord.length;

  useEffect(() => {
    document.addEventListener("keydown", onKeyPress);
  })

  const onKeyPress = (e) => {
    if (isStarted) {
      updateGridAt(currentRow, currentBox, e.key);
      if (currentBox === getWordSize() - 1) {
        setCurrentRow(currentRow + 1);
        setCurrentBox(0);
      } else {
        setCurrentBox(currentBox + 1);
      }
    }
  }

  const createGrid = () => {
    return Array(6).fill(null).map((_, i) => {
      return (
        <div className="wordle-grid-row" key={`row-${i}`}>
          {
            Array(getWordSize()).fill(null).map((_, j) => {
              return (
                <div className="wordle-letter-box" key={`box-${j}`}>
                  {wordleGrid[i][j] || ''}
                </div>
              );
            })
          }
        </div>
      );
    });
  }

  return (
    <div className="Wordle">
      {!isStarted && (
        <>
          <p>Enter a word to begin</p>
          <input 
            type="text"
            className="wordle-input"
            value={inputWord} 
            onChange={ event => setInputWord(event.target.value) } 
          />
          <button onClick={onClickBegin} style={{display: 'block', margin: '0 auto'}}>Begin</button>
        </>
      )}
      {isStarted && (
        <div onKeyDown={onKeyPress}>
          <p style={{marginBottom: '1rem'}}>We have begun</p>
          <div className="wordle-grid">
            {createGrid()}
          </div>
        </div>
      )}
    </div>
  );
}