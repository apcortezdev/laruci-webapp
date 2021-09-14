import Head from 'next/Head';
import React from 'react';
import Main from '../components/main/Main';
import Store from '../components/store/Store';
import { getCategoriesJSON } from '../data/categories';
import { getCurrentNotice } from '../data/notice';
import { getMainSocial } from '../data/contact';

import { BagContextProvider } from '../store/bag-context';
import styles from '../styles/loja/NotFoundPage.module.scss';

const NotFoundPage = ({
  notice,
  title,
  canonical,
  categoryList,
  facebookLink,
  instagramLink,
  whatsappLink,
}) => {
  return (
    <BagContextProvider>
      <Main
        notice={notice}
        categoryList={categoryList}
        footerLinks={{
          facebook: facebookLink,
          instagram: instagramLink,
          whatsapp: whatsappLink,
        }}
      >
        <Store notice={!!notice} categoryList={categoryList}>
          <Head>
            <title>{title}</title>
            <meta
              name="description"
              content={'Ops, esta página não foi encontrada'}
            />
            <link href={canonical} rel="canonical" />
          </Head>
          <div className={styles.contentbox}>
            <h1>404</h1>
            <h2>Ops, não encontramos o que você procura.</h2>
          </div>
        </Store>
      </Main>
    </BagContextProvider>
  );
};

export async function getStaticProps() {
  const categories = await getCategoriesJSON();
  const categoryList = await JSON.parse(categories);

  const notice = await getCurrentNotice();
  let noticeText = notice ? notice.text : '';

  const contato = await getMainSocial();
  const facebook = 'https://facebook.com/' + contato[0].facebookName;
  const instagtam = 'https://instagram.com/' + contato[0].instagramName;
  const whatsapp = `https://wa.me/${
    contato[0].whatsappNum
  }?text=${encodeURIComponent(contato[0].whatsappMessage)}`;

  return {
    props: {
      title: 'Laruci',
      canonical: 'http://localhost:3000/',
      notice: noticeText,
      categoryList: categoryList,
      facebookLink: facebook,
      instagramLink: instagtam,
      whatsappLink: whatsapp,
    },
  };
}

export default NotFoundPage;
