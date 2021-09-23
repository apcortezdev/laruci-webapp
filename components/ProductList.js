import PropTypes from 'prop-types';
import ProductListItemCard from './utilities/ProductListItemCard';
import styles from './ProductList.module.scss';
import { useState } from 'react';

const ItemsList = ({ items, startIn }) => {
  let start = startIn;
  let products = [];

  if (!!items) {
    items.forEach(item => {
      if (start === items.length) start = 0;
      products[start] = (
        <div key={'carrousel' + item._id} className={styles.itemcontainer}>
          <ProductListItemCard key={'carrouselItm_' + item._id} product={item} />
        </div>
      );
      start++;
    })
  }


  return <ol className={styles.carousel}>{products}</ol>;
};

const ProductList = ({ productList, type }) => {
  const [slidePosition, setSlidePosition] = useState(0);

  const slide = (value) => {
    setSlidePosition((v) => {
      let newV = v + value;
      if (newV === productList.length) return 0;
      else if (newV < 0) return productList.length - 1;
      return newV;
    });
  };

  if (type === 'carousel') {
    return (
      <div className={styles.container}>
        <span onClick={() => slide(+1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            className={styles.icon}
            viewBox="0 0 16 16"
          >
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
          </svg>
        </span>
        <ItemsList items={productList} startIn={slidePosition} />
        <span onClick={() => slide(-1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            className={styles.icon}
            viewBox="0 0 16 16"
          >
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
          </svg>
        </span>
      </div>
    );
  } else {
    let products = [];

    if (productList.length > 0) {
      productList.forEach((element) => {
        products.push(
          <ProductListItemCard
            key={element._id}
            product={element}
            type={type}
          />
        );
      });

      return <ol className={styles.list}>{products}</ol>;
    }

    return <p>{'Ops, isso é estranho, mas parece que ocorreu um erro =('}</p>
  }
};

ProductList.propTypes = {
  productList: PropTypes.array,
  type: PropTypes.oneOf(['page', 'carousel', 'large']),
};

export default ProductList;
