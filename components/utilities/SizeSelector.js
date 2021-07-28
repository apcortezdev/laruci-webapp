import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from './SizeSelector.module.scss';

const SizeSelector = ({
  keyName,
  fullSizeList,
  availableSizeList,
  name,
  onChange,
  ...rest
}) => {

  let tags = [];
  const [selectedTag, setSelectedTag] = useState('');

  function onSelect(id, name) {
    if (onChange) onChange(name, id);
    setSelectedTag(id);
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
            onClick={onSelect.bind(this, element.id, name)}
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
  fullSizeList: PropTypes.array,
  availableSizeList: PropTypes.array,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

export default SizeSelector;
