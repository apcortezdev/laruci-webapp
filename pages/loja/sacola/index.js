import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../../styles/loja/BagPage.module.scss';
import BagContext from '../../../store/bag-context';
import Button from '../../../components/utilities/Button';
import ShipmentCalc from '../../../components/ShipmentCalc';

// function objToString(obj) {
//   let text = '';
//   for (const key in obj) {
//     if (Object.hasOwnProperty.call(obj, key)) {
//       if (text !== '')
//         text = text + ', ' + obj[key].name + ': ' + obj[key].value;
//       else text = text + obj[key].name + ': ' + obj[key].value;
//     }
//   }
//   return text;
// }

const ItemsResume = ({
  products,
  onAddProduct,
  onRemoveProduct,
  onDeleteProduct,
}) => {

  let html = [];

  for (const key in products) {
    if (Object.hasOwnProperty.call(products, key)) {
      const element = products[key];
      html.push(
        <div key={key} className={styles.itemsResume_card}>
          <div className={styles.itemsResume_image}>
            <Image
              src={products.image || '/laruci_logo.png'}
              alt={`Resumo de compra item ${key}`}
              width={200}
              height={200}
              loading="lazy"
              objectFit="cover"
            />
          </div>
          <div className={styles.itemsResume_details}>
            <div className={styles.title}>
              <b>{element.name}</b>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  className={styles.icon}
                  viewBox="0 0 16 16"
                  onClick={() => onDeleteProduct(products[key])}
                >
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                  <path
                    fillRule="evenodd"
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                  />
                </svg>
              </span>
            </div>
            <div className={styles.options}>
              <span>
                <p>
                  <b>cor: </b>
                  {element.color}
                </p>
                <p>
                  <b>tamanho: </b>
                  {objToString(element.size)}
                </p>
                <p>
                  <b>opções: </b>
                  {objToString(element.extraOptions)}
                </p>
              </span>
              <span>
                <p>
                  <b>preço unit.: </b>R$ {element.price}
                </p>
                <p>
                  <b>descontos: </b>
                  {element.discountPercent > 0
                    ? element.discountPercent + '%'
                    : '-'}
                </p>
                <p>
                  <b>subtotal: </b>R$ {element.subtotalFinalPrice}
                </p>
              </span>
              <span>
                <span className={styles.qty_selector}>
                  <b>quantidade: </b>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      className={styles.icon}
                      viewBox="0 0 16 16"
                      onClick={() => onRemoveProduct(products[key])}
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z" />
                    </svg>
                    <span>{element.quantity}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      className={styles.icon}
                      viewBox="0 0 16 16"
                      onClick={() => onAddProduct(products[key])}
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                    </svg>
                  </div>
                </span>
              </span>
            </div>
          </div>
        </div>
      );
    }
  }

  return <div>{html}</div>;
};

