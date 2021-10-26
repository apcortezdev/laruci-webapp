import { getSession } from 'next-auth/client';

import Admin from '../../components/admin/Admin';
import styles from './styles.module.scss';

const AdminPage = (props) => {
  return (
    <Admin>
      <div className={styles.wrapper}>
        <section className={styles.warning}>
          <h1>Atenção!</h1>
          <div>
            <ul>
              <li>
                Cuidado ao fazer alterações! Tenha sempre <u>certeza</u> do que
                está fazendo!
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
  // const session = await getSession({ req: context.req });

  // if (!session || session.user.name !== process.env.USERADM) {
  //   return {
  //     notFound: true,
  //   };
  // }

  return {
    props: {
      // session: session,
    },
  };
}

export default AdminPage;
