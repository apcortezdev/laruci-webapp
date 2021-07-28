const dummyPageInfo = {
  title: 'Laruci',
  description: 'Lingeries feitas sob medida para você!',
  frontpage_banner_slogan: 'O segredo está nas medidas!',
  frontpage_banner_subslogan: 'Cuecas e Lingeries feitas sob medida.',
  domain: 'localhost:3000',
  promoBanners: [
    {
      text: 'Acessórios',
      image:
        'https://images.unsplash.com/photo-1578641915798-950f58b9499c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1054&q=80',
      link: './loja/acessorios',
    },
    {
      text: 'Cuecas',
      image:
        'https://images.unsplash.com/photo-1601393710008-984348f7447b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=616&q=80',
      link: './loja/cuecas',
    },
    {
      text: 'Pijamas',
      image:
        'https://images.unsplash.com/photo-1565128539427-9bd864a64301?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      link: './loja/pijamas',
    },
    {
      text: 'Infantil',
      image:
        'https://images.unsplash.com/photo-1523951778169-4cb35545bfa2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      link: './loja/pijamas',
    },
  ],
};

export async function getPageInfo() {
  return dummyPageInfo;
}
