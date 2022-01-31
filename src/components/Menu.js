import { useState } from 'react';
import Word from '@utilities/Word';
import KeyCodes from '@utilities/KeyCodes';

export default function Menu(props) {
  const [inputWord, setInputWord] = useState('');

  const onBegin = (word) => {
    if (!isInputWordValidWord(word)) {
      alert('Not a valid word');
      return;
    }
    if (isInputWordValidSize(word)) 
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

  const isInputWordValidSize = (word) => {
    return word.length >= 4 && word.length <= 7;
  }

  const isInputWordValidWord = (word) => {
    return Word.isInWordList(word);
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
        <button disabled={!isInputWordValidSize(inputWord)} onClick={() => onBegin(inputWord)}>Begin</button>
        <button onClick={() => onClickSurpriseMe()}>Surprise Me</button>
      </div>
    </>
  );
}