import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from './SizeSelector.module.scss';

const SizeSelector = ({
  id,
  fullSizeList,
  availableSizeList,
  onChange,
  value,
}) => {
  let tags = [];

  fullSizeList.forEach((element) => {
    const isAvailable = availableSizeList.some((size) => size === element);
    tags.push(
      <div
        key={id + element}
        className={[
          styles.tag,
          isAvailable ? styles.abled : styles.disabled,
          value === element && styles.selected,
        ]
          .join(' ')
          .trim()}
        onClick={() => {
          if (isAvailable) onChange(id, element);
        }}
      >
        {element.toUpperCase()}
      </div>
    );
  });

  return (
    <>
      <div className={styles.tagsContainer}>{tags}</div>
    </>
  );
};

SizeSelector.propTypes = {
  fullSizeList: PropTypes.array.isRequired,
  availableSizeList: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SizeSelector;
