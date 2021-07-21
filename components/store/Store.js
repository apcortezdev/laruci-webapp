import WebMenu from '../MainMenu';
import styles from './Store.module.scss';

function Store(props) {
  return (
    <div className={styles.content_wrapper}>
      <div className={styles.webmenu}>
        <WebMenu onMobileClick={false} />
      </div>
      <div className={styles.content}>
        <div className={styles.aside} />
        <div className={styles.flex_center}>{props.children}</div>
        <div className={styles.aside} />
      </div>
    </div>
  );
}

export default Store;
