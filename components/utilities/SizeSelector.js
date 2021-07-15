import PropTypes from 'prop-types';
import styles from './SizeSelector.module.scss';

const SizeSelector = (props) => {
  const sizes = props.fillSizeList;
  let tags = [];

  for (const key in sizes) {
    if (Object.hasOwnProperty.call(props.availableSizeList, key)) {
      tags.push(
        <div key={sizes[key]} className={[styles.abled].join(' ').trim()}>
          {sizes[key]}
        </div>
      );
    } else {
      tags.push(
        <div
          key={sizes[key]}
          className={[styles.tag, styles.disabled].join(' ').trim()}
        >
          {sizes[key]}
        </div>
      );
    }
  }
  return (
    <>
      <div className={styles.tagsContainer}>{tags}</div>
      <div className={styles.guideContainer}>
        <span className={styles.font_inline}>Guia de tamanhos aqui!</span>
      </div>
    </>
  );
};

SizeSelector.propTypes = {
  fillSizeList: PropTypes.object,
  availableSizeList:  PropTypes.object,
};

export default SizeSelector;
