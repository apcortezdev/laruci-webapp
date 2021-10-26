import Head from 'next/Head';
import Main from '../../../components/main/Main';
import Store from '../../../components/store/Store';
import {
  getCategories,
  getSocialContact,
  getTopNotice,
} from '../../../data/access/appInfo';
import styles from '../../../styles/loja/Defaults.module.scss';

const AboutPage = ({
  notice,
  domain,
  categoryList,
  facebookLink,
  instagramLink,
  whatsappLink,
}) => {
  if (!categoryList || !facebookLink || !instagramLink || !whatsappLink) {
    return <p>Carregando ...</p>;
  }

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
        <title>Laruci - Login</title>
        <meta
          name="description"
          content={'Página da conta do cliente Laruci'}
        />
        <link href={`${domain}/loja/sobre`} rel="canonical" />
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
          SOBRE NÓS
        </div>
      </Store>
    </Main>
  );
};

export async function getStaticProps() {
  const notice = await getTopNotice();

  const categories = await getCategories();

  const contato = await getSocialContact();
  const facebook = 'https://facebook.com/' + contato.facebookName;
  const instagtam = 'https://instagram.com/' + contato.instagramName;
  const whatsapp = `https://wa.me/${
    contato.whatsappNum
  }?text=${encodeURIComponent(contato.whatsappMessage)}`;

  return {
    props: {
      notice: notice,
      domain: process.env.MAIN_DOMAIN,
      categoryList: categories,
      facebookLink: facebook,
      instagramLink: instagtam,
      whatsappLink: whatsapp,
    },
  };
}

export default AboutPage;
