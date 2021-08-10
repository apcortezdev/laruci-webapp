import { useEffect, useReducer, useState } from 'react';
import styles from '../../styles/AdProductsPage.module.scss';
import ConfirmationDialog from '../../components/utilities/ConfirmationDialog';
import { useRouter } from 'next/router';
import Admin from '../../components/admin/Admin';
import {
  Input,
  InputNumber,
  InputRadio,
  SelectText,
  SelectColor,
  Textarea,
  InputCheck,
  InputMask,
} from '../../components/utilities/FormComponents';
import Button from '../../components/utilities/Button';
import { getCategoriesJSON } from '../../data/categories';
import { getColorsJSON } from '../../data/colors';
import { getSectionsJSON } from '../../data/sections';
import { getSizeSetsJSON } from '../../data/sizeSets';

/* LEMBRETE: VALIDE OS VALORES DE PREÇO, PESO E DISCONTO PARA APENAS UM PONTO DECIMAL CONTANDO O NÚMERO DE PONTOS:

var temp = "This is a string.";
var count = (temp. match(/is/g) || []). ...
console. log(count);
​
Output: 2.
​
Explaination : The g in the regular expression (short for global) says to search the whole string rather than just find the first occurrence.

*/

const types = {
  ADD_TO_FIELD: 'ADD_TO_FIELD',
  ADD_SET: 'ADD_SET',
};

const fields = {
  CODE: 'code',
  NAME: 'name',
  LIMIT_STOCK: 'limitStock',
  STOCK_NUMBER: 'stockNumber',
  CATEGORY: 'category',
  SECTION: 'sectionId',
  COLOR: 'color',
  PRICE: 'price',
  DISCOUNT_PERCENTAGE: 'discountPercentage',
  WEIGHT: 'weight',
  SHORT_DESCRIPTION: 'shortDescription',
  LONG_DESCRIPTION: 'longDescription',
  SETS: 'sets',
  COLORID: 'colorId',
};

