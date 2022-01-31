import { useState } from 'react';
import Word from '@utilities/Word';
import KeyCodes from '@utilities/KeyCodes';

export default function Menu(props) {
  const [inputWord, setInputWord] = useState('');

  const onBegin = (word) => {
    console.log('onBegin', 'inputWord', word);
    props.onBegin(word);
  }

  const onInputKeyPress = (e) => {
    if (e.keyCode === KeyCodes.ENTER) {
      onBegin(e.target.value);
    }
  }

  const onClickSurpriseMe = () => {
    onBegin(Word.generateRandomWord());
  }

  return (
    <>
      <p className="text">Enter a word to begin</p>
      <input 
        type="text"
        className="wordle-input"
        value={inputWord} 
        onChange={ event => setInputWord(event.target.value) }
        onKeyDown={onInputKeyPress}
      />
      <div className="menu-buttons">
        <button disabled={inputWord.length < 4} onClick={() => onBegin(inputWord)}>Begin</button>
        <button onClick={() => onClickSurpriseMe()}>Surprise Me</button>
      </div>
    </>
  );
}