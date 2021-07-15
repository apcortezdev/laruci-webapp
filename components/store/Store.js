import WebMenu from '../MainMenu';

import Logo from '../utilities/Logo';
import styles from './Store.module.scss';

function Store(props) {
  return (
    <div className={styles.content_wrapper}>
      <Logo />
      <div className={styles.webmanu}>
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
