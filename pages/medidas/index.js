import Store from '../../components/store/Store';
import styles from '../../styles/SizesPage.module.scss';

const SizesPage = (props) => {
  return (
    <Store>
      <div className={styles.main}>
        <div className={styles.aside} />
        <div className={styles.flex_center}>Tamanhos</div>
        <div className={styles.aside} />
      </div>
    </Store>
  );
};

export default SizesPage;
