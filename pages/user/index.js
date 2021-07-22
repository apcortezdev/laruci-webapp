import styles from '../../styles/UserPage.module.scss';
import Main from '../../components/main/Main';
import Store from '../../components/store/Store';

const UserPage = (props) => {
  return (
    <Main>
      <Store>
        <div className={styles.container}>User</div>
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

export default UserPage;
