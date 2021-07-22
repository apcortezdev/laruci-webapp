import { useState } from 'react';
import Head from 'next/Head';
import Store from '../../../components/store/Store';
import Main from '../../../components/main/Main';
import Breadcrumb from '../../../components/Breadcrumb';
import ShipmentCalc from '../../../components/ShipmentCalc';
import Button from '../../../components/utilities/Button';
import ImageShow from '../../../components/utilities/ImageShow';
import SizeSelector from '../../../components/utilities/SizeSelector';
import styles from '../../../styles/ProductPage.module.scss';
import { getSizes } from '../../../data/sizes';
import { getCategories } from '../../../data/categories';
import { getProductsByCategory, getProductById } from '../../../data/products';

const ProductPage = ({
  title,
  canonical,
  prodId,
  prodCategory,
  allSizes,
  data,
}) => {
  const product = data;
  const newPrice = !!product.discount
    ? product.price * (1 - product.discount / 100)
    : false;

  const [selectedColorSet, setSelectedColorSet] = useState(
    Object.keys(product.sets)[0]
  );

  const [selectedColorSet_images, setSelectedColorSet_images] = useState(
    product.sets[selectedColorSet].images
  );

  const htmlColors = Object.keys(product.sets).map((color) => (
    <div
      key={color}
      className={styles.color}
      style={{ backgroundColor: color }}
      onClick={setImagesToSlideShow.bind(this, color)}
    />
  ));

  function openSizesGuide() {}

  function setImagesToSlideShow(color) {
    setSelectedColorSet(color);
    setSelectedColorSet_images(product.sets[color].images);
  }

  return (
    <>
      <Head>
        <title>{`${title} - ${product.name}`}</title>
        <meta
          name="description"
          content={`Tamanhos especiais: ${product.name} - ${product.shortDescription}`}
        />
        <link href={canonical} rel="canonical" />
      </Head>
      <Main>
        <Store>
          <div className={styles.contentbox}>
            <div className={styles.bredcrumb_container}>
              <Breadcrumb
                query={[prodCategory, prodId]}
                current={product.name}
              />
            </div>
            <div className={styles.product_content}>
              <div className={styles.imageshow__container}>
                <ImageShow images={selectedColorSet_images} />
              </div>
              <div className={styles.details}>
                <span className={styles.font_hightlight}>{product.name}</span>
                <section
                  className={[
                    styles.section_details,
                    styles.details__description,
                  ]
                    .join(' ')
                    .trim()}
                >
                  {product.shortDescription}
                </section>
                <span className={styles.price_line}>
                  <span className={styles.price_side}>
                    {!!newPrice ? (
                      <>
                        de R$ {product.price.toFixed(2)} por{' '}
                        <span className={styles.font_price__price}>
                          R$ {newPrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <>
                        por somente{' '}
                        <span className={styles.font_price__price}>
                          R$ {product.price.toFixed(2)}
                        </span>
                      </>
                    )}
                  </span>
                  {!!newPrice && (
                    <span
                      className={[
                        styles.font_price__price,
                        styles.font_discount,
                      ]
                        .join(' ')
                        .trim()}
                    >
                      -{product.discount}%
                    </span>
                  )}
                </span>
                <section
                  className={[
                    styles.section_details,
                    styles.section_colors,
                  ].join(' ')}
                >
                  Cores:
                  <div className={styles.imageshow__colors}>{htmlColors}</div>
                </section>
                <section
                  className={[
                    styles.section_details,
                    styles.section_sizes,
                  ].join(' ')}
                >
                  <p>
                    Medidas:
                    <span onClick={openSizesGuide}>Guia de medidas aqui!</span>
                  </p>
                  {!!product.sets[selectedColorSet].uniqueSizes && (
                    <div>
                      <span>Única:</span>
                      <span>
                        <SizeSelector
                          availableSizeList={
                            product.sets[selectedColorSet].uniqueSizes
                          }
                          fullSizeList={allSizes}
                        />
                      </span>
                    </div>
                  )}
                  {!!product.sets[selectedColorSet].specialSizes && (
                    <div>
                      <span>Especial:</span>
                      <span>
                        {product.sets[selectedColorSet].specialSizes.map(
                          (op) => (
                            <span>
                              {op.name}
                              <SizeSelector
                                availableSizeList={op.sizes}
                                fullSizeList={allSizes}
                              />
                            </span>
                          )
                        )}
                      </span>
                    </div>
                  )}
                </section>
                <section
                  className={[
                    styles.section_details,
                    styles.section_details__buybtn,
                  ]
                    .join(' ')
                    .trim()}
                >
                  <span className={styles.section_btnline}>
                    <Button
                      className={styles.section_btnline__iconbtnsize}
                      tip={'Adicionar à sacola'}
                      type="button"
                    >
                      <div className={styles.bag_icon_plus} />
                    </Button>
                    <Button
                      className={styles.section_btnline__btnsize}
                      tip={'Adicionar e finalizar compra'}
                      type="button"
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
                  ]
                    .join(' ')
                    .trim()}
                >
                  <span className={styles.section_title}>
                    Descrição do Produto:
                  </span>
                  {product.longDescription}
                </section>
              </div>
            </div>
          </div>
        </Store>
      </Main>
    </>
  );
};

export async function getStaticPaths() {
  const categories = getCategories();

  let pathList = [];

  for (const category of categories) {
    const products = getProductsByCategory(category.id);
    for (const key in products) {
      pathList.push({ params: { category: category.id, product: key } });
    }
  }

  return {
    paths: pathList,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const category = params.category;
  const productId = params.product;

  const sizeList = getSizes();
  const data = getProductById(productId);

  return {
    props: {
      title: 'Laruci',
      canonical: `http://localhost:3000/${category}/${productId}`,
      prodCategory: category,
      prodId: productId,
      allSizes: sizeList,
      data: data,
    },
  };
}

export default ProductPage;
