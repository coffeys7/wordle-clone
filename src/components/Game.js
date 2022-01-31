import React from 'react';
import Word from '@utilities/Word';
import KeyCodes from '@utilities/KeyCodes';
import Wordle from '@components/wordle/Wordle';
import Summary from '@components/Summary';
import Menu from '@components/Menu';
import VirtualKeyboard from '@components/VirtualKeyboard';
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

    this.onBegin = this.onBegin.bind(this);
    this.setCurrentWord = this.setCurrentWord.bind(this);
    this.getWordSize = this.getWordSize.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.createGrid = this.createGrid.bind(this);
    this.incrementCurrentWordCount = this.incrementCurrentWordCount.bind(this);
    this.updateWords = this.updateWords.bind(this);
    this.isCurrentWordFull = this.isCurrentWordFull.bind(this);
    this.onClickRestart = this.onClickRestart.bind(this);
    this.onPressBackspace = this.onPressBackspace.bind(this);
    this.onPressEnter = this.onPressEnter.bind(this);
    this.onPressLetter = this.onPressLetter.bind(this);
    this.checkCompletion = this.checkCompletion.bind(this);
    this.isCurrentWordCorrect = this.isCurrentWordCorrect.bind(this);
    this.checkWordValidity = this.checkWordValidity.bind(this);
    this.classNameForRow = this.classNameForRow.bind(this);
    this.onVirtualKeyboardKeyPress = this.onVirtualKeyboardKeyPress.bind(this);
    this.handleValidKeyPress = this.handleValidKeyPress.bind(this);
  }

  onClickRestart() {
    this.setState({
      inputWord: '',
      isStarted: false,
      isCompleted: false,
      currentWordCount: 0,
      words: [],
      currentWord: '',
      currentWordInvalid: false
    })
  }

  onBegin(inputWord) {
    this.setState({
      isStarted: true,
      inputWord: inputWord
    });
  }

  setCurrentWord(newWord) {
    this.setState({
      currentWord: newWord
    });
  }

  incrementCurrentWordCount() {
    this.setState({
      currentWordCount: this.state.currentWordCount + 1
    });
  }

  updateWords(newCurrentWord) {
    let words = this.state.words;
    words[this.state.currentWordCount] = newCurrentWord;
    this.setState({
      words: words
    });
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
      let newCurrentWord = this.state.currentWord.slice(0, -1); 
      this.setCurrentWord(newCurrentWord);
      this.updateWords(newCurrentWord);
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
    let newCurrentWord = `${this.state.currentWord}${letter}`; 
    this.setCurrentWord(newCurrentWord);
    this.updateWords(newCurrentWord);
  }

  handleValidKeyPress(key) {    
    if (key === 'backspace') {
      this.onPressBackspace();
    } else if (this.isCurrentWordFull()) {
      if (key === 'enter')
        this.onPressEnter();
    } else {
      if (Word.isInAlphabet(key))
        this.onPressLetter(key);
    }
  }

  onVirtualKeyboardKeyPress(key) {
    this.handleValidKeyPress(key);
  }

  onKeyPress(e) {
    if (!this.state.isStarted) return;
    if (this.state.isCompleted) return;

    if (e.keyCode === KeyCodes.BACKSPACE) {
      this.handleValidKeyPress('backspace');
    } else if (e.keyCode === KeyCodes.ENTER) {
      this.handleValidKeyPress('enter');
    } else {
      this.handleValidKeyPress(e.key);
    } 
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
          <Menu 
            onBegin={this.onBegin}
          />
        )}
        {this.state.isStarted && (
          <div>
            <p>
              <a href="#!" onClick={this.onClickRestart}>Restart</a>
            </p>
            <Wordle.Grid>
              {this.createGrid()}
            </Wordle.Grid>
            {!this.state.isCompleted && (
              <VirtualKeyboard onKey={this.onVirtualKeyboardKeyPress} />
            )}
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