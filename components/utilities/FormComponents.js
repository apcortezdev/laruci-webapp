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

export const Input = (props) => {
  const [isValid, setIsValid] = useState(true);
  const setValidation = () => {
    if (props.required && !props.refs.current.value.trim()) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  return (
    <span className={styles.inputLine}>
      <input
        ref={props.refs}
        className={[
          styles.inputText,
          props.className || '',
          !isValid && styles.inputText_invalid,
        ].join(' ')}
        id={props.id || ''}
        type="text"
        placeholder={props.placeholder || ''}
        onBlur={setValidation}
      />
      <span className={styles.validationMessage}>
        {!isValid
          ? props.validationMessage
            ? props.validationMessage
            : props.type === 'email'
            ? 'Digite um e-mail válido'
            : 'Digite um valor válido'
          : ' '}
      </span>
    </span>
  );
};

Input.propTypes = {
  refs: PropTypes.object,
  className: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  validationMessage: PropTypes.string,
};

export const Textarea = (props) => {
  const [isValid, setIsValid] = useState(true);
  const setValidation = () => {
    if (props.required && !props.refs.current.value.trim()) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };
  return (
    <span className={styles.inputLine}>
      <textarea
        ref={props.refs}
        className={[
          styles.inputText,
          props.className || '',
          !isValid && styles.inputText_invalid,
        ].join(' ')}
        id={props.id || ''}
        rows={props.rows || ''}
        cols={props.cols || ''}
        placeholder={props.placeholder || ''}
        required={props.required || false}
        onBlur={setValidation}
      />
      <span className={styles.validationMessage}>
        {!isValid
          ? props.validationMessage
            ? props.validationMessage
            : props.type === 'email'
            ? 'Digite um e-mail válido'
            : 'Digite um valor válido'
          : ' '}
      </span>
    </span>
  );
};

Textarea.propTypes = {
  refs: PropTypes.object,
  className: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.string,
  cols: PropTypes.string,
  required: PropTypes.bool,
  validationMessage: PropTypes.string,
};
