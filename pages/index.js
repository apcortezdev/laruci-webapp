import Image from 'next/image';
import Main from '../components/main/Main';
import { getMainPageNotice } from '../data/notice';
import { getPageInfo } from '../data/pageInfo';
import styles from '../styles/Home.module.scss';

export default function Home({ notice, info }) {
  if (!!!info) {
    return <p>Loading...</p>;
  }

  return (
    <Main notice={notice} background={false}>
      <section className={styles.banner_one}>
        <div className={styles.banner_one_web}>
          <Image
            src={'/web_frontpage_banner_01.png'}
            layout="fill"
            objectFit="cover"
            loading="lazy"
            alt="Laruci banner promocional"
          />
        </div>
        <div className={styles.banner_one_nav}>
          <Image
            src={'/mobile_frontpage_banner_01.png'}
            layout="fill"
            objectFit="cover"
            loading="lazy"
            alt="Laruci banner promocional"
          />
        </div>
        <div className={styles.frontpage_banner_slogan}>
          {info.frontpage_banner_slogan}
        </div>
        <div className={styles.frontpage_banner_title}>
          {info.title}
        </div>
      </section>
      <section className={styles.home_listng}>LOLOLOLOLO</section>
    </Main>
  );
}

export async function getStaticProps() {
  const notice = getMainPageNotice();
  const info = getPageInfo();
  return {
    props: {
      notice: '',
      info: info,
    },
    revalidate: 86400,
  };
}
