import Admin from '../../components/admin/Admin';

import styles from '../../styles/AdInitialPage.module.scss';

const AdminPage = (props) => {
  if (props.user !== 'admin') {
    return <p>Esta página no ecxiste!</p>;
  }
  return (
    <Admin>
      <p>Admin</p>
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
