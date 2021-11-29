import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const SizeSelector = ({
  size,
  className,
  fullSizeList,
  availableSizeList,
  onChange,
  value,
}) => {
  return (
    <div
      className={[styles.tagsContainer, !!className ? className : ' ']
        .join(' ')
        .trim()}
    >
      {fullSizeList.map((element) => {
        const isAvailable = availableSizeList.some((size) => size === element);
        return (
          <div
            key={size._id + element}
            className={[
              styles.tag,
              isAvailable ? styles.abled : styles.disabled,
              value === element && styles.selected,
            ]
              .join(' ')
              .trim()}
            onClick={() => {
              if (isAvailable) onChange(size, element);
            }}
          >
            {element.toUpperCase()}
          </div>
        );
      })}
    </div>
  );
};

SizeSelector.propTypes = {
  fullSizeList: PropTypes.array.isRequired,
  availableSizeList: PropTypes.array.isRequired,
  size: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SizeSelector;
