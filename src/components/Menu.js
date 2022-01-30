import { useState } from 'react';
import Word from '@utilities/Word';
import KeyCodes from '@utilities/KeyCodes';

export default function Menu(props) {
  const [inputWord, setInputWord] = useState('');

  const onBegin = () => {
    props.onBegin(inputWord);
  }

  const onInputKeyPress = (e) => {
    if (e.keyCode === KeyCodes.ENTER) {
      setInputWord(e.target.value);
      onBegin()
    }
  }

  const onClickSurpriseMe = () => {
    setInputWord(Word.generateRandomWord());
    onBegin();
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
        <button onClick={onBegin}>Begin</button>
        <button onClick={onClickSurpriseMe}>Surprise Me</button>
      </div>
    </>
  );
}