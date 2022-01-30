import { sample, random, toString, includes } from 'lodash';
import words from '@data/words';

const generateRandomWord = () => {
  let wordSize = random(4, 9);
  return sample(words[toString(wordSize)])
};

const alphabet = () => {
  return 'abcdefghijklmnopqrstuvwxyz';
};

const isInAlphabet = (letter) => {
  return includes(alphabet(), letter);
};

const exports =  {
  generateRandomWord,
  alphabet,
  isInAlphabet
};

export default exports;
