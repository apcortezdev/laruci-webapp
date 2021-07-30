import { createContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const BagContext = createContext({
  bag: {
    products: {},
    qtyItemsInBag: 0,
    totalWeight: 0,
    totalDiscounts: 0,
    totalFullPrice: 0,
    totalFinalPrice: 0,
  },
  addToBag: function (product) {},
  removeFromBag: function (product) {},
});

function objToString(obj) {
  let text = '';
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      text = text + key + obj[key];
    }
  }
  return text;
}

export function BagContextProvider(props) {
  const [cookies, setCookie, removeCookie] = useCookies(['laruciBag']);

  const [productList, setProductList] = useState({});
  const [qtyItemsInBag, setQtyItemsInBag] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalDiscounts, setTotalDiscounts] = useState(0);
  const [totalFullPrice, setTotalFullPrice] = useState(0);
  const [totalFinalPrice, setTotalFinalPrice] = useState(0);

  useEffect(() => {
    //recover cookie
    const cookie = cookies.laruciBag;

    console.log(cookie)

    // let qtyItemsInBag;
    // let totalWeight;
    // let totalDiscounts;
    // let totalFullPrice;
    // let totalFinalPrice;

    // for (const iterator of cookie) {
    // }

    // if (cookie) {
    //   setProductList(cookie.p);
    //   setQtyItemsInBag(cookie.q);
    //   setTotalDiscounts(cookie.d);
    //   setTotalWeight(cookie.w);
    //   setTotalFullPrice(cookie.f);
    //   setTotalFinalPrice(cookie.t);
    // }
  }, []);

  function saveCookie(products) {
    let cookie = [];

    for (const key in products) {
      if (Object.hasOwnProperty.call(products, key)) {
        const element = products[key];
        cookie.push({
          id: element.prodId,
          cl: element.colorId,
          sz: element.size,
          ex: element.extraOptions,
          qt: element.quantity,
        });
      }
    }

    let expiration = new Date();
    setCookie('laruciBag', cookie, {
      expires: new Date(expiration.setTime(expiration.getTime() + 3 * 3600000)),
      path: '/loja',
      sameSite: 'strict',
    });
  }

  function addToBagHandler(product) {
    // Create string w/ prod options as key
    const key =
      product.prodId +
      product.colorId +
      objToString(product.size) +
      objToString(product.extraOptions);

    const discount = product.price * (product.discountPercent / 100);
    const subtotalDiscounts = discount * product.quantity;
    const subtotalFullPrice = product.price * product.quantity;
    const subtotalFinalPrice = subtotalFullPrice - subtotalDiscounts;
    const subtotalWeight = product.weight * product.quantity;

    let products = {};

    if (!!productList[key]) {
      products = {
        ...productList,
        [key]: {
          ...productList[key],
          quantity: productList[key].quantity + product.quantity,
          subtotalDiscounts:
            productList[key].subtotalDiscounts + subtotalDiscounts,
          subtotalFullPrice:
            productList[key].subtotalFullPrice + subtotalFullPrice,
          subtotalFinalPrice:
            productList[key].subtotalFinalPrice + subtotalFinalPrice,
          subtotalWeight: productList[key].subtotalWeight + subtotalWeight,
        },
      };
    } else {
      const newProduct = {
        subtotalDiscounts: subtotalDiscounts,
        subtotalFullPrice: subtotalFullPrice,
        subtotalFinalPrice: subtotalFinalPrice,
        subtotalWeight: subtotalWeight,
        ...product,
      };
      products = { ...productList, [key]: newProduct };
    }

    setProductList(products);
    setQtyItemsInBag((v) => v + product.quantity);
    setTotalDiscounts((v) => v + subtotalDiscounts);
    setTotalWeight((v) => v + subtotalWeight);
    setTotalFullPrice((v) => v + subtotalFullPrice);
    setTotalFinalPrice((v) => v + subtotalFinalPrice);

    saveCookie(products);
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
      qtyItemsInBag: qtyItemsInBag,
      totalWeight: totalWeight,
      totalDiscounts: totalDiscounts.toFixed(2),
      totalFullPrice: totalFullPrice.toFixed(2),
      totalFinalPrice: totalFinalPrice.toFixed(2),
    },
    addToBag: addToBagHandler,
    removeFromBag: removeFromBagHandler,
  };

  return (
    <BagContext.Provider value={context}>{props.children}</BagContext.Provider>
  );
}

export default BagContext;
