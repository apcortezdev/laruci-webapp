import { useState } from 'react';
import Head from 'next/Head';
import Link from 'next/link';
import styles from '../../../styles/loja/HelpPage.module.scss';
import Main from '../../../components/main/Main';
import Store from '../../../components/store/Store';
import { Input, InputMask } from '../../../components/utilities/FormComponents';
import Button from '../../../components/utilities/Button';
import { getCategoriesJSON } from '../../../data/categories';
import { getCurrentNotice } from '../../../data/notice';

const HelpPage = ({ title, notice, cannonical, categoryList }) => {
  return (
    <Main notice={notice} categoryList={categoryList}>
      <Head>
        <title>Laruci - {title}</title>
        <meta
          name="description"
          content={'Página da conta do cliente Laruci'}
        />
        <link href={cannonical} rel="canonical" />
      </Head>
      <Store notice={!!notice} categoryList={categoryList}>
        <div className={[styles.content].join(' ')}></div>
      </Store>
    </Main>
  );
};

export async function getStaticPaths() {
  const paths = [
    { params: { page: 'devolucoes' } },
    { params: { page: 'frete' } },
    { params: { page: 'pagamento' } },
    { params: { page: 'politicas' } },
  ];

  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const cannonical = 'http://localhost:3000/loja/ajuda/' + params.page;
  let title = params.page;

  switch (params.page) {
    case 'devolucoes':
      title = 'Devoluções';
      break;
    case 'frete':
      title = 'Frete';
      break;
    case 'pagamento':
      title = 'Pagamento';
      break;
    case 'politicas':
      title = 'Politicas';
      break;
  }

  const notice = await getCurrentNotice();
  let noticeText = notice ? notice.text : '';

  const categories = await getCategoriesJSON();
  const categoryList = await JSON.parse(categories);

  return {
    props: {
      title: title,
      notice: noticeText,
      cannonical: cannonical,
      categoryList: categoryList,
    },
    revalidate: 86400,
  };
}

export default HelpPage;
