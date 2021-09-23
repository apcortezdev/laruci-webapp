const dummyPageInfo = {
  title: 'Laruci',
  description: 'Moda íntima sob medida para você!',
  frontpage_banner_slogan: 'O segredo está nas medidas!',
  frontpage_banner_subslogan: 'Cuecas e Lingeries feitas sob medida.',
  domain: 'localhost:3000',
  promos: [
    {
      id: 'sec_conjuntos',
      text: 'conjuntos',
      categoryId: '610be9170c9efc1504511c7a',
      image: '/images/banners/front/sets.png',
      link: '/conjuntos',
    },
    {
      id: 'sec_pijamas',
      text: 'pijamas',
      categoryId: '610be91e0c9efc1504511c7c',
      image: '/images/banners/front/pijamas.png',
      link: '/pijamas',
    },
    {
      id: 'sec_cuecas',
      text: 'cuecas',
      categoryId: '610be9240c9efc1504511c7e',
      image: '/images/banners/front/menware.png',
      link: '/cuecas',
    },
    {
      id: 'sec_acessorios',
      text: 'acessórios',
      categoryId: '610be92a0c9efc1504511c80',
      image: '/images/banners/front/accessories.png',
      link: '/acessorios',
    },
    {
      id: 'sec_infantil',
      text: 'infantil',
      section: '610be9b70c9efc1504511c94',
      image: '/images/banners/front/kids.png',
      link: '/busca',
      query: {
        page: 1,
        term: 'infantil',
      },
    },
  ],
};

export async function getPageInfo() {
  return dummyPageInfo;
}
