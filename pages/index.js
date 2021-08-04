const LojaPage = (props) => {
  return <div>Loading...</div>;
};

export async function getStaticProps() {
  return {
    redirect: { destination: '/loja' },
  };
}

export default LojaPage;