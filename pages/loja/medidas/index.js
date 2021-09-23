import Head from 'next/Head';
import Main from '../../../components/main/Main';
import Store from '../../../components/store/Store';
import { getCategoriesJSON } from '../../../data/categories';
import { getMainSocial } from '../../../data/contact';
import { getCurrentNotice } from '../../../data/notice';
import styles from '../../../styles/loja/Defaults.module.scss';

const SizesPage = ({
  notice,
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
        <link href={'http://localhost:3000/loja/medidas'} rel="canonical" />
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
          MEDIDAS
        </div>
      </Store>
    </Main>
  );
};

export async function getStaticProps() {
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
      notice: noticeText,
      categoryList: categoryList,
      facebookLink: facebook,
      instagramLink: instagtam,
      whatsappLink: whatsapp,
    },
    revalidate: 86400,
  };
}

export default SizesPage;
