import Footer from '../components/main/Footer';
import NoticeBar from '../components/main/NoticeBar';
import Head from 'next/Head';
import ShopBar from '../components/main/ShopBar';
import '../styles/globals.scss';
import { useRouter } from 'next/router';

function MyApp(props) {

  const { Component, pageProps } = props;

  const title = 'Laruci';
  const description = 'Lingeries feitas sob medida para você!';
  const domain = 'localhost:3000';

  // const router = useRouter();
  // console.dir(router.query);

  const adm = false;
  if (adm === true) {
    return <div>ADM</div>;
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/laruci_logo.ico" />
        <link href={domain} rel="canonical" />
      </Head>
      <div className="maingrid">
        <NoticeBar />
        <ShopBar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      test: 'test',
    },
  };
}

export default MyApp;
