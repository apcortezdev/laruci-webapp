import PropTypes from 'prop-types';
import styles from './SizeSelector.module.scss';

const SizeSelector = ({ fullSizeList, availableSizeList, ...rest }) => {
  const sizes = fullSizeList;
  let tags = [];

  for (const key in sizes) {
    if (Object.hasOwnProperty.call(availableSizeList, key)) {
      tags.push(
        <div key={sizes[key].name} className={[styles.abled].join(' ').trim()}>
          {sizes[key].name}
        </div>
      );
    } else {
      tags.push(
        <div
          key={sizes[key].name}
          className={[styles.tag, styles.disabled].join(' ').trim()}
        >
          {sizes[key].name}
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
