import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from './SizeSelector.module.scss';

const SizeSelector = ({
  keyName,
  fullSizeList,
  availableSizeList,
  ...rest
}) => {
  const sizes = fullSizeList;
  let tags = [];

  const [selectedTag, setSelectedTag] = useState('');

  function onSelect(tag) {
    setSelectedTag(tag);
  }

  for (const i in sizes) {
    let key;
    if (!!keyName) key = keyName + '_' + sizes[i].name;
    else key = sizes[i].name;

    if (Object.hasOwnProperty.call(availableSizeList, i)) {
      tags.push(
        <div
          key={key}
          className={[
            styles.tag,
            styles.abled,
            sizes[i].name === selectedTag && styles.selected,
          ]
            .join(' ')
            .trim()}
            onClick={onSelect.bind(this, sizes[i].name)}
        >
          {sizes[i].name}
        </div>
      );
    } else {
      tags.push(
        <div
          key={key}
          className={[styles.tag, styles.disabled].join(' ').trim()}
        >
          {sizes[i].name}
        </div>
      );
    }
  }
  return (
    <>
      <div className={styles.tagsContainer} {...rest}>
        {tags}
      </div>
    </>
  );
};

SizeSelector.propTypes = {
  fullSizeList: PropTypes.object,
  availableSizeList: PropTypes.object,
};

export default SizeSelector;
