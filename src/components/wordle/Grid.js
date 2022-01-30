export default function Grid(props) {
  return (
    <div className={`wordle-grid ${props.className}`}>
      {props.children}
    </div>
  );
};