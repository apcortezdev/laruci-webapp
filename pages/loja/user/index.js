import styles from '../../../styles/loja/UserPage.module.scss';

const UserPage = (props) => {
  return <div className={styles.container}>User</div>;
};

export async function getStaticProps() {

  return {
    props: {
      // notice: notice.notice,
    },
    revalidate: 86400,
  };
}

export default UserPage;
