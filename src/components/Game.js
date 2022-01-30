import React from 'react';
import Word from '@utilities/Word';
import Wordle from '@components/wordle/Wordle';
import Summary from '@components/Summary';
import { get, isNil } from 'lodash'
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputWord: '',
      isStarted: false,
      isCompleted: false,
      currentWordCount: 0,
      words: [],
      currentWord: '',
      currentWordInvalid: false
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
    this.checkWordValidity = this.checkWordValidity.bind(this);
    this.classNameForRow = this.classNameForRow.bind(this);
  }

  onClickRestart() {
    this.setState({
      isStarted: false,
      isCompleted: false,
      inputWord: '',
      currentWordCount: 0,
      words: [],
      currentWord: '',
      currentWordInvalid: false
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

  checkWordValidity() {
    let isValid = Word.isInWordList(this.state.currentWord);
    this.setState({
      currentWordInvalid: !isValid
    });

    return isValid;
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
      this.setState({ currentWordInvalid: false });
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
    if (!this.checkWordValidity()) return;

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

    let pattern = new RegExp(currentLetter, 'g');
    let occurrencesInInputWord = (this.state.inputWord.match(pattern) || []).length;
    let substring = this.state.words[i].substring(0, j + 1);
    
    let occurrencesInSubstring = (substring.match(pattern) || []).length;

    if (occurrencesInInputWord > 0) {
      if (this.state.inputWord[j] === currentLetter) {
        return 'exact';
      } else {
        if (occurrencesInSubstring > 1) {
          if (occurrencesInSubstring <= occurrencesInInputWord) {
            return 'in-word';
          } else {
            return 'missing';
          }
        } else { 
          return 'in-word';
        }
      }
    } else {
      return 'missing';
    }
  }

  classNameForRow(i) {
    if (this.state.currentWordCount > i) {
      return 'submitted';
    } else if (this.state.currentWordCount === i) {
      if (this.state.currentWordInvalid) {
        return 'invalid';
      }
    }
    return '';
  }

  createGrid() {
    return Array(6).fill(null).map((_, i) => {
      return (
        <Wordle.Row className={this.classNameForRow(i)} key={`row-${i}`}>
          {
            Array(this.getWordSize()).fill(null).map((_, j) => {
              return (
                <Wordle.Cell className={this.classNameForBox(i, j)} key={`box-${j}`}>
                  {get(this.state.words, `[${i}][${j}]`, 'x')}
                </Wordle.Cell>
              );
            })
          }
        </Wordle.Row>
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
            <Wordle.Grid>
              {this.createGrid()}
            </Wordle.Grid>
            <>
              {this.state.isCompleted && (
                <Summary
                  isSuccess={this.isCurrentWordCorrect()}
                  inputWord={this.state.inputWord}
                  onRestart={this.onClickRestart}
                />
              )}
            </>
          </div>
        )}
      </div>
    );
  }
}

export default Game;