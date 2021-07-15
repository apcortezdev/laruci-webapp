import PropTypes from 'prop-types';
import styles from './Button.module.scss';

const Button = ({className, children, tip, ...rest}) => {
  return (
    <button
      className={[className, styles.button].join(' ').trim()}
      {...rest}
    >
      {children}
      {!!tip && <span className={styles.tooltip}>{tip}</span>}
    </button>
  );
};

Button.propType = {
  className: PropTypes.string,
  tip: PropTypes.string,
};

export default Button;
