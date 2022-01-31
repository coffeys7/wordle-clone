export default function Row(props) {
  return (
    <div className={`wordle-grid-row ${props.className}`}>
      {props.children}
    </div>
  );
};