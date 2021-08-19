import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Main from '../../components/main/Main';
import MainMenu from '../../components/MainMenu';
import { getCurrentNotice } from '../../data/notice';
import { getPageInfo } from '../../data/pageInfo';
import styles from '../../styles/loja/Home.module.scss';
import { getCategoriesJSON } from '../../data/categories';

export default function Home({ notice, categoryList, info }) {
  if (!info || !categoryList) {
    return <p>Loading...</p>;
  }

  const [opacityBanner, setOpacityBanner] = useState(0);
  const [isTransparent, setIsTransparent] = useState(true);
  const bannerSection = useRef();

  useEffect(() => {
    const scrollBanner = () => {
      if (bannerSection.current) {
        setOpacityBanner(
          (window.pageYOffset / bannerSection.current.clientHeight) * 1.1
        );
        if (
          (window.pageYOffset + 64) / bannerSection.current.clientHeight >=
          1
        ) {
          setIsTransparent(false);
        } else {
          setIsTransparent(true);
        }
      }
    };
    window.addEventListener('scroll', scrollBanner);
    return () => window.removeEventListener('scroll', scrollBanner);
  }, []);

  return (
    <Main
      notice={notice}
      categoryList={categoryList}
      isTransparent={isTransparent}
      transparency={opacityBanner}
    >
      <section className={styles.banner_one}>
        <div className={styles.frontpage_banner_slogan}>
          {info.frontpage_banner_slogan}
        </div>
        <div
          ref={bannerSection}
          className={styles.overbanner}
          style={{ opacity: opacityBanner }}
        />
        <div className={styles.banner_one_web}>
          <Image
            src={'/images/banners/web_frontpage_banner_01.png'}
            layout="fill"
            objectFit="cover"
            loading="lazy"
            alt="Laruci banner promocional página web"
          />
        </div>
        <div className={styles.banner_one_nav}>
          <Image
            src={'/images/banners/mobile_frontpage_banner_01.png'}
            layout="fill"
            objectFit="cover"
            loading="lazy"
            alt="Laruci banner promocional página mobile"
          />
        </div>
      </section>
      <div
        className={[
          styles.mainmenu,
          !isTransparent
            ? !!notice
              ? styles.fixed_with_notice
              : styles.fixed
            : '',
        ]
          .join(' ')
          .trim()}
      >
        <MainMenu categoryList={categoryList} onMobileClick={false} />
      </div>
      <section className={styles.home_listng}></section>
    </Main>
  );
}

export async function getStaticProps() {
  const notice = await getCurrentNotice();
  let noticeText = notice ? notice.text : '';

  const info = await getPageInfo();

  const categories = await getCategoriesJSON();
  const catList = await JSON.parse(categories);

  return {
    props: {
      notice: noticeText,
      categoryList: catList,
      info: info,
    },
    revalidate: 86400,
  };
}
