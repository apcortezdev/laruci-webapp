import { getAboutInfo } from '../../data/about';
import styles from '../../styles/SizesPage.module.scss';
import Main from '../../components/main/Main';
import Store from '../../components/store/Store';

const SizesPage = (props) => {
  return (
    <Main>
      <Store>
        <div className={styles.container}>Medidas</div>
      </Store>
    </Main>
  );
};

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 86400,
  };
}

export default SizesPage;
