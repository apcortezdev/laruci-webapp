import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/Head';
import BagContext from '../../../store/bag-context';
import Button from '../../../components/utilities/Button';
import ShipmentCalc from '../../../components/ShipmentCalc';
import Main from '../../../components/main/Main';
import ConfirmationDialog from '../../../components/utilities/ConfirmationDialog';
import styles from '../../../styles/loja/BagPage.module.scss';

import { getCategoriesJSON } from '../../../data/categories';
import { getCurrentNotice } from '../../../data/notice';
import { getBagItems } from '../../../data/bag';

const BagPage = ({ title, canonical, notice, categoryList, items }) => {
  // Dialog
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [cancelText, setCancelText] = useState('');
  const [okText, setOkText] = useState('');
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const context = useContext(BagContext);

  const [itemsInBag, setItemsInBag] = useState([]);
  const [totalDiscounts, setTotalDiscounts] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (items.length > 0) {
      calculateTotals(items);
      setItemsInBag(items);
    }
  }, [items]);

  const calculateTotals = (items) => {
    let discounts = 0;
    let total = 0;
    let numItems = 0;
    if (items.length > 0) {
      items.forEach((item) => {
        total = total + item.price * item.quantity;
        discounts =
          discounts +
          ((item.price * item.discountPercentage) / 100) * item.quantity;
        numItems = numItems + item.quantity;
      });
    }
    setTotalItems(numItems);
    setTotalDiscounts(discounts);
    setTotalPrice(total - discounts);
  };

  const onGoToPayment = (event) => {
    event.preventDefault();
  };

  const addOrRemove = (itemId, quantity, index) => {
    const item = {
      id: itemId,
      quantity: quantity,
    };
    context.addToBag(item);
    setItemsInBag((items) => {
      let newList = [...items];
      newList[index].quantity = newList[index].quantity + quantity;
      calculateTotals(newList);
      return newList;
    });
  };

  const onRemoveProduct = (e, id, index) => {
    e.preventDefault();
    setShowDialog(true);
    setDialogMessage('Retirar este item da sacola?');
    setCancelText('Não');
    setOkText('Sim');
    setOnConfirm(() => () => removeItem(id, index));
  };

  const removeItem = (itemId, index) => {
    const item = {
      id: itemId,
    };
    context.removeFromBag(item);
    setItemsInBag((items) => {
      let newList = [...items];
      newList.splice(index, 1);
      calculateTotals(newList);
      return newList;
    });
  };

  if (totalItems === 0) {
    return (
      <Main notice={notice} categoryList={categoryList}>
        <Head>
          <title>{title}</title>
          <meta name="description" content={'Finalizar Compra'} />
          <link href={canonical} rel="canonical" />
        </Head>
        <div className={[styles.container, styles.empty].join(' ')}>
          <h1 className={styles.empty_message}>Sua Sacola está vazia!</h1>
          <Link
            href={{
              pathname: '/',
            }}
          >
            <a>Ir para as compras</a>
          </Link>
        </div>
      </Main>
    );
  }

  return (
    <Main notice={notice} categoryList={categoryList}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={'Finalizar Compra'} />
        <link href={canonical} rel="canonical" />
      </Head>
      <div className={styles.container}>
        <section className={[styles.section, styles.header].join(' ')}>
          <Button className={styles.button} onClick={onGoToPayment}>
            Ir para pagamento
          </Button>
          <span>
            <h1>Sacola</h1>
            <h3>{`(${totalItems} ${totalItems === 1 ? 'item' : 'itens'})`}</h3>
          </span>
        </section>
        <section
          className={[styles.section, styles.row, styles.divisionLine].join(
            ' '
          )}
        >
          <ShipmentCalc weight={context.bag.totalWeight} />
        </section>
        <section
          className={[
            styles.section,
            styles.divisionLine,
            styles.baseline,
          ].join(' ')}
        >
          <h1>Resumo</h1>
          <span className={styles.totalbox}>
            {totalDiscounts !== 0 ? (
              <span>
                <h3>Descontos:</h3>
                <h3>R$ {totalDiscounts.toFixed(2)}</h3>
              </span>
            ) : (
              ''
            )}
            <span>
              <h3>Total:</h3>
              <h3 className={styles.primary}>R$ {totalPrice.toFixed(2)}</h3>
            </span>
          </span>
        </section>
        <section className={styles.resume}>
          {itemsInBag.map((item, index) => (
            <div key={item._id} className={styles.itemsResume_card}>
              <div className={styles.itemsResume_image}>
                <Image
                  src={`/images/products/${item.image}`}
                  alt={`Resumo de compra item ${item._id}`}
                  width={200}
                  height={200}
                  loading="lazy"
                  objectFit="cover"
                />
              </div>
              <div className={styles.itemsResume_details}>
                <div className={styles.title}>
                  <b>{item.product_name}</b>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      className={styles.icon}
                      viewBox="0 0 16 16"
                      onClick={(e) => onRemoveProduct(e, item._id, index)}
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
                      {item.color_name.toLowerCase()}
                    </p>
                    <p>
                      <b>tamanho: </b>
                      {item.selectedSizes.length > 0
                        ? item.selectedSizes
                            .map(
                              (s) =>
                                `${s.size.name}: ${s.selected.toUpperCase()}`
                            )
                            .join(', ')
                        : 'único'}
                    </p>
                    <p>
                      <b>opções: </b>
                      {item.selectedExtras.length > 0
                        ? item.selectedExtras
                            .map(
                              (e) =>
                                `${e.option.name}: ${e.selected.toLowerCase()}`
                            )
                            .join(', ')
                        : '-'}
                    </p>
                  </span>
                  <span>
                    <p>
                      <b>preço unit.: </b>R$ {item.price.toFixed(2)}
                    </p>
                    {item.discountPercentage > 0 && (
                      <p>
                        <b>descontos: </b>
                        {item.discountPercentage + '%'}
                      </p>
                    )}
                    <p>
                      <b>subtotal: </b>R${' '}
                      {(
                        (item.price -
                          (item.price * item.discountPercentage) / 100) *
                        item.quantity
                      ).toFixed(2)}
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
                          onClick={(e) => {
                            e.preventDefault();
                            addOrRemove(item._id, -1, index);
                          }}
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z" />
                        </svg>
                        <span>{item.quantity}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          className={styles.icon}
                          viewBox="0 0 16 16"
                          onClick={(e) => {
                            e.preventDefault();
                            addOrRemove(item._id, 1, index);
                          }}
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                        </svg>
                      </div>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
      <ConfirmationDialog
        show={showDialog}
        onCancel={() => {
          setShowDialog(false);
          setCancelText('');
          setOkText('ok');
        }}
        onConfirm={() => {
          setShowDialog(false);
          setCancelText('');
          setOkText('ok');
          onConfirm();
        }}
        message={dialogMessage}
        cancelText={cancelText}
        okText={okText}
        noButtons={false}
        fixed
      ></ConfirmationDialog>
    </Main>
  );
};

export async function getServerSideProps(context) {
  let bag = [];
  const cookie = context.req.cookies ? JSON.parse(context.req.cookies['@laruci/bag']) : '';

  const bagId = context.query.bag;
  let id;

  const categories = await getCategoriesJSON();
  const categoryList = await JSON.parse(categories);

  const notice = await getCurrentNotice();
  let noticeText = notice ? notice.text : '';

  if (!bagId) {
    if (!cookie || !cookie.bag || !cookie.bag.id || !cookie.bag.qty) {
      return {
        props: {
          title: 'Laruci - Finalizar Compra',
          canonical: `http://localhost:3000/loja/sacola`,
          notice: noticeText,
          categoryList: categoryList,
          items: [],
        },
      };
    } else {
      id = cookie.bag.id;
    }
  } else {
    id = bagId;
  }

  if (id) {
    try {
      bag = await getBagItems(id);
    } catch(err) {
      return {
        notFound: true,
      };
    }
  }

  // redirect: {
  //   destination: `/loja/sacola?bag=${bagCookie.bag.id}`,
  // },

  return {
    props: {
      title: 'Laruci - Finalizar Compra',
      canonical: `http://localhost:3000/loja/sacola`,
      notice: noticeText,
      categoryList: categoryList,
      items: bag.length > 0 ? JSON.parse(bag) : [],
    },
  };
}

export default BagPage;
