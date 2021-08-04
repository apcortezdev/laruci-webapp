import PropTypes from 'prop-types';
import WebMenu from '../MainMenu';
import styles from './Store.module.scss';

const Store = ({ categoryList, notice, children }) => {
  return (
    <div className={styles.content_wrapper}>
      <div
        className={[styles.webmenu, !!notice ? styles.webmenu_notice : '']
          .join(' ')
          .trim()}
      >
        <WebMenu onMobileClick={false} categoryList={categoryList}/>
      </div>

      <div className={styles.content}>
        <div className={styles.aside} />
        <div className={styles.flex_center}>{children}</div>
        <div className={styles.aside} />
      </div>
    </div>
  );
};

Store.propTypes = {
  categoryList: PropTypes.array.isRequired,
  notice: PropTypes.bool,
};

export default Store;
