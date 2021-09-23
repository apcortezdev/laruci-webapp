import Head from 'next/Head';
import styles from '../../../styles/loja/Defaults.module.scss';
import Main from '../../../components/main/Main';
import Store from '../../../components/store/Store';
import { getCategoriesJSON } from '../../../data/categories';
import { getCurrentNotice } from '../../../data/notice';
import { getMainSocial } from '../../../data/contact';

const HelpPage = ({
  title,
  notice,
  cannonical,
  categoryList,
  facebookLink,
  instagramLink,
  whatsappLink,
}) => {
  return (
    <Main
      notice={notice}
      categoryList={categoryList}
      footerLinks={{
        facebook: facebookLink,
        instagram: instagramLink,
        whatsapp: whatsappLink,
      }}
    >
      <Head>
        <title>Laruci - {title}</title>
        <meta
          name="description"
          content={'Página da conta do cliente Laruci'}
        />
        <link href={cannonical} rel="canonical" />
      </Head>
      <Store notice={!!notice} categoryList={categoryList}>
        <div
          className={[
            styles.content,
            styles.flex_center,
            styles.flex_column,
            styles.h_100,
          ].join(' ')}
        >
          {title}
        </div>
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
    default:
      return {
        notFound: true
      }
  }

  const notice = await getCurrentNotice();
  let noticeText = notice ? notice.text : '';

  const categories = await getCategoriesJSON();
  const categoryList = await JSON.parse(categories);

  const contato = await getMainSocial();
  const facebook = 'https://facebook.com/' + contato[0].facebookName;
  const instagtam = 'https://instagram.com/' + contato[0].instagramName;
  const whatsapp = `https://wa.me/${
    contato[0].whatsappNum
  }?text=${encodeURIComponent(contato[0].whatsappMessage)}`;

  return {
    props: {
      title: title,
      notice: noticeText,
      cannonical: cannonical,
      categoryList: categoryList,
      facebookLink: facebook,
      instagramLink: instagtam,
      whatsappLink: whatsapp,
    },
    revalidate: 86400,
  };
}

export default HelpPage;
