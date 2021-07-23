const dummyContactInfo = {
  email: 'contato@laruci.com.br',
  phoneSac: ['551432182634', '08004057687', '30045566'],
  facebookName: 'LaruciStoreBauru',
  instagramName: 'larucilingerie',
  whatsappNum: '5514997157687',
  whatsappTemplateMessage:
    'Bom dia, estou entrando em contato depois de visitar seu site. Poderia me ajudar?',
  addressOne: 'Rua Jacinto Pinto Aquino Rego',
  addressTwo: 'Lazanha-SP',
  addressCep: '50005-505',
  mosaic: [
    {
      src: 'https://images.unsplash.com/photo-1601605496942-9d6e7a81fc39?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      width: 634,
      height: 951,
    },
    {
      src: 'https://images.unsplash.com/photo-1626213216833-63ef82d1d18d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80',
      width: 634,
      height: 951,
    },
    {
      src: 'https://images.unsplash.com/photo-1592318324785-c41691d2e773?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      width: 634,
      height: 951,
    },
    {
      src: 'https://images.unsplash.com/photo-1561375958-10610c9b9e5d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80',
      width: 700,
      height: 875,
    },
    {
      src: 'https://images.unsplash.com/photo-1625646905820-417189385210?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=596&q=80',
      width: 596,
      height: 1000,
    },
    {
      src: 'https://images.unsplash.com/photo-1590021715678-acf5f9755ec6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80',
      width: 700,
      height: 875,
    },
  ],
};

export async function getFullContactInfo() {
  return dummyContactInfo;
}
