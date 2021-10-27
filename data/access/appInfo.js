const today = new Date();
const appInfo = {
  page: {
    title: 'Laruci',
    description: 'Moda íntima sob medida para você!',
    frontpage_banner_slogan: 'O segredo está nas medidas!',
    frontpage_banner_subslogan: 'Cuecas e Lingeries feitas sob medida.',
    promos: [
      {
        id: 'sec_conjuntos',
        text: 'conjuntos',
        categoryId: '05',
        image: '/images/banners/front/sets.png',
        link: '/conjuntos',
      },
      {
        id: 'sec_pijamas',
        text: 'pijamas',
        categoryId: '03',
        section: '00',
        image: '/images/banners/front/pijamas.png',
        link: '/pijamas',
      },
      {
        id: 'sec_cuecas',
        text: 'cuecas',
        categoryId: '02',
        image: '/images/banners/front/menware.png',
        link: '/cuecas',
      },
      {
        id: 'sec_acessorios',
        text: 'acessórios',
        categoryId: '04',
        image: '/images/banners/front/accessories.png',
        link: '/acessorios',
      },
      {
        id: 'sec_infantil',
        text: 'infantil',
        section: '01',
        image: '/images/banners/front/kids.png',
        link: '/busca',
        query: {
          page: 1,
          term: 'infantil',
        },
      },
    ],
  },
  contact: {
    email: 'oemail@email.com',
    phones: ['1456451223'],
    addressOne: 'Rua das Avenidas, 123',
    addressTwo: 'Bairro Vila Centro',
    addressCep: '19000000',
    city: 'São Cidadão',
    state: 'OP',
  },
  socialContact: {
    facebookName: 'LaruciStoreBauru',
    instagramName: 'larucilingerie',
    whatsappNum: '14999999999',
    whatsappMessage: 'Olá, poderia me ajudar?',
  },
  topNotice: {
    text: 'Mensagem super legal!',
    dateFrom: today,
    dateUntil: new Date(today.getTime() + 24 * 60 * 60 * 1000),
  },
  categories: [
    { _id: '00', name: 'sutiãs' },
    { _id: '01', name: 'calcinhas' },
    { _id: '02', name: 'cuecas' },
    { _id: '03', name: 'pijamas' },
    { _id: '04', name: 'acessórios' },
    { _id: '05', name: 'conjuntos' },
  ],
  sections: [
    { _id: '00', name: 'adulto' },
    { _id: '01', name: 'infantil' },
  ],
  contactMosaic: [
    {
      src: '/images/banners/contato/contato01.png',
      alt: 'Banner página de contato 01',
    },
    {
      src: '/images/banners/contato/contato02.png',
      alt: 'Banner página de contato 02',
    },
    {
      src: '/images/banners/contato/contato03.png',
      alt: 'Banner página de contato 03',
    },
    {
      src: '/images/banners/contato/contato04.png',
      alt: 'Banner página de contato 04',
    },
    {
      src: '/images/banners/contato/contato05.png',
      alt: 'Banner página de contato 05',
    },
    {
      src: '/images/banners/contato/contato06.png',
      alt: 'Banner página de contato 06',
    },
    {
      src: '/images/banners/contato/contato07.png',
      alt: 'Banner página de contato 07',
    },
    {
      src: '/images/banners/contato/contato08.png',
      alt: 'Banner página de contato 08',
    },
  ],
};

export async function getPageInfo() {
  return appInfo.page;
}

export async function getContact() {
  return appInfo.contact;
}

export async function getSocialContact() {
  return appInfo.socialContact;
}

export async function getContactMosaic() {
  return appInfo.contactMosaic;
}

export async function getTopNotice() {
  if (appInfo.topNotice.dateUntil > appInfo.topNotice.dateFrom) {
    return appInfo.topNotice.text;
  }
  return null;
}

export async function getCategories() {
  return appInfo.categories;
}

export async function getCategoryById(_id) {
  return appInfo.categories[parseInt(_id)];
}

export async function getSections() {
  return appInfo.sections;
}

export async function getSectionById(_id) {
  return appInfo.sections[parseInt(_id)];
}