// SizeGroup: group of selection of SizeSets in 'Único' and 'Personalizados'
const SizeGroup = ({
  name,
  disabled,
  sizeSets,

  selectedGroup,
  onSelectGroup,

  selectedSizes,
  onSelectSize,
}) => {
  return (
    <div className={styles.groupCmp}>
      <table>
        <tbody>
          {sizeSets.map((set) => (
            <tr
              className={
                !disabled && selectedGroup === set._id ? styles.sizeSet : ''
              }
              key={set._id}
            >
              <td>
                <label
                  htmlFor={'op' + name + set._id}
                  onChange={(e) => {
                    onSelectGroup(name, e.target.value);
                  }}
                >
                  <InputRadio
                    id={'op' + name + set._id}
                    name={name}
                    value={set._id}
                    defaultChecked={() => {
                      if (selectedGroup === set._id) return true;
                      else return false;
                    }}
                    disabled={disabled}
                  />
                </label>
              </td>
              <td>
                <span className={styles.gridLine}>
                  {set.sizes.map((size) => (
                    <span
                      key={set._id + size}
                      className={[
                        styles.tag,
                        disabled || selectedGroup !== set._id
                          ? styles.disabled
                          : '',
                        typeof selectedSizes[size] !== 'undefined'
                          ? styles.tag_selected
                          : '',
                      ]
                        .join(' ')
                        .trim()}
                      onClick={() => {
                        if (!disabled && selectedGroup === set._id)
                          onSelectSize(name, size);
                      }}
                    >
                      {size}
                    </span>
                  ))}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const productReducer = (state, action) => {
  let product = state.product;

  const fieldOne = action.fieldOne;
  const fieldTwo = action.fieldTwo || false;
  let value = action.value;

  if (action.type === types.ADD_TO_FIELD) {
    switch (action.fieldOne) {
      case fields.LIMIT_STOCK:
        value = action.value === 'UNLIMITED';
        product = {
          ...product,
          [fieldOne]: value,
        };
        break;

      case fields.STOCK_NUMBER:
        value = state.product.stockNumber + action.value;
        product = {
          ...product,
          [fieldOne]: value,
        };
        break;

      case fields.SETS:
        product = {
          ...product,
          [fieldOne]: {
            ...product[fieldOne],
            [fieldTwo]: value,
          },
        };
        break;
    }
  }
  return { product };
};

const AdProductsPage = ({
  user,
  categoryList,
  colorList,
  sectionList,
  sizeSetList,
}) => {
  if (user !== 'admin') {
    return <p>Esta página no ecxiste!</p>;
  }

  if (!categoryList) {
    return (
      <Admin>
        <div className={styles.wrapper}>
          <p>Loading...</p>
        </div>
      </Admin>
    );
  }

  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sections, setSections] = useState([]);
  const [sizeSets, setSizeSets] = useState([]);

  const onChange = (value, fieldOne, fieldTwo, type = types.ADD_TO_FIELD) => {
    dispatchProductState({
      value: value,
      fieldOne: fieldOne,
      fieldTwo: fieldTwo,
      type: type,
    });
  };

  const onAddSet = (event) => {
    event.preventDefault();
    console.log('CRICK');
  };

  const [productState, dispatchProductState] = useReducer(productReducer, {
    product: {
      code: '',
      name: '',
      limitStock: true,
      stockNumber: 0,
      category: '',
      sectionId: '',
      price: '',
      discountPercentage: '',
      weight: '',
      shortDescription: '',
      longDescription: '',
      sets: {},
      //  {
      //    colorId: '',
      //    sizeSetsCollection: {},
      //    images: [],
      //    extraOptions: [],
      //  },
      // }
    },
  });

  useEffect(() => {
    setCategories(categoryList.map((c) => ({ id: c._id, text: c.text })));
    setSections(sectionList.map((c) => ({ id: c._id, text: c.text })));
    setSizeSets(sizeSetList);
    setColors(
      colorList.map((c) => ({ id: c._id, text: c.text, code: c.code }))
    );
  }, []);

  // Opções
  //toggles
  const [toggleUnique, setToggleUnique] = useState(false);
  const [toggleCustom, setToggleCustom] = useState(false);

  // Options info
  const [selectedColor, setSelectedColor] = useState('');

  const [selectedSizeSets, setSelectedSizeSets] = useState({});
  const onSelectGroup = (name, value, list) => {
    list((list) => ({
      ...list,
      [name]: {
        name: name,
        isUnique: name === 'unique',
        sizeSetId: value,
        availableSizes: {},
      },
    }));
  };
  const onSelectSize = (name, value, list) => {
    list((list) => {
      let newList = { ...list };
      if (typeof newList[name] !== 'undefined') {
        if (typeof newList[name].availableSizes[value] !== 'undefined') {
          delete newList[name].availableSizes[value];
        } else {
          newList = {
            ...list,
            [name]: {
              ...list[name],
              availableSizes: {
                ...list[name].availableSizes,
                [value]: value,
              },
            },
          };
        }
      }
      return newList;
    });
  };

  // temp Custom Options info
  const [tempSizeSetName, setTempSizeSetName] = useState('');
  const [tempSizeSetGroupId, setTempSizeSetGroupId] = useState();
  const [tempSizeSetSizes, setTempSizeSetSizes] = useState({});

  const onNewCustom = () => {
    if (tempSizeSetName.length > 0) {
      const name = tempSizeSetName;
      const sizeSetId = tempSizeSetGroupId;
      const availableSizes = { ...tempSizeSetSizes };
      const newSet = Symbol(name);
      setSelectedSizeSets((list) => ({
        ...list,
        [newSet]: {
          name: name,
          isUnique: false,
          sizeSetId: sizeSetId,
          availableSizes: availableSizes,
        },
      }));
      setTempSizeSetName('');
      setTempSizeSetGroupId('');
      setTempSizeSetSizes({});
    }
  };

  const onNoCustom = () => {
    //removes all Symbol() from obj
    setSelectedSizeSets((list) => JSON.parse(JSON.stringify(list)));
  };

  const onRemoveCustom = (symbol) => {
    setSelectedSizeSets((list) => {
      let newList = { ...list };
      delete newList[symbol];
      return newList;
    });
  };

  return (
    <Admin>
      <div className={[styles.wrapper, styles.centeredColumn].join(' ')}>
        <section className={styles.warning}>
          <h1>Produtos</h1>
          <div>
            ATENÇÃO: <br />
            <ul>
              <li>
                Tenha certeza de que as informações desta página estão corretas
                e atualizadas. Altere-as com cuidado!
              </li>
              <li>
                Alterações poderão <u> demorar até 24 horas</u> para serem
                atualizadas no site.
              </li>
            </ul>
          </div>
        </section>
        <section className={styles.product}>
          <form className={styles.form} onSubmit={onAddSet}>
            <span>
              <label htmlFor="code">
                Código:
                <span className={styles.inpwbutton}>
                  <Input
                    id="code"
                    className={[styles.inp_text, styles.uppercase].join(' ')}
                    onChange={(e) => onChange(e.target.value, fields.CODE)}
                    value={productState.product.code}
                  />
                  <Button className={styles.button}>Buscar</Button>
                </span>
              </label>
            </span>
            <span>
              <label htmlFor="name">
                Nome:
                <Input
                  id="name"
                  className={styles.inp_text}
                  onChange={(e) => onChange(e.target.value, fields.NAME)}
                  value={productState.product.name}
                />
              </label>
            </span>
            <span>
              <label htmlFor="category">
                Categoria:
                <SelectText
                  id="category"
                  placeholder="Selecione"
                  className={styles.capitalize}
                  onChange={(v) => onChange(v, fields.CATEGORY)}
                  options={categories}
                />
              </label>
            </span>
            <span>
              <label htmlFor="section">
                Seção:
                <SelectText
                  id="section"
                  placeholder="Selecione"
                  className={styles.capitalize}
                  onChange={(v) => onChange(v, fields.SECTION)}
                  options={sections}
                />
              </label>
            </span>
            <span>
              Estoque:
              <span
                className={[styles.inp_check_line, styles.group_line].join(' ')}
              >
                <span>
                  <label
                    htmlFor="prod_limitStock_nolimit"
                    onChange={(e) =>
                      onChange(e.target.value, fields.LIMIT_STOCK)
                    }
                  >
                    <InputRadio
                      id="prod_limitStock_nolimit"
                      name={'limitStock'}
                      defaultChecked={true}
                      value="UNLIMITED"
                    />
                    Sem Limite
                  </label>
                </span>
                <span>
                  <label
                    htmlFor="prod_limitStock_limit"
                    onChange={(e) =>
                      onChange(e.target.value, fields.LIMIT_STOCK)
                    }
                  >
                    <InputRadio
                      id="prod_limitStock_limit"
                      name="limitStock"
                      value="LIMITED"
                    />
                    Limitado à
                  </label>
                </span>
                <span>
                  <InputNumber
                    id="prod_stockNumber"
                    className={styles.inp_number}
                    onChange={(value) => onChange(value, fields.STOCK_NUMBER)}
                    minValue={0}
                    disabled={productState.product.limitStock}
                    value={productState.product.stockNumber}
                  />
                </span>
              </span>
            </span>
            <span className={[styles.group_line, styles.margins].join(' ')}>
              <label htmlFor="price">
                Preço:
                <span className={styles.group_line}>
                  R$
                  <Input
                    id="price"
                    className={styles.inp_text}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9,.]/gi, '');
                      value = value.replace(',', '.');
                      onChange(value, fields.PRICE);
                    }}
                    value={productState.product.price}
                  />
                </span>
              </label>
              <label htmlFor="discount">
                Desconto:
                <span className={styles.group_line}>
                  <Input
                    id="discount"
                    className={styles.inp_text}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9,.]/gi, '');
                      value = value.replace(',', '.');
                      onChange(value, fields.DISCOUNT_PERCENTAGE);
                    }}
                    value={productState.product.discountPercentage}
                  />
                  %
                </span>
              </label>
              <label htmlFor="weight">
                Peso:
                <span className={styles.group_line}>
                  <Input
                    id="weight"
                    className={styles.inp_text}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9,.]/gi, '');
                      value = value.replace(',', '.');
                      onChange(value, fields.WEIGHT);
                    }}
                    value={productState.product.weight}
                  />
                  Kg
                </span>
              </label>
            </span>
            <span>
              <label htmlFor="shortDescription">
                Descrição Curta:
                <Input
                  id="shortDescription"
                  className={styles.inp_text}
                  onChange={(e) =>
                    onChange(e.target.value, fields.SHORT_DESCRIPTION)
                  }
                  maxLength={60}
                  value={productState.product.shortDescription}
                />
              </label>
            </span>
            <span>
              <label htmlFor="longDescription">
                Descrição Longa:
                <Textarea
                  id="longDescription"
                  rows={20}
                  className={styles.inp_textarea}
                  onChange={(e) =>
                    onChange(e.target.value, fields.LONG_DESCRIPTION)
                  }
                  value={productState.product.longDescription}
                />
              </label>
            </span>
            <div className={styles.sets}>
              Opções:
              <div
                className={[
                  styles.borderAround,
                  styles.padding,
                  styles.sets,
                ].join(' ')}
              >
                <span>
                  <label htmlFor="color">
                    Cor:
                    <SelectColor
                      id="color"
                      placeholder="Selecione"
                      className={styles.capitalize}
                      onChange={(v) => setSelectedColor(v)}
                      colors={colors}
                    />
                  </label>
                </span>
                <span>
                  Tamanhos:
                  <span className={styles.sizeGroup}>
                    <label htmlFor="unique">
                      <span>
                        <InputCheck
                          id="unique"
                          onChange={() => setToggleUnique((t) => !t)}
                        />
                      </span>
                      Único
                    </label>
                    <SizeGroup
                      name="unique"
                      disabled={!toggleUnique}
                      sizeSets={sizeSets}
                      onSelectGroup={(a, b) =>
                        onSelectGroup(a, b, setSelectedSizeSets)
                      }
                      onSelectSize={(a, b) =>
                        onSelectSize(a, b, setSelectedSizeSets)
                      }
                      selectedSizes={
                        typeof selectedSizeSets.unique === 'undefined'
                          ? {}
                          : selectedSizeSets.unique.availableSizes
                      }
                      selectedGroup={
                        typeof selectedSizeSets.unique === 'undefined'
                          ? {}
                          : selectedSizeSets.unique.sizeSetId
                      }
                    />
                  </span>
                  <span
                    className={[styles.sizeGroup, styles.noDivision].join(' ')}
                  >
                    <label htmlFor="custom">
                      <span>
                        <InputCheck
                          id="custom"
                          onChange={() => {
                            if (toggleCustom) {
                              onNoCustom();
                              setTempSizeSetName('');
                              setTempSizeSetGroupId('');
                              setTempSizeSetSizes({});
                              setToggleCustom(false);
                            } else {
                              setToggleCustom(true);
                            }
                          }}
                        />
                      </span>
                      Personalizados
                    </label>
                    {Object.getOwnPropertySymbols(selectedSizeSets).map((s) => {
                      return (
                        <div
                          className={[
                            styles.centeredColumn,
                            styles.paddingTwo,
                            styles.marginTwo,
                            styles.lineBotton,
                          ].join(' ')}
                          key={selectedSizeSets[s].name}
                        >
                          <span
                            className={[
                              styles.paddingTwo,
                              styles.width100,
                            ].join(' ')}
                          >
                            {selectedSizeSets[s].name}
                          </span>

                          <span className={styles.gridLine}>
                            {sizeSets
                              .find(
                                (si) => si._id === selectedSizeSets[s].sizeSetId
                              )
                              .sizes.map((size) => (
                                <span
                                  key={selectedSizeSets[s].name + size}
                                  className={[
                                    styles.tag,
                                    typeof selectedSizeSets[s].availableSizes[
                                      size
                                    ] !== 'undefined'
                                      ? styles.tag_selected
                                      : '',
                                  ]
                                    .join(' ')
                                    .trim()}
                                >
                                  {size}
                                </span>
                              ))}
                          </span>
                          <span className={styles.paddingTwo}>
                            <Button
                              className={[
                                styles.buttonSmall,
                                styles.buttonRed,
                              ].join(' ')}
                              type="button"
                              onClick={() => onRemoveCustom(s)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                className={styles.icon}
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path
                                  fillRule="evenodd"
                                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                />
                              </svg>
                            </Button>
                          </span>
                        </div>
                      );
                    })}
                    {toggleCustom && (
                      <>
                        <span
                          className={[styles.paddingTwo, styles.width100].join(
                            ' '
                          )}
                        >
                          <Input
                            id="customName"
                            className={styles.inp_text}
                            maxLength={10}
                            value={tempSizeSetName}
                            onChange={(e) => setTempSizeSetName(e.target.value)}
                          />
                        </span>
                        <SizeGroup
                          name="custom"
                          disabled={false}
                          sizeSets={sizeSets}
                          onSelectGroup={(_, value) => {
                            setTempSizeSetSizes({});
                            setTempSizeSetGroupId(value);
                          }}
                          onSelectSize={(_, value) =>
                            setTempSizeSetSizes((list) => {
                              let newList = { ...list };
                              if (typeof newList[value] !== 'undefined') {
                                delete newList[value];
                              } else {
                                newList = {
                                  ...list,
                                  [value]: value,
                                };
                              }
                              return newList;
                            })
                          }
                          selectedSizes={tempSizeSetSizes}
                          selectedGroup={tempSizeSetGroupId}
                        />
                        <span className={styles.paddingTwo}>
                          <Button
                            className={styles.buttonSmall}
                            type="button"
                            onClick={onNewCustom}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              className={styles.icon}
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                            </svg>
                          </Button>
                        </span>
                      </>
                    )}
                  </span>
                </span>
              </div>
            </div>
            <span>
              <Button>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </span>
          </form>
        </section>
      </div>
      {/* <ConfirmationDialog show={showConfirmation} onCancel={onDismissConfirmation} onConfirm={onConfirmSaveHandler}/> */}
    </Admin>
  );
};

export async function getServerSideProps() {
  const categories = await getCategoriesJSON();
  const catList = await JSON.parse(categories);

  const colors = await getColorsJSON();
  const colorList = await JSON.parse(colors);

  const sections = await getSectionsJSON();
  const sectionList = await JSON.parse(sections);

  const sizeSets = await getSizeSetsJSON();
  const sizeSetList = await JSON.parse(sizeSets);

  return {
    props: {
      user: 'admin',
      categoryList: catList,
      colorList: colorList,
      sectionList: sectionList,
      sizeSetList: sizeSetList,
    },
  };
}

export default AdProductsPage;
