import React, { useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import styles from './FormComponents.module.scss';
import PropTypes from 'prop-types';

//Select w/ Color Options
export const SelectColorItem = (props) => {
  const [hoverEffect, setHoverEffect] = useState({});

  const onOver = () => {
    setHoverEffect({ backgroundColor: props.colorCode || '#FAFAFA' });
  };

  const onLeave = () => {
    setHoverEffect({});
  };

  return (
    <span
      className={styles.selector_item}
      style={hoverEffect}
      onMouseOver={onOver}
      onMouseLeave={onLeave}
      onClick={() => props.onSelect(props.colorName)}
    >
      {props.colorName}
    </span>
  );
};

export const SelectColor = (props) => {
  const ref = useRef();
  const [selected, setSelected] = useState(props.placeholder);
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);

  const changeSelected = (name) => {
    setSelected(name);
    props.onChange(name);
    setOptionsAsVisible(false);
  };

  const setOptionsAsVisible = (visible) => {
    if (visible !== areOptionsVisible) {
      setAreOptionsVisible(visible);
    }
  };

  const toItemArray = (obj) => {
    let array = [
      <SelectColorItem
        key={props.placeholder}
        onSelect={() => changeSelected(props.placeholder)}
        colorName={props.placeholder}
      />,
    ];
    for (const key in obj) {
      array.push(
        <SelectColorItem
          key={key}
          onSelect={() => changeSelected(key)}
          colorName={key}
          colorCode={obj[key]}
        />
      );
    }
    return array;
  };

  useClickOutside(ref, () => setOptionsAsVisible(false));

  return (
    <div
      ref={ref}
      className={[styles.select, props.className].join(' ')}
      onClick={() => setOptionsAsVisible(true)}
      onMouseLeave={() => setOptionsAsVisible(false)}
    >
      <span className={styles.selected}>{selected}</span>
      <div
        className={[
          styles.options,
          areOptionsVisible ? styles.options_visible : styles.options_invisible,
        ].join(' ')}
      >
        {toItemArray(props.colors)}
      </div>
    </div>
  );
};

//Select w/ Text options
export const SelectTextItem = (props) => {
  const [hoverEffect, setHoverEffect] = useState({});

  const onOver = () => {
    setHoverEffect({ backgroundColor: '#e7e7e7' });
  };

  const onLeave = () => {
    setHoverEffect({});
  };

  return (
    <span
      className={styles.selector_item}
      style={hoverEffect}
      onMouseOver={onOver}
      onMouseLeave={onLeave}
      onClick={() => props.onSelect(props.optionName, props.optionValue)}
    >
      {props.optionValue}
    </span>
  );
};

export const SelectText = (props) => {
  const ref = useRef();
  const [selected, setSelected] = useState(props.placeholder);
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);

  const changeSelected = (name, value) => {
    setOptionsAsVisible(false);
    setSelected(name);
    props.onChange(value);
  };

  const setOptionsAsVisible = (visible) => {
    if (visible !== areOptionsVisible) {
      setAreOptionsVisible(visible);
    }
  };

  const toItemArray = (obj) => {
    let array = [
      <SelectTextItem
        key={props.placeholder}
        onSelect={() => changeSelected(props.placeholder, props.placeholder)}
        optionName={'0'}
        optionValue={props.placeholder}
      />,
    ];
    for (const key in obj) {
      array.push(
        <SelectTextItem
          key={key}
          onSelect={() => changeSelected(obj[key], key)}
          optionName={key}
          optionValue={obj[key]}
        />
      );
    }
    return array;
  };

  useClickOutside(ref, () => setOptionsAsVisible(false));

  return (
    <div
      ref={ref}
      className={[styles.select, props.className].join(' ')}
      onClick={() => setOptionsAsVisible(true)}
      onTouchMove={() => setOptionsAsVisible(true)}
      onMouseLeave={() => setOptionsAsVisible(false)}
    >
      <span className={styles.selected}>{selected}</span>
      {areOptionsVisible && (
        <span className={[styles.options, styles.options_visible].join(' ')}>
          {toItemArray(props.options)}
        </span>
      )}
    </div>
  );
};

const setMask = (m, t) => {
  /* Rules:
      * - any character
      A - only text
      9 - only numbers
  */
  const mask = new String(m.trim());
  const text = t.trim();
  let finalText = '';
  let i_text = 0;

  for (let i = 0; i < [...mask].length; i++) {
    let char;
    switch (mask[i].toLowerCase()) {
      case '*':
        if (!!text[i_text]) {
          char = text[i_text];
          i_text++;
          break;
        }
        char = ' ';
        break;
      case 'a':
        if (!!text[i_text] && /[a-zA-Z]/.test[i_text]) {
          char = text[i_text];
          i_text++;
          break;
        }
        char = ' ';
        break;
      case '9':
        if (!!text[i_text] && /[0-9]/.test[i_text]) {
          char = text[i_text];
          i_text++;
          break;
        }
        char = ' ';
        break;
      default:
        char = mask[i];
        break;
    }
    finalText = finalText.concat(char);
  }

  return finalText;
};

export const Input = ({ className, valid, validationMessage, mask, value, onChange, ...rest }) => {
  const validate = valid != null ? valid : true;

  let onChangeValue;

  if (!!onChange && !!mask) {
    onChangeValue = (event) => {
      event.target.value = setMask(mask, event.target.value);
      onChange(event);
    }
  } else {
    onChangeValue = onChange;
  }

  return (
    <span className={styles.inputLine}>
      <input
        className={[
          styles.inputText,
          className || '',
          !validate && styles.inputText_invalid,
        ].join(' ')}
        onChange={onChangeValue}
        {...rest}
        value={value}
      />
      <span className={styles.validationMessage}>
        {validate || (validationMessage ? validationMessage : 'Campo inválido')}
      </span>
    </span>
  );
};

Input.propTypes = {
  className: PropTypes.string,
  valid: PropTypes.bool,
  validationMessage: PropTypes.string,
};

export const Textarea = ({ className, valid, validationMessage, ...rest }) => {
  const validate = valid != null ? valid : true;
  return (
    <span className={styles.inputLine}>
      <textarea
        className={[
          styles.inputText,
          className || '',
          !validate && styles.inputText_invalid,
        ].join(' ')}
        {...rest}
      />
      <span className={styles.validationMessage}>
        {validate || (validationMessage ? validationMessage : 'Campo inválido')}
      </span>
    </span>
  );
};

Textarea.propTypes = {
  className: PropTypes.string,
  valid: PropTypes.bool,
  validationMessage: PropTypes.string,
};
