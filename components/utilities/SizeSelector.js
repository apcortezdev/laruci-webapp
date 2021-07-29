import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from './SizeSelector.module.scss';

const SizeSelector = ({
  keyName,
  fullSizeList,
  availableSizeList,
  name,
  id,
  onChange,
  ...rest
}) => {

  let tags = [];
  const [selectedTag, setSelectedTag] = useState('');

  function onSelect(elementId, name, sizeId) {
    if (onChange) onChange(sizeId, name, elementId);
    setSelectedTag(elementId);
  }

  fullSizeList.forEach(element => {
    let key;
    if (!!keyName) key = keyName + '_' + element.id;
    else key = element.id;

    if (availableSizeList.some((size) => size.value === element.value)) {
      tags.push(
        <div
          key={key}
          className={[
            styles.tag,
            styles.abled,
            element.id === selectedTag && styles.selected,
          ]
            .join(' ')
            .trim()}
            onClick={onSelect.bind(this, element.id, name, id)}
        >
          {element.value}
        </div>
      );
    } else {
      tags.push(
        <div
          key={key}
          className={[styles.tag, styles.disabled].join(' ').trim()}
        >
          {element.value}
        </div>
      );
    }
  });

  return (
    <>
      <div className={styles.tagsContainer} {...rest}>
        {tags}
      </div>
    </>
  );
};

SizeSelector.propTypes = {
  keyName: PropTypes.string,
  fullSizeList: PropTypes.array.isRequired,
  availableSizeList: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SizeSelector;
