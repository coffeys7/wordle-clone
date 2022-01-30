export default function Cell(props) {
  return (
    <div className={`wordle-letter-box ${props.className}`}>
      <div className="box-container">
        {props.children}
      </div>
    </div>
  );
};