import Admin from '../../components/admin/Admin';
import { getSession } from 'next-auth/client';

const AdBannersPage = (props) => {
  return (
    <Admin>
      <div>Banners</div>
    </Admin>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || session.user.name !== process.env.USERADM) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
}

export default AdBannersPage;
