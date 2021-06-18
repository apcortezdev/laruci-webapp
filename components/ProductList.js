import ProductListItemCard from './utilities/ProductListItemCard';
import styles from '../styles/ProductList.module.scss';

const ProductList = (props) => {
  let products = [];
  let i;

  for (i in props.list) {
    products.push(
      <ProductListItemCard
        category={props.category}
        key={i}
        prodId={i}
        product={props.list[i]}
      />
    );
  }

  return <ul className={styles.list}>{products}</ul>;
};

export default ProductList;
