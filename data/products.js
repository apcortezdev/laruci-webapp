const dummy = {
  abcde: {
    name: 'Produto 01',
    category: 'conjuntos',
    price: 19.9901,
    discount: 10,
    shortDescription: 'Lindo sutiã com bojo meia taça',
    longDescription:
      'Lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha. Llindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha. Llindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha.',
    sets: {
      '#F1F4C4': {
        uniqueSizes: { p: 'P', m: 'M', g: 'G', gg: 'GG', xg: 'XG' },
        specialSizes: [
          {
            name: 'alças',
            sizes: { p: 'P', m: 'M', g: 'G', gg: 'GG', xg: 'XG' },
          },
          {
            name: 'bojo',
            sizes: { p: 'P', m: 'M', g: 'G', gg: 'GG', xg: 'XG' },
          },
          {
            name: 'base',
            sizes: { p: 'P', m: 'M', g: 'G', gg: 'GG', xg: 'XG' },
          },
          {
            name: 'cintura',
            sizes: { p: 'P', m: 'M', g: 'G', gg: 'GG', xg: 'XG' },
          },
        ],
        images: [
          'https://images.unsplash.com/photo-1590474176361-3360c446dd02?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=771&q=80',
        ],
        extraOption: {
          name: 'bojo',
          options: [
            {
              name: 'bolha',
              available: true,
            },
            {
              name: 'liso',
              available: true,
            },
          ],
        },
      },
      '#ea4335': {
        uniqueSizes: { p: 'P', m: 'M' },
        specialSizes: [
          {
            name: 'alças',
            sizes: { p: 'P', m: 'M', g: 'G', gg: 'GG', xg: 'XG' },
          },
          {
            name: 'bojo',
            sizes: { p: 'P', m: 'M', g: 'G', gg: 'GG', xg: 'XG' },
          },
          {
            name: 'base',
            sizes: { p: 'P', m: 'M', g: 'G', gg: 'GG', xg: 'XG' },
          },
          {
            name: 'cintura',
            sizes: { p: 'P', m: 'M', g: 'G', gg: 'GG', xg: 'XG' },
          },
        ],
        images: [
          'https://images.unsplash.com/photo-1583900985737-6d0495555783?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80',
          'https://images.unsplash.com/photo-1590474272631-0d50f6b8bf9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        ],
        extraOption: {
          name: 'bojo',
          options: [
            {
              name: 'bolha',
              available: true,
            },
            {
              name: 'liso',
              available: true,
            },
          ],
        },
      },
    },
  },
};

export function getProductsByCategory(category) {
  return dummy;
}

export function getProductById(id) {
  return dummy[Object.keys(dummy)[0]];
}
