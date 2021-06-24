import { useRouter } from 'next/router';
import { useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import ShipmentCalc from '../../../components/ShipmentCalc';
import Button from '../../../components/utilities/Button';
import ImageShow from '../../../components/utilities/ImageShow';
import SizeTag from '../../../components/utilities/SizeTag';
import styles from '../../../styles/ProductPage.module.scss';
import dummy from '../../api/dummy';

const ProductPage = (props) => {
  const router = useRouter();
  const query = router.query;

  const data = dummy[Object.keys(dummy)[0]];

  const newPrice = !!data.discount
    ? data.price * (1 - data.discount / 100)
    : false;

  const [selectedColorSet, setSelectedColorSet] = useState(
    Object.keys(data.sets)[0]
  );

  const [selectedColorSet_images, setSelectedColorSet_images] = useState(
    data.sets[selectedColorSet].images
  );

  const htmlColors = Object.keys(data.sets).map((color) => (
    <div
      key={color}
      className={styles.color}
      style={{ backgroundColor: color }}
      onClick={setImagesToSlideShow.bind(this, color)}
    />
  ));

  function setImagesToSlideShow(color) {
    setSelectedColorSet(color);
    setSelectedColorSet_images(data.sets[color].images);
  }

  return (
    <div className={styles.maincontainer}>
      <div className={styles.asidebox} />
      <div className={styles.contentbox}>
        <div className={styles.bredcrumb_container}>
          <Breadcrumb query={query} />
        </div>
        <div className={styles.product_content}>
          <div className={styles.imageshow__container}>
            <ImageShow images={selectedColorSet_images} />
            <div className={styles.imageshow__colors}>{htmlColors}</div>
          </div>
          <div className={styles.details}>
            <span className={styles.font_hightlight}>{data.name}</span>
            <section
              className={[
                styles.section_details,
                styles.details__description,
              ].join(' ')}
            >
              {data.shortDescription}
            </section>
            <span className={styles.price_line}>
              <span className={styles.price_side}>
                {!!newPrice ? (
                  <>
                    de R$ {data.price.toFixed(2)} por{' '}
                    <span className={styles.font_price__price}>
                      R$ {newPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <>
                    por somente{' '}
                    <span className={styles.font_price__price}>
                      R$ {data.price.toFixed(2)}
                    </span>
                  </>
                )}
              </span>
              {!!newPrice && (
                <span
                  className={[
                    styles.font_price__price,
                    styles.font_discount,
                  ].join(' ')}
                >
                  -{data.discount}%
                </span>
              )}
            </span>

            <section className={styles.section_details}>
              <SizeTag sizes={data.sets[selectedColorSet].sizes} />
            </section>
            <section
              className={[
                styles.section_details,
                styles.section_details__buybtn,
              ].join(' ')}
            >
              <span className={styles.section_btnline}>
                <Button
                  className={styles.section_btnline__iconbtnsize}
                  tip={'Adicionar à sacola'}
                  type='button'
                >
                  <div className={styles.bag_icon_plus} />
                </Button>
                <Button
                  className={styles.section_btnline__btnsize}
                  tip={'Adicionar e finalizar compra'}
                  type='button'
                >
                  Comprar
                </Button>
              </span>
            </section>
            <section className={styles.section_details}>
              <ShipmentCalc />
            </section>
            <section
              className={[
                styles.section_details,
                styles.details__description,
              ].join(' ')}
            >
              <span className={styles.section_title}>Descrição do Produto:</span>
              {data.longDescription}
            </section>
          </div>
        </div>
      </div>
      <div className={styles.asidebox} />
    </div>
  );
};

export default ProductPage;
