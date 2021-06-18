import Link from 'next/link';
import styles from '../../styles/ProductListItemCard.module.scss';

const ProductListItemCard = (props) => {
  const prod = props.product;

  let discountPrice = 0;

  if (!!prod.discount) {
    discountPrice = prod.price * (1 - prod.discount / 100);
  }

  const prodId = props.prodId;

  return (
    <li className={styles.item}>
      <Link
        href={{
          pathname: `${props.category}/${prodId}`,
        }}
        passHref
      >
        <a>
          <article className={styles.card}>
            {!!prod.discount && (
              <div className={styles.promo}>-{prod.discount}%</div>
            )}
            <img src={prod.images[0]} alt={prod.name} />
            <div className={styles.info}>
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
