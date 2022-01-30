import success from '@images/success.gif';
import fail from '@images/fail.gif';

export default function Summary({ isSuccess, inputWord, onRestart }) {
  return (
    <div className="summary">
      {isSuccess && (
        <>
          <p className="text">Woot!</p>
          <p>
            <img src={success} alt="Success" width="300" />
          </p>
          <button onClick={onRestart}>Play Again</button>
        </>
      )}
      {!isSuccess && (
        <>
          <p className="text">Uh oh! You suck!</p>
          <p>
            <img src={fail} alt="Fail" width="300" />
          </p>
          <p className="text">
            The word was <strong style={{ textTransform: 'uppercase' }}>{inputWord}</strong>
          </p>
          <button onClick={onRestart}>Play Again</button>
        </>
      )}
    </div>
  );
}