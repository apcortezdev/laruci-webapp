const dummySellers = {
    vendor001: {
        id: '123456',
        name: 'Dolores Fuertes do Rego',
        state: 'sp',
        city: 'Tangamandápio',
        phone: ['1932356632'],
        // addressOne: 'Rua das Xanaúbas, 514',
        // addressTwo: 'Bairro do Gordo',
    },
};


export function getSellers() {
    return dummySellers;
}