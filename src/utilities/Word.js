import { sample, toString, includes } from 'lodash';
import words from '@data/words';

const generateRandomWord = () => {
  return sample(words['5'])
};

const alphabet = () => {
  return 'abcdefghijklmnopqrstuvwxyz'.split('');
};

const isInAlphabet = (letter) => {
  return includes(alphabet(), letter);
};

const isInWordList = (word) => {
  return includes(words[toString(word.length)], word);
};

const exports =  {
  generateRandomWord,
  alphabet,
  isInAlphabet,
  isInWordList
};

export default exports;
