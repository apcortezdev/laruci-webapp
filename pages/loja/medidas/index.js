import styles from '../../../styles/SizesPage.module.scss';
import { getAboutInfo } from '../../../data/about';

const SizesPage = ({ notice }) => {
  return <div className={styles.container}>Medidas</div>;
};

export async function getStaticProps() {
  return {
    props: {
      // notice: notice.notice,
    },
    revalidate: 86400,
  };
}

export default SizesPage;
