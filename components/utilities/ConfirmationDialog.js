import Button from './Button';
import Backdrop from './Backdrop';
import PropTypes from 'prop-types';
import styles from './ConfirmationDialog.module.scss';

const ConfirmationDialog = ({
  show,
  onCancel,
  onConfirm,
  message,
  cancelText,
  okText,
}) => {
  if (show) {
    return (
      <div className={styles.dialog}>
        <div className={styles.confirmationBox}>
          {message || 'Deseja salvar?'}
          <span>
            <Button className={styles.formButton} onClick={onCancel}>
              {cancelText || 'Cancelar'}
            </Button>
            <Button className={styles.formButton} onClick={onConfirm}>
              {okText || 'Ok'}
            </Button>
          </span>
        </div>
        <Backdrop />
      </div>
    );
  }
  return <div></div>;
};

ConfirmationDialog.propTypes = {
  show: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  message: PropTypes.string,
  cancelText: PropTypes.string,
  okText: PropTypes.string,
};

export default ConfirmationDialog;
