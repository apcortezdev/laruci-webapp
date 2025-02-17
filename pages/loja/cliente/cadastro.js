import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/Head';
import { getSession } from 'next-auth/client';
import Main from '../../../components/main/Main';
import Store from '../../../components/store/Store';
import Button from '../../../components/utilities/Button';
import ConfirmationDialog from '../../../components/utilities/ConfirmationDialog';
import { Input, InputMask } from '../../../components/utilities/FormComponents';
import {
  getCategories,
  getSocialContact,
  getTopNotice,
} from '../../../data/access/appInfo';
import defstyles from '../../../styles/loja/Defaults.module.scss';
import userstyles from '../../../styles/loja/UserPage.module.scss';
import {
  validateCPF,
  validateEmail,
  validateIsFullName,
  validateIsValidName,
  validatePasswordLength,
  validatePasswordStrength,
  validatePhone,
} from '../../../validation/frontValidation';

const UserPage = ({
  notice,
  categoryList,
  facebookLink,
  instagramLink,
  whatsappLink,
}) => {
  const [toggleConfirm, setToggleConfirm] = useState(false);
  const router = useRouter();

  const [userCPF, setUserCPF] = useState('');
  const cpfRef = useRef();
  const [isUserCPFValid, setIsUserCPFValid] = useState(true);
  const nameRef = useRef();
  const [isNameValid, setIsNameValid] = useState(true);
  const emailRef = useRef();
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [phone, setPhone] = useState('');
  const phoneRef = useRef();
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const passwordRef = useRef();
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const passwordConfRef = useRef();
  const [isPasswordConfValid, setIsPasswordConfValid] = useState(true);

  // Dialog
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [noButtons, setNoButtons] = useState(false);
  const [onFocus, setOnfocus] = useState(() => () => {});

  const validate = () => {
    let error = false;
    setIsUserCPFValid(true);
    setIsNameValid(true);
    setIsEmailValid(true);
    setIsPhoneValid(true);
    setIsPasswordValid(true);
    setIsPasswordConfValid(true);
    setNoButtons(false);

    // validate name
    if (nameRef.current.value.trim().length <= 0) {
      error = true;
      setDialogMessage('Desculpe, mas o campo Nome é obrigatório.');
    } else if (!validateIsFullName(nameRef.current.value.trim())) {
      error = true;
      setDialogMessage('Por favor, digite o nome completo.');
    } else if (!validateIsValidName(nameRef.current.value.trim())) {
      error = true;
      setDialogMessage('Ops, há algo de errado no campo Nome.');
    }
    if (error) {
      setIsNameValid(false);
      window.scrollTo(0, nameRef.current.offsetTop - 156);
      setOnfocus(() => () => {
        nameRef.current.focus();
      });
      return false;
    }

    // validate email
    if (emailRef.current.value.trim().length <= 0) {
      error = true;
      setDialogMessage('Desculpe, mas o campo Email é obrigatório.');
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

    // validate CPF
    if (userCPF.length <= 0) {
      error = true;
      setDialogMessage('Desculpe, mas o campo CPF é obrigatório.');
    } else if (!validateCPF(userCPF)) {
      error = true;
      setDialogMessage('Ops, há algo de errado no campo CPF.');
    }
    if (error) {
      setIsUserCPFValid(false);
      window.scrollTo(0, cpfRef.current.offsetTop - 156);
      setOnfocus(() => () => {
        cpfRef.current.firstElementChild.firstChild.focus();
      });
      return false;
    }

    // validate phone
    if (!validatePhone(phone)) {
      setIsPhoneValid(false);
      setDialogMessage('Ops, há algo de errado no campo Telefone.');
      window.scrollTo(0, phoneRef.current.offsetTop - 156);
      setOnfocus(() => () => {
        phoneRef.current.firstElementChild.firstChild.focus();
      });
      return false;
    }

    // validate password
    if (!validatePasswordLength(passwordRef.current.value)) {
      error = true;
      setDialogMessage('Sua senha deve ter no mínimo 8 caracteres!');
    } else if (!validatePasswordStrength(passwordRef.current.value)) {
      error = true;
      setDialogMessage(
        'Por favor, escolha uma senha que contenha letras e números!'
      );
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

    // validate password confirmation
    if (passwordRef.current.value !== passwordConfRef.current.value) {
      setIsPasswordConfValid(false);
      setDialogMessage(
        'Opa, a senha e a confirmação da senha estão diferentes!'
      );
      window.scrollTo(0, passwordConfRef.current.offsetTop - 156);
      return false;
    }

    return {
      name: nameRef.current.value,
      email: emailRef.current.value,
      cpf: userCPF,
      phone: phone,
      password: passwordRef.current.value,
      passwordConf: passwordConfRef.current.value,
    };
  };

  const signup = async (e) => {
    e.preventDefault();
    const client = validate();
    if (!client) {
      setShowDialog(true);
    } else {
      setOnfocus(() => () => {});
      setNoButtons(true);
      setShowDialog(true);
      setDialogMessage('carregando ...');
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client: client }),
      });

      switch (response.status) {
        case 201:
          const data = await response.json();
          setToggleConfirm(true);
          setShowDialog(false);
          break;
        case 400:
          setNoButtons(false);
          setDialogMessage(
            'Ops, esse email já está cadastrado. Use a opção de recuperação de senha caso não consiga logar!'
          );
          setIsEmailValid(false);
          window.scrollTo(0, emailRef.current.offsetTop - 156);
          setOnfocus(() => () => {
            emailRef.current.focus();
          });
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
            userstyles.forms,
          ].join(' ')}
        >
          {toggleConfirm ? (
            <div className={userstyles.signinConfirmation}>
              <p>
                Tudo pronto! Agora, só verificar seu e-mail para confirmar o
                cadastro e começar a comprar!
              </p>
              <Button
                className={[
                  defstyles.marginver_1rem,
                  defstyles.width_12rem,
                ].join(' ')}
                onClick={() =>
                  router.push({ pathname: '/loja/cliente/entrar' })
                }
              >
                Ir para o Login
              </Button>
            </div>
          ) : (
            <form
              className={[
                defstyles.flex_center,
                defstyles.flex_column,
                defstyles.width_25rem,
              ].join(' ')}
              onSubmit={signup}
            >
              <h2>Cadastro</h2>
              <div
                className={[defstyles.w_100, defstyles.marginver_1rem].join(
                  ' '
                )}
              >
                <Input
                  ref={nameRef}
                  id="name"
                  placeholder="Nome Completo"
                  autoFocus={true}
                  valid={isNameValid}
                />
              </div>
              <div
                className={[defstyles.w_100, defstyles.marginver_1rem].join(
                  ' '
                )}
              >
                <Input
                  id="email"
                  placeholder="Email"
                  ref={emailRef}
                  valid={isEmailValid}
                />
              </div>
              <div
                ref={cpfRef}
                className={[defstyles.w_100, defstyles.marginver_1rem].join(
                  ' '
                )}
              >
                <InputMask
                  id="cpf"
                  placeholder="CPF"
                  value={userCPF}
                  onChange={(v) => setUserCPF(v.target.value)}
                  valid={isUserCPFValid}
                  mask={['999.999.999-99']}
                />
              </div>
              <div
                ref={phoneRef}
                className={[defstyles.w_100, defstyles.marginver_1rem].join(
                  ' '
                )}
              >
                <InputMask
                  id="phone"
                  placeholder="Telefone"
                  value={phone}
                  onChange={(v) => setPhone(v.target.value)}
                  valid={isPhoneValid}
                  mask={['(99) 9999-9999', '(99) 9 9999-9999']}
                />
              </div>
              <div
                className={[defstyles.w_100, defstyles.marginver_1rem].join(
                  ' '
                )}
              >
                <Input
                  id="password"
                  ref={passwordRef}
                  type="password"
                  valid={isPasswordValid}
                  placeholder="Senha"
                />
              </div>
              <div
                className={[defstyles.w_100, defstyles.marginver_1rem].join(
                  ' '
                )}
              >
                <Input
                  id="passwordConf"
                  placeholder="Confirmação da senha"
                  ref={passwordConfRef}
                  type="password"
                  valid={isPasswordConfValid}
                />
              </div>
              <Button
                className={[
                  defstyles.marginver_1rem,
                  defstyles.width_8rem,
                ].join(' ')}
                type="submit"
              >
                Cadastrar
              </Button>
            </form>
          )}
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
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}

export default UserPage;
