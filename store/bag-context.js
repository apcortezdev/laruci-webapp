import { createContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const BagContext = createContext({
  bag: {
    products: [],
  },
  addToBag: function (product) {},
  removeFromBag: function (product) {},
});

export function BagContextProvider(props) {
  const [cookies, setCookie, removeCookie] = useCookies(['laruciBag']);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    //recover cookie

    const cookie = cookies.laruciBag;

    console.log(cookie);

    // for (const iterator of cookie) {
    // }

    // if (cookie) {
    //   setProductList(cookie.p);
    // }
  }, []);

  function saveCookie(bag) {
    let cookie = [];
    bag.forEach((prodToBag) => {
      const sz =
      prodToBag.selectedSizes.length > 0
          ? prodToBag.selectedSizes.map((size) => ({
              i: size._id,
              u: size.isUnique ? 1 : 0,
              v: size.selected,
            }))
          : [];
      const p = {
        id: prodToBag.id,
        st: prodToBag.selectedSet,
        sz: sz,
        ex: prodToBag.selectedExtras,
        qt: prodToBag.quantity,
      };
      cookie.push(p);
    });

    let expiration = new Date();
    setCookie('laruciBag', cookie, {
      expires: new Date(expiration.setTime(expiration.getTime() + 3 * 3600000)),
      path: '/loja',
      sameSite: 'strict',
    });
  }

  function addToBagHandler(prodToBag) {
    // look for prod in the bag
    const bag = [...productList];
    const index = bag.find(
      (product) =>
        product.id === prodToBag.productId &&
        product.selectedSet === prodToBag.selectedSet &&
        product.selectedSizes === prodToBag.selectedSizes &&
        product.selectedExtras === prodToBag.selectedExtras &&
        product.quantity === prodToBag.quantity
    );

    if (index >= 0) {
      // add quantity to existing prod in bag
      bag[index] ===
        {
          id: newList[index].productId,
          selectedSet: newList[index].selectedSet,
          selectedSizes: newList[index].selectedSizes,
          selectedExtras: newList[index].selectedExtras,
          quantity: newList[index].quantity + prodToBag.quantity,
        };
    } else {
      // add new prod to bag
      bag.push(
        {
          id: prodToBag.productId,
          selectedSet: prodToBag.selectedSet,
          selectedSizes: prodToBag.selectedSizes,
          selectedExtras: prodToBag.selectedExtras,
          quantity: prodToBag.quantity,
        },
      )
    }

    setProductList(bag);
    saveCookie(bag);
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
    bag: {
      products: productList,
    },
    addToBag: addToBagHandler,
    removeFromBag: removeFromBagHandler,
  };

  return (
    <BagContext.Provider value={context}>{props.children}</BagContext.Provider>
  );
}

export default BagContext;
