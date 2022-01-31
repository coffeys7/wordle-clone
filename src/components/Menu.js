import { useState } from 'react';
import Word from '@utilities/Word';
import KeyCodes from '@utilities/KeyCodes';

export default function Menu(props) {
  const [inputWord, setInputWord] = useState('');

  const onBegin = (word) => {
    if (!isInputWordValidWord()) {
      alert('Not a valid word');
      return;
    }
    if (isInputWordValidSize()) 
      props.onBegin(word);
  }

  const onInputKeyPress = (e) => {
    if (e.keyCode === KeyCodes.ENTER) {
      onBegin(e.target.value);
    } else if (!Word.isInAlphabet(e.key) && e.keyCode !== KeyCodes.BACKSPACE) {
      e.preventDefault();
    }
  }

  const onClickSurpriseMe = () => {
    onBegin(Word.generateRandomWord());
  }

  const isInputWordValidSize = () => {
    return inputWord.length >= 4 && inputWord.length <= 7;
  }

  const isInputWordValidWord = () => {
    return Word.isInWordList(inputWord);
  }

  return (
    <>
      <p className="text" style={{ marginBottom: '0' }}>Enter a word to begin</p>
      <p style={{ color: '#b2bec3', margin: '0.2em' }}>(4 to 7 characters)</p>
      <input 
        type="text"
        maxLength={7}
        className="wordle-input"
        value={inputWord} 
        onChange={ event => setInputWord(event.target.value) }
        onKeyDown={onInputKeyPress}
      />
      <div className="menu-buttons">
        <button disabled={!isInputWordValidSize()} onClick={() => onBegin(inputWord)}>Begin</button>
        <button onClick={() => onClickSurpriseMe()}>Surprise Me</button>
      </div>
    </>
  );
}