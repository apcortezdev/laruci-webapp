// import { getSession } from 'next-auth/client';
import Head from 'next/Head';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import Main from '../../../components/main/Main';
import ShipmentCalc from '../../../components/ShipmentCalc';
import Button from '../../../components/utilities/Button';
import ConfirmationDialog from '../../../components/utilities/ConfirmationDialog';
import {
  getCategories,
  getSocialContact,
  getTopNotice,
} from '../../../data/access/appInfo';
// import { getBagItems } from '../../../data/access/bag';
import BagContext from '../../../store/bag-context';
import styles from '../../../styles/loja/BagPage.module.scss';

const BagPage = ({
  title,
  canonical,
  notice,
  categoryList,
  // items,
  facebookLink,
  instagramLink,
  whatsappLink,
}) => {
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    calculateTotals(context.bag.items);
    setItemsInBag(context.bag.items);
  });

  const calculateTotals = (items) => {
    if (!items?.length) return;

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
    setIsLoading(context.isLoading);
  };

  const onGoToPayment = (event) => {
    event.preventDefault();
  };

  const addOrRemoveHandler = (itemId, quantity, index) => {
    if (itemsInBag[index].quantity + quantity === 0) {
      onRemoveProduct(itemId, index, quantity);
      return;
    } else {
      addOrRemove(itemId, quantity, index);
    }
  };

  const addOrRemove = (itemId, quantity, index) => {
    const item = {
      id: itemId,
      quantity: quantity,
    };
    context.bag.addOrRemoveItem(item);
    setItemsInBag((items) => {
      let newList = [...items];
      if (newList[index].quantity === -1 * quantity) newList.splice(index, 1);
      else newList[index].quantity = newList[index].quantity + quantity;
      calculateTotals(newList);
      return newList;
    });
  };

  const onRemoveProduct = (id, index, qty) => {
    setShowDialog(true);
    setDialogMessage('Retirar este item da sacola?');
    setCancelText('Não');
    setOkText('Sim');
    setOnConfirm(() => () => addOrRemove(id, qty, index));
  };

  return (
    <Main
      notice={notice}
      categoryList={categoryList}
      footerLinks={{
        facebook: facebookLink,
        instagram: instagramLink,
        whatsapp: whatsappLink,
      }}
    >
      {isLoading ? (
        <div className={[styles.container, styles.empty].join(' ')}>
          <h1 className={styles.empty_message}>Carregando ...</h1>
        </div>
      ) : totalItems === 0 ? (
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
      ) : (
        <>
          <Head>
            <title>{`${title} - Minha Sacola`}</title>
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
                <h3>{`(${totalItems} ${
                  totalItems === 1 ? 'item' : 'itens'
                })`}</h3>
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
                      <b>{item.productName}</b>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          className={styles.icon}
                          viewBox="0 0 16 16"
                          onClick={(e) => {
                            e.preventDefault();
                            onRemoveProduct(
                              item._id,
                              index,
                              -1 * item.quantity
                            );
                          }}
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
                      <div>
                        <p>
                          <b>cor: </b>
                          {item.colorName.toLowerCase()}
                        </p>
                        <p>
                          <b>tamanho: </b>
                          {item.selectedSizes.length > 0
                            ? item.selectedSizes
                                .map((s) =>
                                  s.size.name.toLowerCase() === 'unique'
                                    ? s.selected.toUpperCase()
                                    : `${s.size.name.toLowerCase()}: ${s.selected.toUpperCase()}`
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
                                    `${e.option.name.toLowerCase()}: ${e.selected.toLowerCase()}`
                                )
                                .join(', ')
                            : '-'}
                        </p>
                      </div>
                      <div>
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
                      </div>
                      <div>
                        <span className={styles.qty_selector}>
                          <b>quantidade: </b>
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              className={styles.icon}
                              viewBox="0 0 16 16"
                              onClick={() =>
                                addOrRemoveHandler(
                                  item._id,
                                  -1,
                                  index
                                )
                              }
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
                              onClick={() =>
                                addOrRemoveHandler(
                                  item._id,
                                  1,
                                  index
                                )
                              }
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                            </svg>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </>
      )}
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

export async function getStaticProps() {
  // const session = await getSession({ req: context.req });

  // const bagCookie = !!context.req.cookies['@laruci:bag']
  //   ? JSON.parse(context.req.cookies['@laruci:bag'])
  //   : null;

  const promises = await Promise.all([
    getCategories(),
    getTopNotice(),
    getSocialContact(),
    // getBagItems(bagCookie?.id, session?.user.email || null),
  ]);
  const categories = promises[0];
  const notice = promises[1];
  const contato = promises[2];

  const facebook = 'https://facebook.com/' + contato.facebookName;
  const instagtam = 'https://instagram.com/' + contato.instagramName;
  const whatsapp = `https://wa.me/${
    contato.whatsappNum
  }?text=${encodeURIComponent(contato.whatsappMessage)}`;

  return {
    props: {
      title: process.env.MAIN_TITLE,
      canonical: `${process.env.MAIN_DOMAIN}/loja/sacola`,
      notice: notice,
      categoryList: categories,
      facebookLink: facebook,
      instagramLink: instagtam,
      whatsappLink: whatsapp,
      // items: await JSON.parse(JSON.stringify(promises[3])),
    },
  };
}

export default BagPage;
