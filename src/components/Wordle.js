import React from 'react';
import Word from '@utilities/Word';
import { get, isNil } from 'lodash'
class Wordle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputWord: '',
      isStarted: false,
      currentWordCount: 0,
      words: [],
      currentWord: '',
    };

    this.onClickBegin = this.onClickBegin.bind(this);
    this.setCurrentWord = this.setCurrentWord.bind(this);
    this.getWordSize = this.getWordSize.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.createGrid = this.createGrid.bind(this);
    this.setInputWord = this.setInputWord.bind(this);
    this.incrementCurrentWordCount = this.incrementCurrentWordCount.bind(this);
    this.updateWords = this.updateWords.bind(this);
    this.isCurrentWordFull = this.isCurrentWordFull.bind(this);
    this.onClickSurpriseMe = this.onClickSurpriseMe.bind(this);
    this.onClickRestart = this.onClickRestart.bind(this);
  }

  onClickRestart() {
    this.setState({
      isStarted: false,
      inputWord: '',
      currentWordCount: 0,
      words: [],
      currentWord: ''
    })
  }

  onClickBegin() {
    this.setState({
      isStarted: true
    });
  }

  setCurrentWord(newWord) {
    this.setState({
      currentWord: newWord
    });
  }

  onClickSurpriseMe() {
    this.setState({
      inputWord: Word.generateRandomWord(),
      isStarted: true
    });
  }

  incrementCurrentWordCount() {
    this.setState({
      currentWordCount: this.state.currentWordCount + 1
    });
  }

  updateWords() {
    let words = this.state.words;
    words[this.state.currentWordCount] = this.state.currentWord;
    this.setState({
      words: words
    });
  }

  setInputWord(word) {
    this.setState({
      inputWord: word
    });
  }

  keyCode(keyCode) {
    return {
      ENTER: 13,
      BACKSPACE: 8,
    }[keyCode];
  }

  getWordSize() {
    return this.state.inputWord.length;
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyPress);
  }

  isCurrentWordFull() {
    return this.state.currentWord.length === this.getWordSize();
  }

  onKeyPress(e) {
    if (!this.state.isStarted) return;
    
    if (e.keyCode === this.keyCode('BACKSPACE')) {
      if (this.state.currentWord.length > 0) {
        this.setCurrentWord(this.state.currentWord.slice(0, -1));
        this.updateWords();
        return;
      }
    }

    if (this.isCurrentWordFull()) {
      if (e.keyCode === this.keyCode('ENTER')) {
        this.incrementCurrentWordCount();
        this.setCurrentWord('');
      }
    } else {
      if (Word.isInAlphabet(e.key)) {
        this.setCurrentWord(`${this.state.currentWord}${e.key}`);
        this.updateWords();
      }
    }
  }

  classNameForBox(i, j) {
    if (this.state.currentWordCount <= i) return '';

    let currentLetter = get(this.state.words, `[${i}][${j}]`, null);
    if (isNil(currentLetter)) {
      return '';
    } else {
      let indexInWord = this.state.inputWord.indexOf(currentLetter);
      if (indexInWord > -1) return (indexInWord === j) ? 'exact' : 'in-word';
      else return 'missing';
    }
  }

  createGrid() {
    return Array(6).fill(null).map((_, i) => {
      return (
        <div className={`wordle-grid-row ${this.state.currentWordCount > i ? 'submitted' : ''}`} key={`row-${i}`}>
          {
            Array(this.getWordSize()).fill(null).map((_, j) => {
              return (
                <div className={`wordle-letter-box ${this.classNameForBox(i, j)}`} key={`box-${j}`}>
                  <div className="box-container">
                    {(this.state.words[i] || [])[j] || ''}
                  </div>
                </div>
              );
            })
          }
        </div>
      );
    });
  }

  render() {
    return (
      <div className="Wordle">
        {!this.state.isStarted && (
          <>
            <p>Enter a word to begin</p>
            <input 
              type="text"
              className="wordle-input"
              value={this.state.inputWord} 
              onChange={ event => this.setInputWord(event.target.value) } 
            />
            <div className="menu-buttons">
              <button onClick={this.onClickBegin}>Begin</button>
              <button onClick={this.onClickSurpriseMe}>Surprise Me</button>
            </div>
          </>
        )}
        {this.state.isStarted && (
          <div>
            <p style={{marginBottom: '1rem'}}>We have begun</p>
            <a href="#!" onClick={this.onClickRestart}>Restart</a>
            <div className="wordle-grid">
              {this.createGrid()}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Wordle;