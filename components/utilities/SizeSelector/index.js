import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const SizeSelector = ({
  id,
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
      })}
    </div>
  );
};

SizeSelector.propTypes = {
  fullSizeList: PropTypes.array.isRequired,
  availableSizeList: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SizeSelector;
