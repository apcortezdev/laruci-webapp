import { useRouter } from 'next/router';

const LojaPage = (props) => {
  return <div>Loading...</div>;
};

export async function getStaticProps() {
  return {
    redirect: { destination: '/' },
  };
}

export default LojaPage;
