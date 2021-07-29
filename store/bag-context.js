import { createContext, useState } from 'react';

const BagContext = createContext({
  products: {},

  qtyItemsInBag: 0,
  totalWeight: 0,
  totalDiscounts: 0,
  totalFullPrice: 0,
  totalFinalPrice: 0,
  addToBag: function (product) {},
  removeFromBag: function (product) {},
});

function objToString(obj) {
  let text = '';
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      text = text + key + obj[key].value;
    }
  }
  return text;
}

export function BagContextProvider(props) {
  const [productList, setProductList] = useState({});
  const [qtyItemsInBag, setQtyItemsInBag] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalDiscounts, setTotalDiscounts] = useState(0);
  const [totalFullPrice, setTotalFullPrice] = useState(0);
  const [totalFinalPrice, setTotalFinalPrice] = useState(0);

  function addToBagHandler(product) {
    // Create string w/ prod options as key
    const key =
      product.prodId +
      product.color +
      objToString(product.size) +
      objToString(product.extraOptions);

    const discount = product.price * (product.discountPercent / 100);
    const subtotalDiscounts = discount * product.quantity;
    const subtotalFullPrice = product.price * product.quantity;
    const subtotalFinalPrice = subtotalFullPrice - subtotalDiscounts;
    const subtotalWeight = product.weight * product.quantity;

    if (!!productList[key]) {
      setProductList((list) => ({
        [key]: {
          ...list[key],
          quantity: list[key].quantity + product.quantity,
          subtotalDiscounts: list[key].subtotalDiscounts + subtotalDiscounts,
          subtotalFullPrice: list[key].subtotalFullPrice + subtotalFullPrice,
          subtotalFinalPrice: list[key].subtotalFinalPrice + subtotalFinalPrice,
          subtotalWeight: list[key].subtotalWeight + subtotalWeight,
        },
        ...list,
      }));
    } else {
      const newProduct = {
        subtotalDiscounts: subtotalDiscounts,
        subtotalFullPrice: subtotalFullPrice,
        subtotalFinalPrice: subtotalFinalPrice,
        subtotalWeight: subtotalWeight,
        ...product,
      };
      setProductList((list) => ({ [key]: newProduct, ...list }));
    }

    setTotalDiscounts((d) => d + subtotalDiscounts);
    setTotalFullPrice((tot) => tot + subtotalFullPrice);
    setTotalFinalPrice((tot) => tot + subtotalFinalPrice);

    setQtyItemsInBag((num) => num + product.quantity);
    setTotalWeight((w) => w + subtotalWeight);
  }

  function removeFromBagHandler(key) {
    // setProductList(list => {
    //   const {[prodBagId]: _, ...newList} = list;
    //   return newList;
    // });
    // setQtyItemsInBag((num) => num - product.qty);
    // setTotal((tot) => tot - product.subtotal);
  }

  const context = {
    products: productList,
    qtyItemsInBag: qtyItemsInBag,
    totalWeight: totalWeight,
    totalDiscounts: totalDiscounts,
    totalFullPrice: totalFullPrice,
    totalFinalPrice: totalFinalPrice,
    addToBag: addToBagHandler,
    removeFromBag: removeFromBagHandler,
  };

  return (
    <BagContext.Provider value={context}>{props.children}</BagContext.Provider>
  );
}

export default BagContext;