const BagPage = () => {
  const context = useContext(BagContext);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const loadProducts = (prods) => {
  //     setIsLoading(true);
  //     let list = [];
  //     for (const key in prods) {
  //       if (Object.hasOwnProperty.call(prods, key)) {
  //         list.push(prods[key].prodId);
  //       }
  //     }  
  //     fetch('/api/bag', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ list : list }),
  //     })
  //     .then(res => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       setThumbList(data.productsTumbs);
  //       setIsLoading(false);
  //     })
  //     .catch(err => console.log(err)); // REVIEW
  //   }
  //   if (context.bag.qtyItemsInBag > 0 && context.bag.load) {
  //     loadProducts(context.bag.products);
  //   }
  // }, [context.bag]);

  const onGoToPayment = (event) => {
    event.preventDefault();
  };

  const onAddProduct = (product) => {
    product.quantity = 1;
    const prodToAdd = {
      prodId: product.prodId,
      name: product.name,
      color: product.color,
      size: product.size,
      extraOptions: product.extraOptions,
      price: product.price,
      discountPercent: product.discountPercent,
      weight: product.weight,
      quantity: 1,
    };
    context.addToBag(prodToAdd);
  };

  const onRemoveProduct = (product) => {};

  const onDeleteProduct = (product) => {};

  // if (isLoading) {
  //   return (
  //     <div className={[styles.container, styles.empty].join(' ')}>
  //       <h1 className={styles.empty_message}>Carregando...</h1>
  //     </div>
  //   );
  // }

  // if (context.bag.qtyItemsInBag <= 0) {
  //   return (
  //     <div className={[styles.container, styles.empty].join(' ')}>
  //       <h1 className={styles.empty_message}>Sua Sacola está vazia!</h1>
  //       <Link
  //         href={{
  //           pathname: '/',
  //         }}
  //       >
  //         <a>Ir para as compras</a>
  //       </Link>
  //     </div>
  //   );
  // }

  return (
    <div className={styles.container}>
      <section className={[styles.section, styles.header].join(' ')}>
        <Button className={styles.button} onClick={onGoToPayment}>
          Ir para pagamento
        </Button>
        <span>
          <h1>Sacola</h1>
          <h3>{`(${context.bag.qtyItemsInBag} ${
            context.bag.qtyItemsInBag === 1 ? 'item' : 'itens'
          })`}</h3>
        </span>
      </section>
      <section
        className={[styles.section, styles.row, styles.divisionLine].join(' ')}
      >
        <ShipmentCalc weight={context.bag.totalWeight} />
      </section>
      <section
        className={[styles.section, styles.divisionLine, styles.baseline].join(
          ' '
        )}
      >
        <h1>Resumo</h1>
        <span className={styles.totalbox}>
          {context.bag.totalDiscounts !== 0 ? (
            <span>
              <h3>Descontos:</h3>
              <h3>R$ {context.bag.totalDiscounts}</h3>
            </span>
          ) : (
            ''
          )}
          <span>
            <h3>Total:</h3>
            <h3 className={styles.primary}>
              R$ {context.bag.totalFinalPrice}
            </h3>
          </span>
        </span>
      </section>
      <section className={styles.resume}>
        {/* <ItemsResume
          products={context.bag.products}
          onAddProduct={onAddProduct}
          onRemoveProduct={onRemoveProduct}
          onDeleteProduct={onDeleteProduct}
        /> */}
      </section>
    </div>
  );
};

export default BagPage;



// import { createContext, useEffect, useState } from 'react';
// import { useCookies } from 'react-cookie';

// const BagContext = createContext({
//   bag: {
//     products: {},
//     qtyItemsInBag: 0,
//     totalWeight: 0,
//     totalDiscounts: 0,
//     totalFullPrice: 0,
//     totalFinalPrice: 0,
//   },
//   addToBag: function (product) {},
//   removeFromBag: function (product) {},
// });

// export function BagContextProvider(props) {
//   const [cookies, setCookie, removeCookie] = useCookies(['laruciBag']);

//   const [productList, setProductList] = useState({});
//   const [qtyItemsInBag, setQtyItemsInBag] = useState(0);
//   const [totalWeight, setTotalWeight] = useState(0);
//   const [totalDiscounts, setTotalDiscounts] = useState(0);
//   const [totalFullPrice, setTotalFullPrice] = useState(0);
//   const [totalFinalPrice, setTotalFinalPrice] = useState(0);

//   useEffect(() => {
//     //recover cookie

//     const cookie = cookies.laruciBag;

//     console.log(cookie);

//     // let qtyItemsInBag;
//     // let totalWeight;
//     // let totalDiscounts;
//     // let totalFullPrice;
//     // let totalFinalPrice;

//     // for (const iterator of cookie) {
//     // }

//     // if (cookie) {
//     //   setProductList(cookie.p);
//     //   setQtyItemsInBag(cookie.q);
//     //   setTotalDiscounts(cookie.d);
//     //   setTotalWeight(cookie.w);
//     //   setTotalFullPrice(cookie.f);
//     //   setTotalFinalPrice(cookie.t);
//     // }
//   }, []);

//   function saveCookie(products) {
//     let cookie = [];

//     for (const key in products) {
//       if (Object.hasOwnProperty.call(products, key)) {
//         const element = products[key];
//         cookie.push({
//           id: element.prodId,
//           cl: element.colorId,
//           sz: element.size,
//           ex: element.extraOptions,
//           qt: element.quantity,
//         });
//       }
//     }

//     let expiration = new Date();
//     setCookie('laruciBag', cookie, {
//       expires: new Date(expiration.setTime(expiration.getTime() + 3 * 3600000)),
//       path: '/loja',
//       sameSite: 'strict',
//     });
//   }

//   function addToBagHandler(prodToBag) {

//     // product: product,
//     // selectedSet: selectedSet._id,
//     // selectedSizes: selectedSizes,
//     // selectedExtras: selectedExtras,
//     // quantity: quantity,


//     const discount = product.price * (product.discountPercent / 100);
//     const subtotalDiscounts = discount * product.quantity;
//     const subtotalFullPrice = product.price * product.quantity;
//     const subtotalFinalPrice = subtotalFullPrice - subtotalDiscounts;
//     const subtotalWeight = product.weight * product.quantity;

//     let products = {};

//     if (!!productList[key]) {
//       products = {
//         ...productList,
//         [key]: {
//           ...productList[key],
//           quantity: productList[key].quantity + product.quantity,
//           subtotalDiscounts:
//             productList[key].subtotalDiscounts + subtotalDiscounts,
//           subtotalFullPrice:
//             productList[key].subtotalFullPrice + subtotalFullPrice,
//           subtotalFinalPrice:
//             productList[key].subtotalFinalPrice + subtotalFinalPrice,
//           subtotalWeight: productList[key].subtotalWeight + subtotalWeight,
//         },
//       };
//     } else {
//       const newProduct = {
//         subtotalDiscounts: subtotalDiscounts,
//         subtotalFullPrice: subtotalFullPrice,
//         subtotalFinalPrice: subtotalFinalPrice,
//         subtotalWeight: subtotalWeight,
//         ...product,
//       };
//       products = { ...productList, [key]: newProduct };
//     }

//     setProductList(products);
//     setQtyItemsInBag((v) => v + product.quantity);
//     setTotalDiscounts((v) => v + subtotalDiscounts);
//     setTotalWeight((v) => v + subtotalWeight);
//     setTotalFullPrice((v) => v + subtotalFullPrice);
//     setTotalFinalPrice((v) => v + subtotalFinalPrice);

//     saveCookie(products);
//   }

//   function removeFromBagHandler(key) {
//     // setProductList(list => {
//     //   const {[prodBagId]: _, ...newList} = list;
//     //   return newList;
//     // });
//     // setQtyItemsInBag((num) => num - product.qty);
//     // setTotal((tot) => tot - product.subtotal);
//   }

//   const context = {
//     bag: {
//       products: productList,
//       qtyItemsInBag: qtyItemsInBag,
//       totalWeight: totalWeight,
//       totalDiscounts: totalDiscounts.toFixed(2),
//       totalFullPrice: totalFullPrice.toFixed(2),
//       totalFinalPrice: totalFinalPrice.toFixed(2),
//     },
//     addToBag: addToBagHandler,
//     removeFromBag: removeFromBagHandler,
//   };

//   return (
//     <BagContext.Provider value={context}>{props.children}</BagContext.Provider>
//   );
// }

// export default BagContext;

