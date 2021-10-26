import Head from 'next/Head';
import { BagContextProvider } from '../store/bag-context';
import { useRouter } from 'next/router';
import '../styles/globals.scss';

import { CookiesProvider } from 'react-cookie';
import { Provider } from 'next-auth/client';

function Laruci(props) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  const router = useRouter();
  
  let page;
  if (router.pathname.startsWith('/loja')) {
    page = (
      <Provider session={session}>
        <CookiesProvider>
          <BagContextProvider>
            <Component {...pageProps} />
          </BagContextProvider>
        </CookiesProvider>
      </Provider>
    );
  } else {
    page = <Component {...pageProps} />;
  }

  return (
    <>
      <Head>
        <title>{process.env.MAIN_TITLE}</title>
        <meta name="description" content={process.env.MAIN_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/laruci_lg.ico" />
        <link href={process.env.MAIN_DOMAIN} rel="canonical" />
      </Head>
      {page}
    </>
  );
}

export default Laruci;
