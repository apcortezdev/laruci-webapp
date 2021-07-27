import styles from '../../../styles/AboutPage.module.scss';
import { getAboutInfo } from '../../../data/about';

const AboutPage = ({ notice }) => {
  return <div className={styles.container}>SOBRE NÓS</div>;
};

export async function getStaticProps() {
  const about = await getAboutInfo();

  return {
    props: {
      // notice: notice.notice,
    },
    revalidate: 86400,
  };
}

export default AboutPage;
