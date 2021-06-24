import Link from 'next/link';
import styles from '../../styles/ProductListItemCard.module.scss';

const ProductListItemCard = (props) => {
  const prod = props.product;

  let discountPrice = 0;

  if (!!prod.discount) {
    discountPrice = prod.price * (1 - prod.discount / 100);
  }

  const prodId = props.prodId;
  const img = prod.sets[Object.keys(prod.sets)[0]].images[0];

  return (
    <li className={styles.item}>
      <Link
        href={{
          pathname: `${props.category}/${prodId}`,
        }}
      >
        <a>
          <article className={styles.card}>
            {!!prod.discount && (
              <div className={styles.promo}>-{prod.discount}%</div>
            )}
            <div className={styles.img_container}>
              <div className={styles.img_ratio}>
                <img src={img} alt={prod.name} className={styles.img} />
              </div>
            </div>
            <div className={styles.info_container}>
              <span className={styles.name}>{prod.name}</span>
              <span>
                {!!prod.discount ? (
                  <>
                    <span className={styles.discountText}>
                      De R$ {prod.price.toFixed(2)} por{' '}
                    </span>
                    <span className={styles.price}>
                      R$ {discountPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className={styles.price}>
                    R$ {prod.price.toFixed(2)}
                  </span>
                )}
              </span>
              <span className={styles.description}>
                {prod.shortDescription}
              </span>
            </div>
          </article>
        </a>
      </Link>
    </li>
  );
};

export default ProductListItemCard;
