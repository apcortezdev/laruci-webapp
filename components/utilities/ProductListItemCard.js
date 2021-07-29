import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductListItemCard.module.scss';

const ProductListItemCard = ({ product, prodId }) => {
  const prod = product;

  let discountPrice = 0;

  if (!!prod.discountPercent) {
    discountPrice = prod.price * (1 - prod.discountPercent / 100);
  }

  const img = prod.images[0].image;

  return (
    <li className={styles.item} key={prodId}>
      <Link
        href={{
          pathname: `/loja/${product.category}/${prodId}`,
        }}
      >
        <a>
          <article className={styles.card}>
            {!!prod.discountPercent && (
              <div className={styles.promo}>-{prod.discountPercent}%</div>
            )}
            <div className={styles.img_container}>
              {/* <div className={styles.img_ratio}> */}
                <Image
                  src={img}
                  alt={prod.name}
                  width={400}
                  height={400}
                  loading="lazy"
                  objectFit="cover"
                />
              {/* </div> */}
            </div>
            <div className={styles.info_container}>
              <span className={styles.name}>{prod.name}</span>
              <span>
                {!!prod.discountPercent ? (
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

ProductListItemCard.propTypes = {
  product: PropTypes.object,
  prodId: PropTypes.string,
};

export default ProductListItemCard;
