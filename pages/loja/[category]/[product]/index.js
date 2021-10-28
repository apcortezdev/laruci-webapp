import Head from 'next/Head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import Main from '../../../../components/main/Main';
import ProductList from '../../../../components/ProductList';
import ShipmentCalc from '../../../../components/ShipmentCalc';
import Store from '../../../../components/store/Store';
import Breadcrumb from '../../../../components/utilities/Breadcrumb';
import Button from '../../../../components/utilities/Button';
import ConfirmationDialog from '../../../../components/utilities/ConfirmationDialog';
import {
  InputNumber,
  InputRadio,
} from '../../../../components/utilities/FormComponents';
import ImageShow from '../../../../components/utilities/ImageShow';
import SizeSelector from '../../../../components/utilities/SizeSelector';
import Spin from '../../../../components/utilities/Spin';
import {
  getCategories,
  getSocialContact,
  getTopNotice,
} from '../../../../data/access/appInfo';
import {
  getProductById,
  getProductListing,
  getProductsForSSR,
} from '../../../../data/access/products';
import BagContext from '../../../../store/bag-context';
import styles from '../../../../styles/loja/ProductPage.module.scss';
import { removeAccents } from '../../../../validation/backValidation';

const ProductPage = ({
  notice,
  title,
  canonical,
  categoryList,
  product,
  relatedProducts,
  facebookLink,
  instagramLink,
  whatsappLink,
}) => {
  const router = useRouter();
  const newPrice = !!product.discountPercentage
    ? product.price.toFixed(2) * (1 - product.discountPercentage / 100)
    : false;

  // Dialog
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [cancelText, setCancelText] = useState('');
  const [okText, setOkText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // INPUT OPTIONS FOR PURCHASE: - START
  // COLOR
  const [selectedSet, setSelectedSet] = useState(product.sets[0]);
  const [selectedSetValidator, setSelectedSetValidator] = useState(true);

  // SIZES
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSizesValidator, setSelectedSizesValidator] = useState(true);

  // EXTRAS
  const [selectedExtras, setSelectedExtras] = useState({});
  const onSelectedExtrasHandler = (name, value) => {
    setSelectedExtras((options) => ({ ...options, [name]: value }));
    setSelectedSizesValidator(true);
  };

  // QUANTITY
  const [quantity, setQuantity] = useState(1);
  const [quantityValidator, setQuantityValidator] = useState(true);
  const onChangeQuantity = (v) => {
    setQuantity((q) => q + v);
    setQuantityValidator(true);
  };
  // INPUT OPTIONS FOR PURCHASE: -END

  const context = useContext(BagContext);

  // Validations
  const validate = async () => {
    if (!selectedSet) {
      setSelectedSetValidator(false);
      setDialogMessage('Por favor, escolha uma cor.');
      setShowDialog(true);
      return false;
    }

    if (
      (selectedSet.sizeSets.length > 0 && selectedSizes.length < 1) ||
      !selectedSizes[0]
    ) {
      setSelectedSizesValidator(false);
      setDialogMessage('Por favor, escolha uma das medidas disponíveis.');
      setShowDialog(true);
      return false;
    }

    if (
      selectedSet.sizeSets.filter(
        (size) => size.isUnique === selectedSizes[0].isUnique
      ).length != selectedSizes.length ||
      selectedSizes.some((size) => size.selected.length === 0)
    ) {
      setSelectedSizesValidator(false);
      setDialogMessage(
        'Por favor, escolha uma medida de cada opção disponível para personalização.'
      );
      setShowDialog(true);
      return false;
    }

    if (
      !selectedSizes[0].isUnique &&
      selectedSet.extraOptions.length != Object.keys(selectedExtras).length
    ) {
      setSelectedSizesValidator(false);
      setDialogMessage('Por favor, selecione as opções desejadas.');
      setShowDialog(true);
      return false;
    }

    if (+quantity < 1) {
      setQuantityValidator(true);
      setDialogMessage('Por favor, escolha a quantidade.');
      setShowDialog(true);
      return false;
    }

    return true;
  };

  // Add to bag using "plus" button
  async function addToBag(event) {
    event.preventDefault();
    setIsLoading(true);
    const isValid = await validate();

    if (isValid) {
      const prodToBag = {
        product: product._id,
        selectedSet: selectedSet._id,
        selectedSizes: selectedSizes,
        selectedExtras: Object.keys(selectedExtras).map((key) => ({
          extraId: key,
          selected: selectedExtras[key],
        })),
        quantity: quantity,
      };

      setCancelText('Continuar Comprando');
      setOkText('Finalizar Compra');
      setDialogMessage(
        quantity +
          ' "' +
          product.name +
          '" ' +
          (quantity > 1 ? 'foram adicionados' : 'foi adicionado') +
          ' à sua sacola!'
      );
      setShowDialog(true);
      context.addOrRemoveFromBag(prodToBag).then(() => {
        setIsLoading(false);
      });
    }
  }

  // Add to bag and go to bag page
  async function buyHandler(event) {
    event.preventDefault();
    setIsLoading(true);

    const isValid = await validate();

    if (isValid) {
      const prodToBag = {
        product: product._id,
        selectedSet: selectedSet._id,
        selectedSizes: selectedSizes,
        selectedExtras: Object.keys(selectedExtras).map((key) => ({
          extraId: key,
          selected: selectedExtras[key],
        })),
        quantity: quantity,
      };
      context.addOrRemoveFromBag(prodToBag).then((bag) => {
        setIsLoading(false);
        router.push({ pathname: '/loja/sacola', query: { bag: bag } });
      });
    }
  }

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
      <Store notice={!!notice} categoryList={categoryList}>
        <Head>
          <title>{`${title} - ${product.name}`}</title>
          <meta
            name="description"
            content={`Tamanhos especiais: ${product.name} - ${product.shortDescription}`}
          />
          <link href={canonical} rel="canonical" />
        </Head>
        <div className={styles.contentbox}>
          <div className={styles.bredcrumb_container}>
            <Breadcrumb
              query={[product.categoryName, product._id]}
              current={product.name}
            />
          </div>
          <div className={styles.product_content_side}>
            <div className={styles.hidden_web}>
              <span className={styles.font_hightlight}>{product.name}</span>
              <span>Ref: {product.code}</span>
            </div>
            <div className={styles.imageshow__container}>
              <ImageShow
                images={selectedSet.images.map((image, index) => ({
                  src: `/images/products/${product._id}/${image}`,
                  alt: `Foto ${index} de ${product.name} na cor ${selectedSet.colorName}`,
                }))}
              />
            </div>
            <div className={styles.details}>
              <div className={styles.hidden_mobile}>
                <span className={styles.font_hightlight}>{product.name}</span>
                <span>Ref: {product.code.toUpperCase()}</span>
              </div>
              <section
                className={[styles.section_details, styles.details__description]
                  .join(' ')
                  .trim()}
              >
                {product.shortDescription}
                <span className={styles.center_spaced_line}>
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
                      -{product.discountPercentage}%
                    </span>
                  )}
                </span>
              </section>
              <section
                className={[
                  styles.section_details,
                  styles.section_colors,
                  !selectedSetValidator ? styles.section_validation : '',
                ].join(' ')}
              >
                Cores:
                <div className={styles.imageshow__colors}>
                  {product.sets.map((set) => (
                    <div
                      key={set._id}
                      className={[
                        styles.color,
                        set._id === selectedSet._id ? styles.colorSelected : '',
                      ]
                        .join(' ')
                        .trim()}
                      style={{ backgroundColor: set.colorCode }}
                      onClick={() => {
                        setSelectedSet(set);
                        setSelectedSetValidator(true);
                        setSelectedSizesValidator(true);
                        setSelectedSizesValidator(true);
                        setSelectedExtras({});
                        setSelectedSizes([]);
                      }}
                    />
                  ))}
                </div>
              </section>
              <section
                className={[
                  styles.section_details,
                  styles.section_sizes,
                  !selectedSizesValidator ? styles.section_validation : '',
                ].join(' ')}
              >
                <p>
                  Medidas:
                  <Link href={'/loja/medidas'}>
                    <a rel="noreferrer noopener" target={'_blank'}>
                      Guia de medidas aqui!
                    </a>
                  </Link>
                </p>
                {selectedSet.sizeSets.length <= 0 ? (
                  <p>Tamanho único</p>
                ) : (
                  <>
                    {selectedSet.sizeSets.map((size) => {
                      if (size.isUnique)
                        return (
                          <div
                            key={size._id}
                            className={
                              !!selectedSizes[0] &&
                              selectedSizes[0].sizeId === size._id
                                ? styles.selectedSizeSet
                                : ''
                            }
                          >
                            <label htmlFor="uniqueSize">
                              <InputRadio
                                id="uniqueSize"
                                type="radio"
                                name="size_type"
                                value="uniqueSize"
                                checked={
                                  !!selectedSizes[0] &&
                                  selectedSizes[0].sizeId === size._id
                                }
                                onChange={() => {
                                  setSelectedSizes([
                                    {
                                      sizeId: size._id,
                                      isUnique: true,
                                      selected: '',
                                    },
                                  ]);
                                  setSelectedSizesValidator(true);
                                }}
                              />
                              <span className={styles.capitalize}>
                                {size.name}
                              </span>
                            </label>
                            <span>
                              <SizeSelector
                                availableSizeList={
                                  !!selectedSizes[0] &&
                                  selectedSizes[0].sizeId === size._id
                                    ? size.availableSizes
                                    : []
                                }
                                value={
                                  selectedSizes.find(
                                    (s) => s.sizeId === size._id
                                  )
                                    ? selectedSizes.find(
                                        (s) => s.sizeId === size._id
                                      ).selected
                                    : ''
                                }
                                fullSizeList={size.sizeSetId.sizes}
                                id={size._id}
                                onChange={(id, value) => {
                                  setSelectedSizes([
                                    {
                                      sizeId: id,
                                      isUnique: true,
                                      selected: value,
                                    },
                                  ]);
                                  setSelectedSizesValidator(true);
                                }}
                              />
                            </span>
                          </div>
                        );
                    })}
                    {selectedSet.sizeSets.filter((size) => !size.isUnique)
                      .length > 0 && (
                      <div
                        className={[
                          styles.sizeSections,
                          !!selectedSizes[0] && !selectedSizes[0].isUnique
                            ? styles.selectedSizeSet
                            : '',
                        ]
                          .join(' ')
                          .trim()}
                      >
                        <div className={styles.sizeSection}>
                          <label htmlFor="customSize">
                            <InputRadio
                              id="customSize"
                              type="radio"
                              name="size_type"
                              value="customSize"
                              checked={
                                !!selectedSizes[0] &&
                                selectedSizes[0].isUnique === false
                              }
                              onChange={() => {
                                setSelectedSizes(() => {
                                  let newSelectedSizes = [];
                                  selectedSet.sizeSets.forEach((size) => {
                                    if (!size.isUnique)
                                      newSelectedSizes.push({
                                        sizeId: size._id,
                                        isUnique: false,
                                        selected: '',
                                      });
                                  });
                                  return newSelectedSizes;
                                });
                                setSelectedSizesValidator(true);
                              }}
                            />
                            <span>Personalizado:</span>
                          </label>
                          <div>
                            {selectedSet.sizeSets.map((size, i) => {
                              if (!size.isUnique)
                                return (
                                  <div
                                    key={size._id}
                                    className={styles.specialSizes}
                                  >
                                    <span className={styles.capitalize}>
                                      {size.name}:
                                    </span>
                                    <span>
                                      <SizeSelector
                                        availableSizeList={
                                          selectedSizes.some(
                                            (s) => s.sizeId === size._id
                                          )
                                            ? size.availableSizes
                                            : []
                                        }
                                        value={
                                          selectedSizes.find(
                                            (s) => s.sizeId === size._id
                                          )
                                            ? selectedSizes.find(
                                                (s) => s.sizeId === size._id
                                              ).selected
                                            : ''
                                        }
                                        fullSizeList={size.sizeSetId.sizes}
                                        id={size._id}
                                        onChange={(id, value) => {
                                          let index = selectedSizes.findIndex(
                                            (s) => s.sizeId === id
                                          );
                                          setSelectedSizes((oldArray) => {
                                            let newArray = [...oldArray];
                                            newArray[index] = {
                                              sizeId: id,
                                              ref: i,
                                              isUnique: false,
                                              selected: value,
                                            };
                                            setSelectedSizesValidator(true);
                                            return newArray;
                                          });
                                        }}
                                      />
                                    </span>
                                  </div>
                                );
                            })}
                          </div>
                        </div>
                        {selectedSet.extraOptions.length > 0 && (
                          <div
                            className={[
                              styles.section_details,
                              styles.section_extras,
                            ].join(' ')}
                          >
                            <p>Opções:</p>
                            {selectedSet.extraOptions.map((op) => (
                              <div key={`${selectedSet._id}_${op.name}`}>
                                <span>
                                  <p>{op.name}:</p>
                                </span>
                                <span>
                                  {op.options.map((option) => (
                                    <label
                                      htmlFor={`extraOptInpt_${op.name}_${option}`}
                                      key={`extraOptLabel_${op.name}_${option}`}
                                    >
                                      <InputRadio
                                        id={`extraOptInpt_${op.name}_${option}`}
                                        type="radio"
                                        name={`extraOptInpt_${op.name}_${op.name}`}
                                        value={option}
                                        onChange={() =>
                                          onSelectedExtrasHandler(
                                            op._id,
                                            option
                                          )
                                        }
                                      />
                                      <span>{option}</span>
                                    </label>
                                  ))}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </section>
              <section
                className={[
                  styles.section_details,
                  styles.center_spaced_line,
                  !quantityValidator ? styles.section_validation : '',
                ]
                  .join(' ')
                  .trim()}
              >
                <p>Quantidade:</p>
                <span>
                  <InputNumber
                    id="quantity"
                    name="quantity"
                    minValue={1}
                    onChange={onChangeQuantity}
                    value={quantity}
                  />
                </span>
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
                    onClick={addToBag}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      className={styles.bag_icon_plus}
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zM8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5V8z"
                      />
                    </svg>
                  </Button>
                  <Button
                    className={styles.section_btnline__btnsize}
                    type="button"
                    onClick={buyHandler}
                  >
                    Comprar
                  </Button>
                </span>
              </section>
            </div>
          </div>
          <div className={styles.product_content_bottom}>
            <section className={styles.section_details}>
              <ShipmentCalc />
            </section>
            <section
              className={[styles.section_details, styles.details__description]
                .join(' ')
                .trim()}
            >
              <span className={styles.section_title}>
                Descrição do Produto:
              </span>
              {product.longDescription}
            </section>
            <section
              className={[styles.section_details, styles.details__description]
                .join(' ')
                .trim()}
            >
              <span className={styles.section_title}>Ofertas Similares:</span>
              <ProductList productList={relatedProducts} type="carousel" />
            </section>
          </div>
        </div>
      </Store>
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
        }}
        message={dialogMessage}
        cancelText={cancelText}
        okText={okText}
        noButtons={okText === 'Finalizar Compra'}
        fixed
      >
        {okText === 'Finalizar Compra' && (
          <span className={styles.confirmationButtonLine}>
            {isLoading ? (
              <Spin width={40} height={40} />
            ) : (
              <>
                <Button
                  className={styles.formButton}
                  onClick={() => {
                    setShowDialog(false);
                    setCancelText('');
                    setOkText('ok');
                  }}
                >
                  {cancelText}
                </Button>
                <Button
                  className={styles.formButton}
                  onClick={() => {
                    setShowDialog(false);
                    setCancelText('');
                    setOkText('ok');
                    if (okText === 'Finalizar Compra')
                      router.push({
                        pathname: '/loja/sacola',
                        query: {
                          bag: context.bag.bagId,
                        },
                      });
                  }}
                >
                  {okText}
                </Button>
              </>
            )}
          </span>
        )}
      </ConfirmationDialog>
    </Main>
  );
};

export async function getStaticPaths() {
  let pathList = [];

  const products = await getProductsForSSR();

  for (const product of products) {
    pathList.push({
      params: {
        category: product.categoryName,
        product: product._id.toString(),
      },
    });
  }

  return {
    paths: pathList,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  try {
    const category = params.category;
    const productId = params.product;

    const categories = await getCategories();
    const selectedCategory = categories.findIndex(
      (cat) => removeAccents(cat.name) === category
    );

    const promises = await Promise.all([
      getProductById(productId),
      getProductListing({ category: categories[selectedCategory]._id }, 1, 10),
      getTopNotice(),
      getSocialContact(),
    ]);

    const notice = promises[2];
    const contato = promises[3];

    const jsons = await Promise.all([
      JSON.parse(JSON.stringify(promises[1])),
      JSON.parse(JSON.stringify(promises[0])),
    ]);

    const relatedProducts = jsons[0];
    const product = jsons[1];

    const facebook = 'https://facebook.com/' + contato.facebookName;
    const instagtam = 'https://instagram.com/' + contato.instagramName;
    const whatsapp = `https://wa.me/${
      contato.whatsappNum
    }?text=${encodeURIComponent(contato.whatsappMessage)}`;

    return {
      props: {
        title: process.env.MAIN_TITLE,
        canonical: `${process.env.MAIN_DOMAIN}/loja/${category}/${productId}`,
        notice: notice,
        categoryList: categories,
        product: product,
        relatedProducts: relatedProducts,
        facebookLink: facebook,
        instagramLink: instagtam,
        whatsappLink: whatsapp,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}

export default ProductPage;
