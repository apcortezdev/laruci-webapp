import React, { useEffect, useReducer, useRef, useState } from 'react';
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
      className={[styles.select, props.className].join(' ').trim()}
      onClick={() => setOptionsAsVisible(true)}
      onMouseLeave={() => setOptionsAsVisible(false)}
    >
      <span className={styles.selected}>{selected}</span>
      <div
        className={[
          styles.options,
          areOptionsVisible ? styles.options_visible : styles.options_invisible,
        ].join(' ').trim()}
      >
        {toItemArray(props.colors)}
      </div>
    </div>
  );
};

SelectColor.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  colors: PropTypes.array,
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
      className={[styles.select, props.className].join(' ').trim()}
      onClick={() => setOptionsAsVisible(true)}
      onTouchMove={() => setOptionsAsVisible(true)}
      onMouseLeave={() => setOptionsAsVisible(false)}
    >
      <span className={styles.selected}>{selected}</span>
      {areOptionsVisible && (
        <span className={[styles.options, styles.options_visible].join(' ').trim()}>
          {toItemArray(props.options)}
        </span>
      )}
    </div>
  );
};

SelectText.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  options: PropTypes.array,
};

//Input type text w/ MASK
export const unmasker = (text) => {
  // Remove mask from text
  return text.replace(/[^a-z0-9]/gi, '');
};

const asUnmasked = (text) => {
  // Returns the unmasked template for the text
  // e.g: FT-4566 to AA9999
  return text.replace(/[a-z]/gi, 'A').replace(/[0-9]/gi, '9');
};

export const masker = (text, mask) => {
  // Mask the text acording to the mask parameter
  /* Rules:
      S - text and numbers
      A - only text
      9 - only numbers
  */
  const maskedText = text;
  const maskToUse = mask.toLowerCase();
  let finalText = '';
  let i_mask = 0;

  if (maskedText.length > 0) {
    if (maskToUse.length > 0) {
      for (
        let i_text = 0;
        i_text < maskedText.length && i_text < unmasker(maskToUse).length;
        i_text++
      ) {
        if (i_mask >= maskToUse.length) {
          break;
        }
        while (
          maskToUse[i_mask] !== 's' &&
          maskToUse[i_mask] !== 'a' &&
          maskToUse[i_mask] !== '9' &&
          i_mask < maskToUse.length
        ) {
          finalText = finalText.concat(maskToUse[i_mask]);
          i_mask++;
        }

        switch (maskToUse[i_mask]) {
          case 's':
            if (/[a-z0-9]/i.test(maskedText[i_text])) {
              finalText = finalText.concat(maskedText[i_text]);
              break;
            }
            return finalText;
          case 'a':
            if (/[a-zA-Z]/.test(maskedText[i_text])) {
              finalText = finalText.concat(maskedText[i_text]);
              break;
            }
            return finalText;
          case '9':
            if (/[0-9]/.test(maskedText[i_text])) {
              finalText = finalText.concat(maskedText[i_text]);
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

const maskReducer = (state, action) => {
  if (action.type === 'INITIAL') {
    const sortedMasks = !!action.masks
      ? action.masks.sort((a, b) => unmasker(a).length - unmasker(b).length)
      : false;

    // Set mask by pattern
    let activeMask = !!sortedMasks
      ? sortedMasks.find((m) =>
          unmasker(m).startsWith(asUnmasked(action.value))
        )
      : false;
    activeMask = typeof activeMask === 'undefined' ? false : activeMask;

    const maskedValue = action.value
      ? !!activeMask
        ? masker(action.value, activeMask)
        : action.value
      : '';

    const longerLength = !!sortedMasks
      ? sortedMasks[sortedMasks.length - 1].length
      : '';
    return {
      masks: sortedMasks,
      activeMask: activeMask,
      maskedValue: maskedValue,
      length: longerLength,
    };
  } else {
    const unmasked = unmasker(action.value);
    let newActiveMask = !!state.masks
      ? state.masks.find((m) => unmasker(m).startsWith(asUnmasked(unmasked)))
      : false;

    newActiveMask =
      typeof newActiveMask === 'undefined' ? state.activeMask : newActiveMask;

    const newMaskedValue = !!newActiveMask
      ? masker(unmasked, newActiveMask)
      : action.value;

    return {
      masks: state.masks,
      activeMask: newActiveMask,
      maskedValue: newMaskedValue,
      length: state.length,
    };
  }
};

export const Input = ({
  className,
  valid,
  validationMessage,
  mask,
  value,
  onChange,
  id,
  onBlur,
  ...rest
}) => {
  const isValid = valid != null ? valid : true;

  const [maskState, dispatchMask] = useReducer(maskReducer, {
    masks: false,
    activeMask: false,
    maskedValue: '',
  });

  useEffect(() => {
    dispatchMask({ type: 'INITIAL', masks: mask, value: value });
  }, []);

  const onChangeValue = (event) => {
    dispatchMask({ value: event.target.value });
    if (!!onChange) {
      if (!!maskState.activeMask) {
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

  const onBlurValue = (event) => {
    if (onBlur) {
      const e = {
        ...event,
        target: {
          ...event.target,
          value: unmasker(event.target.value),
        },
      };
      onBlur(e);
    }
  };

  return (
    <span id={`STP_${id}`} className={styles.inputLine}>
      <input
        className={[
          styles.inputText,
          className || '',
          !isValid && styles.inputText_invalid,
        ].join(' ').trim()}
        onChange={onChangeValue}
        id={id}
        {...rest}
        maxLength={maskState.length}
        onBlur={onBlurValue}
        value={maskState.maskedValue}
      />
      <span className={styles.validationMessage}>
        {isValid || (validationMessage ? validationMessage : 'Campo inválido')}
      </span>
    </span>
  );
};

Input.propTypes = {
  className: PropTypes.string,
  valid: PropTypes.bool,
  validationMessage: PropTypes.string,
  mask: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  onBlur: PropTypes.func,
};

//Textarea
export const Textarea = ({ className, valid, validationMessage, ...rest }) => {
  const isValid = valid != null ? valid : true;
  return (
    <span className={styles.inputLine}>
      <textarea
        className={[
          styles.inputText,
          className || '',
          !isValid && styles.inputText_invalid,
        ].join(' ').trim()}
        {...rest}
      />
      <span className={styles.validationMessage}>
        {isValid || (validationMessage ? validationMessage : 'Campo inválido')}
      </span>
    </span>
  );
};

Textarea.propTypes = {
  className: PropTypes.string,
  valid: PropTypes.bool,
  validationMessage: PropTypes.string,
};
