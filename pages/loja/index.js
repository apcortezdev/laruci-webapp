import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Main from '../../components/main/Main';
import MainMenu from '../../components/MainMenu';
import styles from '../../styles/loja/Home.module.scss';
import {
  getPageInfo,
  getSocialContact,
  getTopNotice,
  getCategories,
} from '../../data/access/appInfo';
import { getProductListing } from '../../data/access/products';
import ProductList from '../../components/ProductList';

export default function Home({
  notice,
  categories,
  info,
  facebookLink,
  instagramLink,
  whatsappLink,
}) {
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
      categoryList={categories}
      isTransparent={isTransparent}
      transparency={opacityBanner}
      footerLinks={{
        facebook: facebookLink,
        instagram: instagramLink,
        whatsapp: whatsappLink,
      }}
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
        <MainMenu categoryList={categories} onMobileClick={false} />
      </div>
      <section className={styles.home_listng}>
        {info.promos.map((promo) => (
          <section
            key={promo.id}
            className={styles.promo_section}
            id={promo.id}
          >
            <Link
              href={{
                pathname: `/loja${promo.link}`,
                query: promo.query,
              }}
            >
              <a>
                <div className={styles.banner}>
                  <Image
                    src={promo.image}
                    layout="fill"
                    objectFit="cover"
                    loading="lazy"
                    alt="Laruci Lingerie - Conjuntos"
                  />
                  <p>{promo.text}</p>
                </div>
              </a>
            </Link>
            <div className={styles.listing}>
              <ProductList productList={promo.products} type="large" />
              <Link
                href={{
                  pathname: `/loja${promo.link}`,
                  query: promo.query,
                }}
              >
                <a>ver mais</a>
              </Link>
            </div>
          </section>
        ))}
      </section>
    </Main>
  );
}

export async function getStaticProps() {
  try {
    const promises = await Promise.all([
      getTopNotice(),
      getPageInfo(),
      getCategories(),
      getSocialContact(),
    ]);

    const notice = promises[0];
    const info = promises[1];
    const categories = promises[2];
    const contato = promises[3];

    const facebook = 'https://facebook.com/' + contato.facebookName;
    const instagtam = 'https://instagram.com/' + contato.instagramName;
    const whatsapp = `https://wa.me/${
      contato.whatsappNum
    }?text=${encodeURIComponent(contato.whatsappMessage)}`;

    const promisesPromo = [];
    for (const promo of info.promos) {
      promisesPromo.push(
        getProductListing(
          {
            category: promo.categoryId,
            section: promo.section || 0,
            order: 'createdOn',
          },
          1,
          3
        )
      );
    }
    const promos = await Promise.all([...promisesPromo]);

    const prodsJsons = []
    promos.forEach((promo) => {
      prodsJsons.push(JSON.parse(JSON.stringify(promo)));
    })

    const productLists = await Promise.all([...prodsJsons]);

    for (let index = 0; index < info.promos.length; index++) {
      info.promos[index].products = productLists[index]
    }

    return {
      props: {
        notice: notice,
        categories: categories,
        info: info,
        facebookLink: facebook,
        instagramLink: instagtam,
        whatsappLink: whatsapp,
      },
      revalidate: 86400,
    };
  } catch (err) {
    return {
      props: {
        notice: null,
        categories: [],
        info: {},
        facebookLink: '',
        instagramLink: '',
        whatsappLink: '',
      },
    };
  }
}
