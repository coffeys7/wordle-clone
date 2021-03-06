import { includes, get, isNil } from 'lodash';

export default function VirtualKeyboard(props) {
  const keys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['⏎', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫']
  ];

  const onKey = (key) => {
    let keyName = key;
    if (key === '⏎') keyName = 'enter';
    else if (key === '⌫') keyName = 'backspace';

    props.onKey(keyName);
  }

  const isSpecialKey = (key) => {
    return includes(['⌫', '⏎'], key);
  }

  const classNameForKey = (key) => {
    if (isSpecialKey(key)) return 'special';

    let indicator = get(props, `usageMap[${key}]`);

    if (!isNil(indicator)) {
      return indicator;
    }

    return '';
  }

  const createKeyboard = () => {
    return keys.map((row, i) => {
      return (
        <div className="keyboard-row" key={`kb-row-${i}`}>
          {
            row.map((key, j) => {
              return (
                <div className={`keyboard-key ${classNameForKey(key)}`} key={`kb-key-${j}`} onClick={() => onKey(key)}>
                  {key}
                </div>
              );
            })
          }
        </div>
      )
    });
  }

  return (
    <div className="virtual-keyboard">
      {
        createKeyboard()
      }
    </div>
  );
};