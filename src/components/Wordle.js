import React from 'react';

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
    this.getLetters = this.getLetters.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.createGrid = this.createGrid.bind(this);
    this.setInputWord = this.setInputWord.bind(this);
    this.incrementCurrentWordCount = this.incrementCurrentWordCount.bind(this);
    this.updateWords = this.updateWords.bind(this);
    this.isCurrentWordFull = this.isCurrentWordFull.bind(this);
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

  getLetters() {
    return 'abcdefghijklmnopqrstuvwxyz';
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
      if (this.getLetters().indexOf(e.key) > -1) {
        this.setCurrentWord(`${this.state.currentWord}${e.key}`);
        this.updateWords();
      }
    }
  }

  classNameForBox(i, j) {
    if (this.state.currentWordCount <= i) {
      return '';
    } else {
      let word = this.state.words[i];
      let letter = word[j];
      if (letter === undefined || letter === null) {
        return '';
      } else {
        let index = this.state.inputWord.indexOf(letter);
        if (index > -1) {
          return (index === j) ? 'exact' : 'in-word';
        } else {
          return 'missing';
        }
      }
    }
  }

  createGrid() {
    console.log('Creating or re-creating grid...');
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
            <button onClick={this.onClickBegin} style={{display: 'block', margin: '0 auto'}}>Begin</button>
          </>
        )}
        {this.state.isStarted && (
          <div>
            <p style={{marginBottom: '1rem'}}>We have begun</p>
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