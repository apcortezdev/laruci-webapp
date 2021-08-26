import Head from 'next/Head';
import Main from '../components/main/Main';
import Store from '../components/store/Store';
import { BagContextProvider } from '../store/bag-context';
import { useRouter } from 'next/router';
// import { getNotice } from '../data/notice';
import { useEffect, useState } from 'react';
import '../styles/globals.scss';
import { CookiesProvider } from 'react-cookie';

function MyApp(props) {
  const { Component, pageProps } = props;

  const router = useRouter();

  const title = 'Laruci';
  const description = 'Lingeries feitas sob medida para você!';
  const domain = 'localhost:3000';

  const [notice, setNotice] = useState('');

  useEffect(() => {
    // (async () => {
    //   const dataNotice = await getNotice();
    //   if (dataNotice) {
    //     setNotice(dataNotice.text);
    //   }
    // })();
  }, []);

  let page;
  if (router.pathname.startsWith('/loja')) {
    page = (
      <CookiesProvider>
        <BagContextProvider>
          <Component {...pageProps} />
        </BagContextProvider>
      </CookiesProvider>
    );
  } else {
    page = <Component {...pageProps} />;
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/laruci_lg.ico" />
        <link href={domain} rel="canonical" />
      </Head>
      {page}
    </>
  );
}

export default MyApp;
