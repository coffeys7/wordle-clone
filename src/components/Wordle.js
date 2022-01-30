import React from 'react';
import Word from '@utilities/Word';
import { get, isNil, includes } from 'lodash'
import success from '@images/success.gif';
import fail from '@images/fail.gif';
class Wordle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputWord: '',
      isStarted: false,
      isCompleted: false,
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
    this.onPressBackspace = this.onPressBackspace.bind(this);
    this.onPressEnter = this.onPressEnter.bind(this);
    this.onPressLetter = this.onPressLetter.bind(this);
    this.checkCompletion = this.checkCompletion.bind(this);
    this.isCurrentWordCorrect = this.isCurrentWordCorrect.bind(this);
    this.onInputKeyPress = this.onInputKeyPress.bind(this);
  }

  onClickRestart() {
    this.setState({
      isStarted: false,
      isCompleted: false,
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

  onPressBackspace() {
    if (this.state.currentWord.length > 0) {
      this.setCurrentWord(this.state.currentWord.slice(0, -1));
      this.updateWords();
    }
  }

  isCurrentWordCorrect() {
    return this.state.currentWord === this.state.inputWord;
  }

  checkCompletion() {
    return this.isCurrentWordCorrect() || 
      (this.state.words.length === 6 && this.isCurrentWordFull());
  }

  onPressEnter() {
    this.incrementCurrentWordCount();

    if (this.checkCompletion()) {
      this.setState({
        isCompleted: true
      });
    } else {
      this.setCurrentWord('');
    }
  }

  onPressLetter(letter) {
    this.setCurrentWord(`${this.state.currentWord}${letter}`);
    this.updateWords();
  }

  onKeyPress(e) {
    if (!this.state.isStarted) return;
    if (this.state.isCompleted) return;
    
    if (e.keyCode === this.keyCode('BACKSPACE'))
      this.onPressBackspace();

    if (this.isCurrentWordFull()) {
      if (e.keyCode === this.keyCode('ENTER'))
        this.onPressEnter();
    } else {
      if (Word.isInAlphabet(e.key))
        this.onPressLetter(e.key);
    }
  }

  onInputKeyPress(e) {
    if (e.keyCode === this.keyCode('ENTER')) 
      this.onClickBegin();
  }

  classNameForBox(i, j) {
    let currentLetter = get(this.state.words, `[${i}][${j}]`, null);
    if (isNil(currentLetter)) return 'empty';

    if (includes(this.state.inputWord, currentLetter)) {
      if (this.state.inputWord[j] === currentLetter) {
        return 'exact';
      } else {
        return 'in-word';
      }
    } else {
      return 'missing';
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
                    {(this.state.words[i] || [])[j] || 'x'}
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
            <p className="text">Enter a word to begin</p>
            <input 
              type="text"
              className="wordle-input"
              value={this.state.inputWord} 
              onChange={ event => this.setInputWord(event.target.value) }
              onKeyDown={this.onInputKeyPress}
            />
            <div className="menu-buttons">
              <button onClick={this.onClickBegin}>Begin</button>
              <button onClick={this.onClickSurpriseMe}>Surprise Me</button>
            </div>
          </>
        )}
        {this.state.isStarted && (
          <div>
            <p>
              <a href="#!" onClick={this.onClickRestart}>Restart</a>
            </p>
            <div className="wordle-grid">
              {this.createGrid()}
            </div>
            <>
              {this.state.isCompleted && (
                <div className="summary">
                  {this.isCurrentWordCorrect() && (
                    <>
                      <p className="text">Woot!</p>
                      <p>
                       <img src={success} alt="Success" width="300" />
                      </p>
                      <button onClick={this.onClickRestart}>Play Again</button>
                    </>
                  )}
                  {!this.isCurrentWordCorrect() && (
                    <>
                      <p className="text">Uh oh! You suck!</p>
                      <p>
                       <img src={fail} alt="Fail" width="300" />
                      </p>
                      <p className="text">The word was <strong style={{ textTransform: 'uppercase' }}>{this.state.inputWord}</strong></p>
                      <button onClick={this.onClickRestart}>Play Again</button>
                    </>
                  )}
                </div>
              )}
            </>
          </div>
        )}
      </div>
    );
  }
}

export default Wordle;