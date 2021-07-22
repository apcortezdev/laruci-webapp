import { getAboutInfo } from '../../data/about';
import styles from '../../styles/AboutPage.module.scss';
import Main from '../../components/main/Main';
import Store from '../../components/store/Store';

const AboutPage = (props) => {
  return (
    <Main>
      <Store>
        <div className={styles.container}>
            SOBRE NÓS
        </div>
      </Store>
    </Main>
  );
};

export async function getStaticProps() {
  const about = getAboutInfo();
  return {
    props: {},
    revalidate: 86400,
  };
}

export default AboutPage;
