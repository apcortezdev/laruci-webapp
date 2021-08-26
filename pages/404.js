import Head from 'next/Head';
import React from 'react';
import Main from '../components/main/Main';
import Store from '../components/store/Store';
import { getCategoriesJSON } from '../data/categories';
import { getCurrentNotice } from '../data/notice';
import styles from '../styles/loja/NotFoundPage.module.scss';
import { BagContextProvider } from '../store/bag-context';


const NotFoundPage = ({ notice, title, canonical, categoryList }) => {
  return (
    <BagContextProvider>
      <Main notice={notice} categoryList={categoryList}>
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

  return {
    props: {
      title: 'Laruci',
      canonical: 'http://localhost:3000/',
      notice: noticeText,
      categoryList: categoryList,
    },
  };
}

export default NotFoundPage;
