import { sample, random, toString, includes } from 'lodash';
import words from '@data/words';

const generateRandomWord = () => {
  let wordSize = random(4, 6);
  return sample(words[toString(wordSize)])
};

const alphabet = () => {
  return 'abcdefghijklmnopqrstuvwxyz';
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
