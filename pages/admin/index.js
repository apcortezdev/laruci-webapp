import Admin from '../../components/admin/Admin';

import styles from '../../styles/AdInitialPage.module.scss';

const AdminPage = (props) => {
  if (props.user !== 'admin') {
    return <p>Esta página no ecxiste!</p>;
  }
  return (
    <Admin>
      <div className={styles.wrapper}>
        <section className={styles.warning}>
          <h1>Atenção!</h1>
          <div>
            <ul>
              <li>
                Cuidado ao fazer alterações! Tenha sempre <u>certeza</u> do que está fazendo!
              </li>
              <li>
                Alterações poderão <u> demorar até 24 horas</u> para serem
                atualizadas no site.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </Admin>
  );
};

export async function getServerSideProps(context) {
  const { params, req, res } = context;

  return {
    props: {
      user: 'admin',
    },
  };
}

export default AdminPage;
