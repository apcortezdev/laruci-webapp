import { useState } from 'react';
import Head from 'next/Head';
import styles from '../../../styles/loja/UserPage.module.scss';
import Main from '../../../components/main/Main';
import Store from '../../../components/store/Store';
import { Input, InputMask } from '../../../components/utilities/FormComponents';
import Button from '../../../components/utilities/Button';
import { getCategoriesJSON } from '../../../data/categories';
import { getCurrentNotice } from '../../../data/notice';

const UserPage = ({ notice, categoryList }) => {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [toggleSignIn, setToggleSignIn] = useState(false);

  const login = (e) => {
    e.preventDefault();
    console.log('login');
  };

  const signin = (e) => {
    e.preventDefault();
    console.log('signin');
  };

  const toggle = (e) => {
    e.preventDefault();
    setToggleSignIn(true);
    setUserId('');
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setPasswordConf('');
  };

  return (
    <Main notice={notice} categoryList={categoryList}>
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
          {toggleSignIn ? (
            <form
              className={[
                styles.flex_center,
                styles.flex_column,
                styles.width_25rem,
              ].join(' ')}
              onSubmit={signin}
            >
              <h2>Cadastro</h2>
              <div className={[styles.w_100, styles.marginver_1rem].join(' ')}>
                <Input
                  id="name"
                  placeholder="Nome Completo"
                  value={name}
                  onChange={(v) => setName(v.target.value)}
                />
              </div>
              <div className={[styles.w_100, styles.marginver_1rem].join(' ')}>
                <InputMask
                  id="cpf"
                  placeholder="CPF"
                  value={userId}
                  onChange={(v) => setUserId(v.target.value)}
                  autoFocus={true}
                  mask={['999.999.999-99']}
                />
              </div>
              <div className={[styles.w_100, styles.marginver_1rem].join(' ')}>
                <Input
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(v) => setEmail(v.target.value)}
                />
              </div>
              <div className={[styles.w_100, styles.marginver_1rem].join(' ')}>
                <Input
                  id="phone"
                  placeholder="Telefone"
                  value={phone}
                  onChange={(v) => setPhone(v.target.value)}
                />
              </div>
              <div className={[styles.w_100, styles.marginver_1rem].join(' ')}>
                <Input
                  id="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(v) => setPassword(v.target.value)}
                  type="password"
                />
              </div>
              <div className={[styles.w_100, styles.marginver_1rem].join(' ')}>
                <Input
                  id="passwordConf"
                  placeholder="Confirmação da senha"
                  value={passwordConf}
                  onChange={(v) => setPasswordConf(v.target.value)}
                  type="password"
                />
              </div>
              <Button
                className={[styles.marginver_1rem, styles.width_8rem].join(' ')}
                type="submit"
              >
                Cadastrar
              </Button>
            </form>
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
                  value={email}
                  onChange={(v) => setEmail(v.target.value)}
                  autoFocus={true}
                />
              </div>
              <div className={[styles.w_100, styles.marginver_1rem].join(' ')}>
                <Input
                  id="login_password"
                  placeholder="Senha"
                  value={password}
                  onChange={(v) => setPassword(v.target.value)}
                  type="password"
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
                <span className={styles.link} onClick={toggle}>
                  cadastro!
                </span>
              </p>
            </form>
          )}
        </div>
      </Store>
    </Main>
  );
};

export async function getStaticProps() {
  const notice = await getCurrentNotice();
  let noticeText = notice ? notice.text : '';

  const categories = await getCategoriesJSON();
  const categoryList = await JSON.parse(categories);

  return {
    props: {
      notice: noticeText,
      categoryList: categoryList,
    },
    revalidate: 86400,
  };
}

export default UserPage;
