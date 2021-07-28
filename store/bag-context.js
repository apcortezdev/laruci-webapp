import { createContext, useState } from 'react';

const BagContext = createContext({
  products: {}, // { bagTag, id, name, color, size, qty, price, discount, weight, subtotal }
  qtyItemsInBag: 0,
  total: 0,
  addToBag: function (product) {},
  removeFromBag: function (product) {},
});

export function BagContextProvider(props) {
  const [qtyItemsInBag, setQtyItemsInBag] = useState(0);
  const [productList, setProductList] = useState({});
  const [total, setTotal] = useState(0);

  function validateOptions(prod) {

  }

  function addToBagHandler(product) {
    let prodBagId = JSON.stringify(product);
    const newProduct = {
      prodBagId: prodBagId,
      subtotal: product.price * product.quantity,
      ...product
    }
    setProductList(list => ({ ...list, [prodBagId]: newProduct }));
    // setQtyItemsInBag((num) => num + product.qty);
    // setTotal((tot) => tot + product.subtotal);
  }

  function removeFromBagHandler(prodBagId) {
    setProductList(list => {
      const {[prodBagId]: _, ...newList} = list;
      return newList;
    });
    // setQtyItemsInBag((num) => num - product.qty);
    // setTotal((tot) => tot - product.subtotal);
  }

  const context = {
    products: productList,
    qtyItemsInBag: qtyItemsInBag,
    total: total,
    addToBag: addToBagHandler,
    removeFromBag: removeFromBagHandler,
  };

  return (
    <BagContext.Provider value={context}>{props.children}</BagContext.Provider>
  );
}

export default BagContext;
