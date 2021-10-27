import Head from 'next/Head';
import styles from '../../../styles/loja/Defaults.module.scss';
import Main from '../../../components/main/Main';
import Store from '../../../components/store/Store';
import {
  getCategories,
  getSocialContact,
  getTopNotice,
} from '../../../data/access/appInfo';

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
  const cannonical = `${process.env.MAIN_DOMAIN}/loja/ajuda/` + params.page;
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
        notFound: true,
      };
  }

  try {
    const promises = await Promise.all([
      getTopNotice(),
      getCategories(),
      getSocialContact(),
    ]);
    const notice = promises[0];
    const categories = promises[1];
    const contato = promises[2];
    const facebook = 'https://facebook.com/' + contato.facebookName;
    const instagtam = 'https://instagram.com/' + contato.instagramName;
    const whatsapp = `https://wa.me/${
      contato.whatsappNum
    }?text=${encodeURIComponent(contato.whatsappMessage)}`;

    return {
      props: {
        title: title,
        notice: notice,
        cannonical: cannonical,
        categoryList: categories,
        facebookLink: facebook,
        instagramLink: instagtam,
        whatsappLink: whatsapp,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}

export default HelpPage;
