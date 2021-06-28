import PropTypes from 'prop-types';
import styles from './Button.module.scss';

const Button = (props) => {
  return (
    <button
      type={props.type}
      className={[props.className, styles.button].join(' ')}
      onClick={props.onClick}
    >
      {props.children}
      {props.tip && <span className={styles.tooltip}>{props.tip}</span>}
    </button>
  );
};

Button.propType = {
  type: PropTypes.string,
  className: PropTypes.string,
  tip: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
