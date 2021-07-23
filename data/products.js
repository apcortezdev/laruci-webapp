const dummy = {
  abcde: {
    name: 'Produto 01',
    inStock: true,
    category: 'conjuntos',
    price: 19.9901,
    discount: 10,
    weight: 0.5,
    shortDescription: 'Lindo sutiã com bojo meia taça',
    longDescription:
      'Lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha. Llindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha. Llindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha.',
    sets: {
      '#F1F4C4': {
        uniqueSizes: [
          { name: 'M', value: 'M', sizeCm: '5' },
          { name: 'G', value: 'G', sizeCm: '5' },
          { name: 'XG', value: 'XG', sizeCm: '5' },
        ],
        specialSizes: [
          {
            name: 'alças',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'bojo',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'base',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'cintura',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
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
        uniqueSizes: [
          { name: 'M', value: 'M', sizeCm: '5' },
          { name: 'XG', value: 'XG', sizeCm: '5' },
        ],
        specialSizes: [
          {
            name: 'alças',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'bojo',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'base',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'cintura',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
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

export function getListProductsByCategory(category) {
  return dummy;
}

export function getProductById(id) {
  return dummy[Object.keys(dummy)[0]];
}
