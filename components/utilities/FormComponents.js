import React, { useReducer, useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import styles from './FormComponents.module.scss';
import PropTypes from 'prop-types';

//Select w/ Color Options
const SelectColorItem = (props) => {
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
const SelectTextItem = (props) => {
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

//Input type text
const masker = (text, mask) => {
  /* Rules:
      S - text and numbers
      A - only text
      9 - only numbers
  */
  const arrayText = new String(text);
  const arrayMask = new String(mask.toLowerCase());
  let finalText = '';
  let i_mask = 0;

  if (arrayText.length > 0) {
    if (arrayMask.length > 0) {
      for (let i_text = 0; i_text < [...arrayText].length; i_text++) {
        if (arrayMask.length === i_mask) {
          break;
        }
        while (
          arrayMask[i_mask] !== 's' &&
          arrayMask[i_mask] !== 'a' &&
          arrayMask[i_mask] !== '9'
        ) {
          finalText = finalText.concat(arrayMask[i_mask]);
          i_mask++;
        }

        switch (arrayMask[i_mask]) {
          case 's':
            if (/[a-z0-9]/i.test(arrayText[i_text])) {
              finalText = finalText.concat(arrayText[i_text]);
              break;
            }
            return finalText;
          case 'a':
            if (/[a-zA-Z]/.test(arrayText[i_text])) {
              finalText = finalText.concat(arrayText[i_text]);
              break;
            }
            return finalText;
          case '9':
            if (/[0-9]/.test(arrayText[i_text])) {
              finalText = finalText.concat(arrayText[i_text]);
              break;
            }
            return finalText;
          default:
            return finalText;
        }
        i_mask++;
      }
    } else {
      return text;
    }
  }

  return finalText;
};

const unmasker = (text) => {
  return text.replace(/[^a-z0-9]/gi, '');
};

const maskReducer = (state, action) => {
  const newActiveMask = !!state.masks
    ? state.masks.find((m) => action.value.length <= unmasker(m).length)
    : false;
  return {
    masks: state.masks,
    activeMask: newActiveMask,
    maskedValue: !!newActiveMask
      ? masker(action.value, newActiveMask)
      : action.value,
  };
};

export const Input = ({
  className,
  valid,
  validationMessage,
  mask,
  value,
  onChange,
  ...rest
}) => {
  const validate = valid != null ? valid : true;

  const [maskState, dispatchMask] = useReducer(maskReducer, {
    masks: !!mask
      ? mask.sort((a, b) => unmasker(a).length - unmasker(b).length)
      : false,
    activeMask: !!mask
      ? value
        ? mask.find((m) => value.length <= unmasker(m).length)
        : mask[0]
      : false,
    maskedValue: value
      ? !!mask
        ? masker(
            value,
            !!mask
              ? value
                ? mask.find((m) => value.length <= unmasker(m).length)
                : mask[0]
              : false
          )
        : value
      : '',
  });

  const onChangeValue = (event) => {
    dispatchMask({ value: event.target.value });
    if (!!onChange) {
      if (maskState.activeMask) {
        const e = {
          ...event,
          target: {
            ...event.target,
            value: unmasker(event.target.value),
          },
        };
        onChange(e);
      } else {
        onChange(event);
      }
    }
  };

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
        maxLength={maskState.activeMask ? maskState.activeMask.length : ''}
        value={maskState.maskedValue}
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

//Textarea
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
