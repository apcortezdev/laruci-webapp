import { useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../../../styles/BagPage.module.scss';
import BagContext from '../../../store/bag-context';
import Button from '../../../components/utilities/Button';
import ShipmentCalc from '../../../components/ShipmentCalc';

function objToString(obj) {
  let text = '';
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      if (text !== '')
        text = text + ', ' + obj[key].name + ': ' + obj[key].value;
      else text = text + obj[key].name + ': ' + obj[key].value;
    }
  }
  return text;
}

const ItemsResume = ({ products }) => {
  let html = [];

  for (const key in products) {
    if (Object.hasOwnProperty.call(products, key)) {
      const element = products[key];
      html.push(
        <div key={key} className={styles.itemsResume_card}>
          <div className={styles.itemsResume_image}>
            <Image
              src={element.image}
              alt={`Resumo de compra item ${key}`}
              width={200}
              height={200}
              loading="lazy"
              objectFit="cover"
            />
          </div>
          <div className={styles.itemsResume_details}>
            <p>
              <b>{element.name}</b>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  className={styles.icon}
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                  <path
                    fillRule="evenodd"
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                  />
                </svg>
              </span>
            </p>
            <div>
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
                  <b>preço unitário: </b>R$ {element.price.toFixed(2)}
                </p>
                <p>
                  <b>descontos: </b>
                  {element.discountPercent > 0
                    ? element.discountPercent + '%'
                    : '-'}
                </p>
                <p>
                  <b>subtotal: </b>R$ {element.subtotalFinalPrice.toFixed(2)}
                </p>
              </span>
              <span>
                <p>
                  <span className={styles.qty_selector}>
                    <b>quantidade: </b>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      className={styles.icon}
                      viewBox="0 0 16 16"
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
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                    </svg>
                  </span>
                </p>
              </span>
            </div>
          </div>
        </div>
      );
    }
  }

  return <div>{html}</div>;
};

const BagPage = (props) => {
  const context = useContext(BagContext);

  const onGoToPayment = (event) => {
    event.preventDefault();
  };

  return (
    <div className={styles.container}>
      <section className={[styles.section, styles.header].join(' ')}>
        <Button className={styles.button} onClick={onGoToPayment}>
          Ir para pagamento
        </Button>
        <span>
          <h1>Sacola</h1>
          <h3>{`(${context.qtyItemsInBag} ${
            context.qtyItemsInBag === 1 ? 'item' : 'itens'
          })`}</h3>
        </span>
      </section>
      <section className={[styles.section, styles.divisionLine].join(' ')}>
        <ShipmentCalc weight={context.totalWeight} />
      </section>
      <section
        className={[styles.section, styles.divisionLine, styles.baseline].join(
          ' '
        )}
      >
        <h1>Resumo</h1>
        <span className={styles.totalbox}>
          {context.totalDiscounts !== 0 ? (
            <span>
              <h3>Descontos:</h3>
              <h3>R$ {context.totalDiscounts.toFixed(2)}</h3>
            </span>
          ) : (
            ''
          )}
          <span>
            <h3>Total:</h3>
            <h3 className={styles.primary}>
              R$ {context.totalFinalPrice.toFixed(2)}
            </h3>
          </span>
        </span>
      </section>
      <section>
        <ItemsResume products={context.products} />
      </section>
    </div>
  );
};

export default BagPage;
