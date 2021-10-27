import { getSession, signin } from 'next-auth/client';
import Head from 'next/Head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import Main from '../../../components/main/Main';
import Store from '../../../components/store/Store';
import Button from '../../../components/utilities/Button';
import ConfirmationDialog from '../../../components/utilities/ConfirmationDialog';
import { Input } from '../../../components/utilities/FormComponents';
import {
  getCategories,
  getSocialContact,
  getTopNotice,
} from '../../../data/access/appInfo';
import defstyles from '../../../styles/loja/Defaults.module.scss';
import userstyles from '../../../styles/loja/UserPage.module.scss';
import { validateEmail } from '../../../validation/frontValidation';

const UserPage = ({
  notice,
  categoryList,
  facebookLink,
  instagramLink,
  whatsappLink,
}) => {
  const router = useRouter();

  const emailRef = useRef();
  const [isEmailValid, setIsEmailValid] = useState(true);
  const passwordRef = useRef();
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  // Dialog
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [noButtons, setNoButtons] = useState(false);
  const [onFocus, setOnfocus] = useState(() => () => {});

  const validate = () => {
    let error = false;
    setIsEmailValid(true);
    setIsPasswordValid(true);
    setNoButtons(false);

    // validate email
    if (emailRef.current.value.trim().length <= 0) {
      error = true;
      setDialogMessage('Por favor, digite seu e-mail para entrar.');
    } else if (!validateEmail(emailRef.current.value.trim())) {
      error = true;
      setDialogMessage('Ops, seu email parece estar errado.');
    }
    if (error) {
      setIsEmailValid(false);
      window.scrollTo(0, emailRef.current.offsetTop - 156);
      setOnfocus(() => () => {
        emailRef.current.focus();
      });
      return false;
    }

    // validate password
    if (passwordRef.current.value.length <= 0) {
      error = true;
      setDialogMessage('Por favor, digite sua senha para entrar.');
    }
    if (error) {
      setIsPasswordValid(false);
      window.scrollTo(0, passwordRef.current.offsetTop - 156);
      console.log(passwordRef.current);
      setOnfocus(() => () => {
        passwordRef.current.focus();
      });
      return false;
    }

    return {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
  };

  const login = async (e) => {
    e.preventDefault();
    const client = validate();
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
              'Ops, parece que o usuário ou a senha estão errados! Por favor, tente novamente.'
            );
          } else {
            router.push({ pathname: '/loja/cliente' });
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
          <form
            className={[
              defstyles.flex_center,
              defstyles.flex_column,
              defstyles.width_25rem,
              userstyles.forms,
            ].join(' ')}
            onSubmit={login}
          >
            <h2 className={userstyles.title}>Acesse sua conta</h2>
            <div
              className={[defstyles.w_100, defstyles.marginver_1rem].join(' ')}
            >
              <Input
                id="login_email"
                placeholder="Email"
                ref={emailRef}
                autoFocus={true}
                valid={isEmailValid}
              />
            </div>
            <div
              className={[defstyles.w_100, defstyles.marginver_1rem].join(' ')}
            >
              <Input
                id="login_password"
                placeholder="Senha"
                ref={passwordRef}
                type="password"
                valid={isPasswordValid}
              />
            </div>
            <Button
              type="submit"
              className={[defstyles.marginver_1rem, defstyles.width_8rem].join(
                ' '
              )}
            >
              Entrar
            </Button>
            <p className={defstyles.margin0}>
              {'Ou clique para faser seu '}
              <Link
                href={{
                  pathname: '/loja/cliente/cadastro',
                }}
                passHref
              >
                <a className={defstyles.link}>cadastro!</a>
              </Link>
            </p>
          </form>
        </div>
      </Store>
      <ConfirmationDialog
        show={showDialog}
        onCancel={() => {
          setShowDialog(false);
        }}
        onConfirm={() => {
          setShowDialog(false);
          onFocus();
        }}
        message={dialogMessage}
        noButtons={noButtons}
        fixed
      />
    </Main>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: '/loja/cliente',
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
        // session: session,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}

export default UserPage;
