import styles from '../../styles/Button.module.scss';

const Button = (props) => {
  return (
    <button className={[props.classSize, styles.button].join(' ')}>
      {props.children}
      <span className={styles.tooltip}>{props.tip}</span>
    </button>
  );
};

export default Button;
