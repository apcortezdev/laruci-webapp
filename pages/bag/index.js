import styles from '../../styles/BagPage.module.scss';
import Main from '../../components/main/Main';
import Store from '../../components/store/Store';

const BagPage = (props) => {
  return (
    <Main>
      <Store>
        <div className={styles.container}>Bag</div>
      </Store>
    </Main>
  );
};

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 86400,
  };
}

export default BagPage;
