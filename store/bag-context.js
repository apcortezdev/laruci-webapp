import { createContext, useState } from 'react';

const BagContext = createContext({
  products: [], // { bagTag, id, name, color, size, qty, price, discount, weight, subtotal }
  qtyItemsInBag: 0,
  total: 0,
  addToBag: function (product) {},
  removeFromBag: function (product) {},
});

export function BagContextProvider(props) {
  const [qtyItemsInBag, setQtyItemsInBag] = useState(0);
  const [productList, setProductList] = useState();
  const [total, setTotal] = useState(0);

  function addToBagHandler(product) {
    setProductList((list) => [...list, product]);
    setQtyItemsInBag((num) => num + product.qty);
    setTotal((tot) => tot + product.subtotal);
  }

  function removeFromBagHandler(product) {
    setProductList((list) => [
      ...list.splice(list.findIndex((p) => p.bagTag === product.bagTag)),
    ]);
    setQtyItemsInBag((num) => num - product.qty);
    setTotal((tot) => tot - product.subtotal);
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
