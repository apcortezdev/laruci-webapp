import Head from 'next/Head';
import React from 'react';
import Main from '../components/main/Main';
import Store from '../components/store/Store';
import {
  getSocialContact,
  getTopNotice,
  getCategories,
} from '../data/access/appInfo';
import { BagContextProvider } from '../store/bag-context';
import styles from '../styles/loja/NotFoundPage.module.scss';

const NotFoundPage = ({
  notice,
  title,
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
  const categories = await getCategories();

  const notice = await getTopNotice();

  const contato = await getSocialContact();
  const facebook = 'https://facebook.com/' + contato.facebookName;
  const instagtam = 'https://instagram.com/' + contato.instagramName;
  const whatsapp = `https://wa.me/${
    contato.whatsappNum
  }?text=${encodeURIComponent(contato.whatsappMessage)}`;

  return {
    props: {
      title: process.env.MAIN_TITLE,
      notice: notice,
      categoryList: categories,
      facebookLink: facebook,
      instagramLink: instagtam,
      whatsappLink: whatsapp,
    },
  };
}

export default NotFoundPage;
