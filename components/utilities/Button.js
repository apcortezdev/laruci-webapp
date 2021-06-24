import styles from '../../styles/Button.module.scss';

const Button = (props) => {
  return (
    <button type={props.type} className={[props.className, styles.button].join(' ')}>
      {props.children}
      {props.tip && <span className={styles.tooltip}>{props.tip}</span>}
    </button>
  );
};

export default Button;
