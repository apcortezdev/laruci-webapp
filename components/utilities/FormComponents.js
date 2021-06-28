import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './FormComponents.module.scss';

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
  const [classOptions, setClassOptions] = useState([
    styles.options,
    styles.options_invisible,
  ]);

  const selection = useRef();

  const [selected, setSelected] = useState(props.placeholder);
  const [htmlColors, setHtmlColors] = useState([]);

  const interactOver = (visible) => {
    if (visible) {
      return setClassOptions([styles.options, styles.options_visible]);
    }
    return setClassOptions([styles.options, styles.options_invisible]);
  };

  const changeSelected = (name) => {
    setSelected(name);
    props.onChange(name);
    selection.current.className = [styles.options, styles.options_invisible].join(' ');
  };

  const setColorItens = useCallback((colorList) => {
    for (const key in colorList) {
      setHtmlColors((html) => [
        ...html,
        <SelectColorItem
          key={key}
          onSelect={changeSelected}
          colorName={key}
          colorCode={colorList[key]}
        />,
      ]);
    }
  });

  useEffect(() => {
    setHtmlColors([
      <SelectColorItem
        key={props.placeholder}
        onSelect={() => changeSelected(props.placeholder)}
        colorName={props.placeholder}
      />,
    ]);

    setColorItens(props.colors);
  }, [props.colors]);

  return (
    <div
      className={[styles.select, props.className].join(' ')}
      onClick={() => interactOver(true)}
      onMouseLeave={() => interactOver(false)}
    >
      <span className={styles.selected}>{selected}</span>
      <div ref={selection} className={classOptions.join(' ')}>{htmlColors}</div>
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
  const [classOptions, setClassOptions] = useState([
    styles.options,
    styles.options_invisible,
  ]);

  const selection = useRef();

  const [selected, setSelected] = useState(props.placeholder);
  const [htmlOptions, setHtmlOptions] = useState([]);

  const interactOver = (visible) => {
    if (visible) {
      return setClassOptions([styles.options, styles.options_visible]);
    }
    return setClassOptions([styles.options, styles.options_invisible]);
  };

  const changeSelected = (name, value) => {
    setSelected(value);
    props.onChange(name);
    selection.current.className = [styles.options, styles.options_invisible].join(' ');
  };

  const setOptionItens = useCallback((optionList) => {
    for (const key in optionList) {
      setHtmlOptions((html) => [
        ...html,
        <SelectTextItem
          key={key}
          onSelect={changeSelected}
          optionName={key}
          optionValue={optionList[key]}
        />,
      ]);
    }
  });

  useEffect(() => {
    setHtmlOptions([
      <SelectTextItem
        key={props.placeholder}
        onSelect={() => changeSelected(props.placeholder, props.placeholder)}
        optionName={'0'}
        optionValue={props.placeholder}
      />,
    ]);

    setOptionItens(props.options);
  }, [props.options]);

  return (
    <div
      className={[styles.select, props.className].join(' ')}
      onClick={() => interactOver(true)}
      onMouseLeave={() => interactOver(false)}
    >
      <span className={styles.selected}>{selected}</span>
      <div ref={selection} className={classOptions.join(' ')}>{htmlOptions}</div>
    </div>
  );
};