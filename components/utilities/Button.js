import styles from '../../styles/Button.module.scss';

const Button = (props) => {
  return (
    <div className={styles.button_container}>
      <button
        className={
          props.icon
            ? [styles.button, styles.button_icon].join(' ')
            : styles.button
        }
      >
        {props.children}
        <span className={styles.tooltip}>{props.tip}</span>
      </button>
    </div>
  );
};

export default Button;
