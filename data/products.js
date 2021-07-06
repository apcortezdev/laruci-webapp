import products from './dummyProducts';

export function getProductsByCategory(category) {
    return products;
}

export function getProductById(id) {
    return products[Object.keys(products)[0]];
}