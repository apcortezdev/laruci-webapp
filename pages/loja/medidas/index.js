import Head from 'next/Head';
import Main from '../../../components/main/Main';
import Store from '../../../components/store/Store';
import styles from '../../../styles/loja/UserPage.module.scss';

const SizesPage = ({ notice }) => {
  return (
    <Main notice={notice} categoryList={categoryList}>
      <Head>
        <title>Laruci - Login</title>
        <meta
          name="description"
          content={"Página da conta do cliente Laruci"}
        />
        <link href={"http://localhost:3000/loja/user"} rel="canonical" />
      </Head>
      <Store notice={!!notice} categoryList={categoryList}>
        <div className={styles.content}></div>
      </Store>
    </Main>
  );
};

export async function getStaticProps() {
  const notice = await getCurrentNotice();
  let noticeText = notice ? notice.text : '';

  const categories = await getCategoriesJSON();
  const categoryList = await JSON.parse(categories);

  return {
    props: {
      notice: noticeText,
      categoryList: categoryList,
    },
    revalidate: 86400,
  };
}

export default SizesPage;
