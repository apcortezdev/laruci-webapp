import ReactDom from 'react-dom';
import styles from '../../styles/Backdrop.module.scss';

const BackdropScreen = (props) => {
  return <div className={styles.backdrop} onClick={props.onDismiss} />;
};

const Backdrop = (props) => {
  return (
    <>
      {ReactDom.createPortal(
        <BackdropScreen onDismiss={props.onDismiss} />,
        document.getElementById('backdrop-root')
      )}
    </>
  );
};

export default Backdrop;
