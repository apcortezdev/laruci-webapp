import Head from 'next/Head';
import { useEffect, useState } from 'react';
import '../styles/globals.scss';

function MyApp(props) {
  const { Component, pageProps } = props;

  const title = 'Laruci';
  const description = 'Lingeries feitas sob medida para você!';
  const domain = 'localhost:3000';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/laruci_logo.ico" />
        <link href={domain} rel="canonical" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
