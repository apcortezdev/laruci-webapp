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
        {children}
      </div>
    </div>
  );
};

Store.propTypes = {
  categoryList: PropTypes.array.isRequired,
  notice: PropTypes.bool,
};

export default Store;
