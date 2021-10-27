import { getSession, signin } from 'next-auth/client';
import Head from 'next/Head';
import { useState } from 'react';
import Main from '../../../components/main/Main';
import Store from '../../../components/store/Store';
import ConfirmationDialog from '../../../components/utilities/ConfirmationDialog';
import {
  getCategories,
  getSocialContact,
  getTopNotice,
} from '../../../data/access/appInfo';
import defstyles from '../../../styles/loja/Defaults.module.scss';

const UserPage = ({
  notice,
  categoryList,
  facebookLink,
  instagramLink,
  whatsappLink,
}) => {
  // Dialog
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // const [cancelText, setCancelText] = useState('');
  // const [okText, setOkText] = useState('');
  const [noButtons, setNoButtons] = useState(false);
  const [onFocus, setOnfocus] = useState(() => () => {});

  const logout = async (e) => {
    e.preventDefault();
    if (!client) {
      setShowDialog(true);
    } else {
      setOnfocus(() => () => {});
      setNoButtons(true);
      setShowDialog(true);
      setDialogMessage('carregando ...');
      const response = await signin('credentials', {
        redirect: false,
        email: client.email,
        password: client.password,
      });

      switch (response.status) {
        case 200:
          if (response.error) {
            setNoButtons(false);
            setDialogMessage(
              'Ops, algo deu errado. Por favor, tente daqui a pouquinho!'
            );
          } else {
          }
          break;
        default:
          setNoButtons(false);
          setDialogMessage(
            'Ops, algo deu errado. Por favor, tente daqui a pouquinho!'
          );
          break;
      }
    }
  };

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
        <link href={'http://localhost:3000/loja/user'} rel="canonical" />
      </Head>
      <Store notice={!!notice} categoryList={categoryList}>
        <div
          className={[
            defstyles.content,
            defstyles.flex_center,
            defstyles.flex_column,
            defstyles.h_100,
          ].join(' ')}
        >
          <div>Histórico de Compras!</div>
        </div>
      </Store>
      <ConfirmationDialog
        show={showDialog}
        onCancel={() => {
          setShowDialog(false);
          // setCancelText('');
          // setOkText('ok');
        }}
        onConfirm={() => {
          setShowDialog(false);
          onFocus();
          // setCancelText('');
          // setOkText('ok');
        }}
        message={dialogMessage}
        // cancelText={cancelText}
        // okText={okText}
        noButtons={noButtons}
        fixed
      />
    </Main>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/loja/cliente/entrar',
        permanent: false,
      },
    };
  }

  try {
    const promises = await Promise.all([
      getTopNotice(),
      getCategories(),
      getSocialContact(),
    ]);

    const notice = promises[0];
    const categories = promises[1];
    const contato = promises[2];
    const facebook = 'https://facebook.com/' + contato.facebookName;
    const instagtam = 'https://instagram.com/' + contato.instagramName;
    const whatsapp = `https://wa.me/${
      contato.whatsappNum
    }?text=${encodeURIComponent(contato.whatsappMessage)}`;

    return {
      props: {
        notice: notice,
        categoryList: categories,
        facebookLink: facebook,
        instagramLink: instagtam,
        whatsappLink: whatsapp,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}

export default UserPage;
