import { useRef, useState } from 'react';
import Head from 'next/Head';
import Link from 'next/link';
import styles from '../../../styles/loja/UserPage.module.scss';
import Main from '../../../components/main/Main';
import Store from '../../../components/store/Store';
import { Input } from '../../../components/utilities/FormComponents';
import Button from '../../../components/utilities/Button';
import { getCategoriesJSON } from '../../../data/categories';
import { getCurrentNotice } from '../../../data/notice';
import { getMainSocial } from '../../../data/contact';
import ConfirmationDialog from '../../../components/utilities/ConfirmationDialog';
import { validateEmail } from '../../../utils/validationFront';

const UserPage = ({
  notice,
  categoryList,
  facebookLink,
  instagramLink,
  whatsappLink,
}) => {
  const [toggleConfirm, setToggleConfirm] = useState(false);
  const emailRef = useRef();
  const [isEmailValid, setIsEmailValid] = useState(true);
  const passwordRef = useRef();
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  // Dialog
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // const [cancelText, setCancelText] = useState('');
  // const [okText, setOkText] = useState('');
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client: client }),
      });

      switch (response.status) {
        case 201:
          const data = await response.json();
          setToggleConfirm(true);
          setShowDialog(false);
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
            styles.content,
            styles.flex_center,
            styles.flex_column,
            styles.h_100,
          ].join(' ')}
        >
          {toggleConfirm ? (
            <div></div>
          ) : (
            <form
              className={[
                styles.flex_center,
                styles.flex_column,
                styles.width_25rem,
              ].join(' ')}
              onSubmit={login}
            >
              <h2>Acesse sua conta</h2>
              <div className={[styles.w_100, styles.marginver_1rem].join(' ')}>
                <Input
                  id="login_email"
                  placeholder="Email"
                  ref={emailRef}
                  autoFocus={true}
                  valid={isEmailValid}
                />
              </div>
              <div className={[styles.w_100, styles.marginver_1rem].join(' ')}>
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
                className={[styles.marginver_1rem, styles.width_8rem].join(' ')}
              >
                Entrar
              </Button>
              <p className={styles.margin0}>
                {'Ou clique para faser seu '}
                <Link
                  href={{
                    pathname: '/loja/cliente/cadastro',
                  }}
                  passHref
                >
                  <a className={styles.link}>cadastro!</a>
                </Link>
              </p>
            </form>
          )}
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

export async function getStaticProps() {
  const notice = await getCurrentNotice();
  let noticeText = notice ? notice.text : '';

  const categories = await getCategoriesJSON();
  const categoryList = await JSON.parse(categories);

  const contato = await getMainSocial();
  const facebook = 'https://facebook.com/' + contato[0].facebookName;
  const instagtam = 'https://instagram.com/' + contato[0].instagramName;
  const whatsapp = `https://wa.me/${
    contato[0].whatsappNum
  }?text=${encodeURIComponent(contato[0].whatsappMessage)}`;

  return {
    props: {
      notice: noticeText,
      categoryList: categoryList,
      facebookLink: facebook,
      instagramLink: instagtam,
      whatsappLink: whatsapp,
    },
    revalidate: 86400,
  };
}

export default UserPage;
