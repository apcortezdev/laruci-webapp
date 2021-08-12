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
} from '../../components/utilities/FormComponents';
import Button from '../../components/utilities/Button';
import { getCategoriesJSON } from '../../data/categories';
import { getColorsJSON } from '../../data/colors';
import { getSectionsJSON } from '../../data/sections';
import { getSizeSetsJSON } from '../../data/sizeSets';

const fields = {
  CODE: 'code',
  NAME: 'name',
  LIMIT_STOCK: 'limitStock',
  STOCK_NUMBER: 'stockNumber',
  CATEGORY: 'categoryId',
  SECTION: 'sectionId',
  COLOR: 'color',
  PRICE: 'price',
  DISCOUNT_PERCENTAGE: 'discountPercentage',
  WEIGHT: 'weight',
  SHORT_DESCRIPTION: 'shortDescription',
  LONG_DESCRIPTION: 'longDescription',
  SETS: 'sets',
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
                    disabled={disabled}
                    checked={selectedGroup === set._id}
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

  if (action.type === 'REMOVE_SET') {
    product.sets.splice(action.index, 1);
  } else {
    const field = action.field;
    let value = action.value;
    switch (action.field) {
      case fields.LIMIT_STOCK:
        if (value === 'false') value = false;
        else value = true;
        break;
      case fields.STOCK_NUMBER:
        value = state.product.stockNumber + action.value;
        break;
      case fields.SETS:
        value = [...state.product.sets, action.value];
        break;
    }
    product = {
      ...product,
      [field]: value,
    };
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
  const router = useRouter();
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

  const onChange = (value, field) => {
    dispatchProductState({
      value: value,
      field: field,
      type: 'FIELD',
    });
  };

  const [productState, dispatchProductState] = useReducer(productReducer, {
    product: {
      code: '',
      name: '',
      limitStock: false,
      stockNumber: 0,
      categoryId: '',
      sectionId: '',
      price: '',
      discountPercentage: '',
      weight: '',
      shortDescription: '',
      longDescription: '',
      sets: [],
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

  // Temporary Options info
  const [tempSet, setTempSet] = useState({
    colorId: '',
    sizeSets: {},
    images: [],
    extraOptions: [],
  });
  const [selectedColorName, setSelectedColorName] = useState('');

  const onRemoveSet = (index) => {
    dispatchProductState({
      index: index,
      type: 'REMOVE_SET',
    });
  };

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

  const setSelectedSizeSets = (callback) => {
    setTempSet((list) => ({
      ...list,
      sizeSets: callback(list.sizeSets),
    }));
  };

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
      // setTempSizeSetGroupId('');
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

  const onAddOption = () => {
    if (tempSet.colorId.length > 1) {
      onChange({ ...tempSet }, fields.SETS);
      setTempSet({
        colorId: '',
        sizeSets: {},
        images: [],
        extraOptions: [],
      });
      setSelectedColorName('');
      setToggleUnique(false);
      setToggleCustom(false);
    } else {
      window.scrollTo(0, 0);
      setConfirmationMessage(
        'Por favor, escolha pelo menos a cor desta opção!'
      );
      setCancelText('');
      setShowError(true);
    }
  };

  // Extra options
  const [tempExtraOptName, setTempExtraOptName] = useState('');
  const [tempExtraOptOption, setTempExtraOptOption] = useState('');
  const [tempExtraOptOptions, setTempExtraOptOptions] = useState([]);

  const onAddExtraOpt = () => {
    const name = tempExtraOptName;
    const opts = [...tempExtraOptOptions];

    setConfirmationMessage(
      'Opção extra precisa de um nome e no mínimo 2 opções!'
    );
    if (name.length > 0 && opts.length > 1) {
      if (
        tempSet.extraOptions.findIndex(
          (opt) => opt.name.toLowerCase().trim() === name.toLowerCase().trim()
        ) >= 0
      ) {
        setConfirmationMessage('Esta opção extra já existe!');
      } else {
        setTempSet((list) => ({
          ...list,
          extraOptions: [
            ...list.extraOptions,
            {
              name: name,
              options: opts,
            },
          ],
        }));
        setTempExtraOptOptions([]);
        setTempExtraOptName('');
        return;
      }
    }
    window.scrollTo(0, 0);
    setCancelText('');
    setShowError(true);
  };

  const onDeleteExtraOpt = (name) => {
    setTempSet((list) => {
      let newList = { ...list };
      let extras = [...list.extraOptions];
      console.log(extras.findIndex((opt) => opt.name === name));
      extras.splice(
        extras.findIndex((opt) => opt.name === name),
        1
      );
      newList.extraOptions = extras;
      return newList;
    });
  };

  const onAddExtraOptOption = () => {
    const name = tempExtraOptOption;
    if (
      tempExtraOptOptions.findIndex(
        (opt) => opt.toLowerCase().trim() === name.toLowerCase().trim()
      ) >= 0
    ) {
      window.scrollTo(0, 0);
      setCancelText('');
      setShowError(true);
      setConfirmationMessage('Esta opção extra já existe!');
      return;
    }
    setTempExtraOptOptions((values) => [...values, name]);
    setTempExtraOptOption('');
  };

  const onDeleteExtraOptOption = (index) => {
    setTempExtraOptOptions((values) => {
      let newValues = [...values];
      newValues.splice(index, 1);
      return newValues;
    });
  };

  const onCancel = () => {
    router.replace({
      pathname: '/admin',
    });
  };

  // Dialog
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showError, setShowError] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [cancelText, setCancelText] = useState('');
  const [okText, setOkText] = useState('');

  const onSave = (event) => {
    event.preventDefault();

    if (!validate()) {
      window.scrollTo(0, 0);
      setCancelText('');
      setShowError(true);
      return;
    }

    setConfirmationMessage(
      'Por favor, confira o novo produto antes de salvar:'
    );
    setShowConfirmation(true);
    setCancelText('Cancelar');
    window.scrollTo(0, 0);
  };

  // Validations
  const [codeValidation, setCodeValidation] = useState(true);
  const [nameValidation, setNameValidation] = useState(true);
  const [categoryValidation, setCategoryValidation] = useState(true);
  const [sectionValidation, setSectionValidation] = useState(true);
  const [stockValidation, setStockValidation] = useState(true);
  const [priceValidation, setPriceValidation] = useState(true);
  const [weightValidation, setWeightValidation] = useState(true);
  const [shortDescValidation, setShortDescValidation] = useState(true);
  const [longDescValidation, setLongDescValidation] = useState(true);

  const validate = () => {
    setCodeValidation(true);
    if (!productState.product.code.length > 0) {
      setCodeValidation(false);
      setConfirmationMessage('O campo Código não pode estar em branco!');
      return false;
    }

    setNameValidation(true);
    if (!productState.product.name.length > 0) {
      setNameValidation(false);
      setConfirmationMessage('O campo Nome não pode estar em branco!');
      return false;
    }

    setCategoryValidation(true);
    if (!productState.product.categoryId.length > 0) {
      setCategoryValidation(false);
      setConfirmationMessage('Escolha uma Categoria!');
      return false;
    }

    setSectionValidation(true);
    if (!productState.product.sectionId.length > 0) {
      setSectionValidation(false);
      setConfirmationMessage('Escolha uma Seção!');
      return false;
    }

    setStockValidation(true);
    if (
      productState.product.limitStock &&
      productState.product.stockNumber === 0
    ) {
      setStockValidation(false);
      setConfirmationMessage('Estoque não pode ser limitado à 0!');
      return false;
    }

    setPriceValidation(true);
    if (!productState.product.price.length > 0) {
      setPriceValidation(false);
      setConfirmationMessage('Digite um preço!');
      return false;
    }

    setPriceValidation(true);
    if (productState.product.price.match(/\./g).length > 1) {
      setPriceValidation(false);
      setConfirmationMessage('Preço precitar ter somente um ponto!');
      return false;
    }

    setWeightValidation(true);
    if (!productState.product.weight.length > 0) {
      setWeightValidation(false);
      setConfirmationMessage(
        'Digite um peso! Isso será importante para calcular fretes!'
      );
      return false;
    }

    setWeightValidation(true);
    if (productState.product.weight.match(/\./g).length > 1) {
      setWeightValidation(false);
      setConfirmationMessage('Peso precitar ter somente um ponto!');
      return false;
    }

    setShortDescValidation(true);
    if (!productState.product.shortDescription.length > 0) {
      setShortDescValidation(false);
      setConfirmationMessage('Digite uma descrição curta!');
      return false;
    }

    setLongDescValidation(true);
    if (!productState.product.longDescription.length > 0) {
      setLongDescValidation(false);
      setConfirmationMessage('Digite uma descrição Longa!');
      return false;
    }

    if (!productState.product.sets.length > 0) {
      setConfirmationMessage(
        'Este produto precisa de pelo menos um grupo de Opções!'
      );
      return false;
    }

    return true;
  };

  const onConfirmation = (event) => {
    event.preventDefault();
  };

  const onDismissConfirmation = (event) => {
    event.preventDefault();
    setShowConfirmation(false);
    setShowError(false);
  };

  return (
    <Admin>
      <div
        id="top"
        className={[styles.wrapper, styles.centeredColumn].join(' ')}
      >
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
          <form className={styles.form} onSubmit={onSave}>
            <span>
              <label htmlFor="code">
                Código:
                <span className={styles.inpwbutton}>
                  <Input
                    id="code"
                    className={[styles.inp_text, styles.uppercase].join(' ')}
                    onChange={(e) => onChange(e.target.value, fields.CODE)}
                    value={productState.product.code}
                    valid={codeValidation}
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
                  valid={nameValidation}
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
                  valid={categoryValidation}
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
                  valid={sectionValidation}
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
                      value={false}
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
                      value={true}
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
                    disabled={!productState.product.limitStock}
                    value={productState.product.stockNumber}
                    valid={stockValidation}
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
                    valid={priceValidation}
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
                    valid={weightValidation}
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
                  valid={shortDescValidation}
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
                  valid={longDescValidation}
                />
              </label>
            </span>
            {productState.product.sets.length > 0 && (
              <span>
                Opções:
                <table>
                  {productState.product.sets.map((set, index) => (
                    <tbody key={set.colorId}>
                      <tr>
                        <td colSpan={2} className={styles.tbodySeparator}></td>
                      </tr>
                      <tr>
                        <td>Cor:</td>
                        <td className={styles.capitalize}>
                          {colorList.find((c) => c._id === set.colorId).text}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          {'Tamanhos: '}
                          {set.sizeSets.unique ||
                          Object.getOwnPropertySymbols(set.sizeSets).length > 0
                            ? ''
                            : 'Sem Tamanho'}
                        </td>
                      </tr>
                      {set.sizeSets.unique && (
                        <tr>
                          <td>Único:</td>
                          <td className={styles.uppercase}>
                            {(function () {
                              let text = '';
                              for (const k in set.sizeSets.unique
                                .availableSizes) {
                                if (text.length > 0) text = text + ' - ';
                                if (
                                  Object.hasOwnProperty.call(
                                    set.sizeSets.unique.availableSizes,
                                    k
                                  )
                                ) {
                                  text = text + k;
                                }
                              }
                              return text;
                            })()}
                          </td>
                        </tr>
                      )}
                      {Object.getOwnPropertySymbols(set.sizeSets).length >
                        0 && (
                        <tr>
                          <td>Personalizado:</td>
                          <td>
                            {Object.getOwnPropertySymbols(set.sizeSets).map(
                              (size) => (
                                <span
                                  key={set.sizeSets[size].name}
                                  className={styles.block}
                                >
                                  {set.sizeSets[size].name}
                                  {': '}
                                  {(function () {
                                    let text = '';
                                    for (const k in set.sizeSets[size]
                                      .availableSizes) {
                                      if (text.length > 0) text = text + ' - ';
                                      if (
                                        Object.hasOwnProperty.call(
                                          set.sizeSets[size].availableSizes,
                                          k
                                        )
                                      ) {
                                        text = text + k;
                                      }
                                    }
                                    return text.toUpperCase();
                                  })()}
                                </span>
                              )
                            )}
                          </td>
                        </tr>
                      )}
                      {set.extraOptions.length > 0 && (
                        <tr>
                          <td>Opções Extras:</td>
                          <td>
                            {set.extraOptions.map((opt) => (
                              <span
                                key={opt.name}
                                className={[
                                  styles.block,
                                  styles.capitalize,
                                ].join(' ')}
                              >
                                {opt.name}
                                {': '}
                                {opt.options.join(' / ')}
                              </span>
                            ))}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={2}>
                          <Button
                            className={[
                              styles.buttonSmall,
                              styles.buttonRed,
                            ].join(' ')}
                            type="button"
                            onClick={() => onRemoveSet(index)}
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
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </span>
            )}
            <span className={styles.sets}>
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
                      onChange={(v) => {
                        setTempSet((list) => ({ ...list, colorId: v }));
                        setSelectedColorName(colors.find(c => c.id === v).text);
                      }}
                      colors={colors}
                      value={selectedColorName}
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
                          checked={toggleUnique}
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
                        typeof tempSet.sizeSets.unique === 'undefined'
                          ? {}
                          : tempSet.sizeSets.unique.availableSizes
                      }
                      selectedGroup={
                        typeof tempSet.sizeSets.unique === 'undefined'
                          ? {}
                          : tempSet.sizeSets.unique.sizeSetId
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
                              // setTempSizeSetGroupId('');
                              setTempSizeSetSizes({});
                              setToggleCustom(false);
                            } else {
                              setToggleCustom(true);
                            }
                          }}
                          checked={toggleCustom}
                        />
                      </span>
                      Personalizados
                    </label>
                    {Object.getOwnPropertySymbols(tempSet.sizeSets).map((s) => {
                      return (
                        <div
                          className={[
                            styles.centeredColumn,
                            styles.paddingTwo,
                            styles.marginTwo,
                            styles.lineBotton,
                          ].join(' ')}
                          key={tempSet.sizeSets[s].name}
                        >
                          <span
                            className={[
                              styles.paddingTwo,
                              styles.width100,
                            ].join(' ')}
                          >
                            {tempSet.sizeSets[s].name}
                          </span>

                          <span className={styles.gridLine}>
                            {sizeSets
                              .find(
                                (si) => si._id === tempSet.sizeSets[s].sizeSetId
                              )
                              .sizes.map((size) => (
                                <span
                                  key={tempSet.sizeSets[s].name + size}
                                  className={[
                                    styles.tag,
                                    typeof tempSet.sizeSets[s].availableSizes[
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
                <span>
                  Opções Extras:
                  <div className={[styles.sizeGroup, styles.padding].join(' ')}>
                    {tempSet.extraOptions.map((opt) => (
                      <span key={'extraOpts_' + opt.name}>
                        <table className={styles.width100}>
                          <tbody>
                            <tr className={styles.capitalize}>
                              <td>
                                {opt.name}
                                <ol>
                                  {opt.options.map((op) => (
                                    <li key={'op_' + op}>{op}</li>
                                  ))}
                                </ol>
                              </td>
                              <td className={styles.width3}>
                                <Button
                                  className={[
                                    styles.button,
                                    styles.buttonSmall,
                                    styles.buttonRed,
                                  ].join(' ')}
                                  type="button"
                                  onClick={() => onDeleteExtraOpt(opt.name)}
                                >
                                  {'-'}
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </span>
                    ))}
                    <span>
                      <Input
                        id="extraOptName"
                        placeholder="Nome"
                        className={styles.inp_text}
                        value={tempExtraOptName}
                        onChange={(e) => setTempExtraOptName(e.target.value)}
                      />
                    </span>
                    <span>
                      <table className={styles.width100}>
                        <tbody>
                          {tempExtraOptOptions.map((opt, index) => (
                            <tr key={opt} className={styles.width100}>
                              <td className={styles.width3}>{index + 1}.</td>
                              <td className={styles.capitalize}>{opt}</td>
                              <td className={styles.width3}>
                                <Button
                                  className={[
                                    styles.button,
                                    styles.buttonSmall,
                                    styles.buttonRed,
                                  ].join(' ')}
                                  type="button"
                                  onClick={() => onDeleteExtraOptOption(index)}
                                >
                                  {'-'}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </span>
                    <span
                      className={[styles.inpwbutton, styles.marginTop].join(
                        ' '
                      )}
                    >
                      <Input
                        id="extraOpt"
                        placeholder="Opção"
                        className={styles.inp_text}
                        value={tempExtraOptOption}
                        onChange={(e) => setTempExtraOptOption(e.target.value)}
                      />
                      <Button
                        className={[styles.button, styles.buttonSmall].join(
                          ' '
                        )}
                        type="button"
                        onClick={onAddExtraOptOption}
                      >
                        +
                      </Button>
                    </span>
                    <span>
                      <Button
                        type="button"
                        onClick={onAddExtraOpt}
                        className={[styles.button, styles.marginTop].join(' ')}
                      >
                        Adicionar Opção Extra
                      </Button>
                    </span>
                  </div>
                </span>
                <span>
                  <Button
                    className={styles.button}
                    type="button"
                    onClick={onAddOption}
                  >
                    Adicionar Opção
                  </Button>
                </span>
              </div>
            </span>
            <span>
              <Button
                className={styles.button}
                type="button"
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button className={styles.button} type="submit">
                Salvar
              </Button>
            </span>
          </form>
        </section>
      </div>
      <ConfirmationDialog
        show={showError}
        onCancel={onDismissConfirmation}
        onConfirm={onDismissConfirmation}
        message={confirmationMessage}
        cancelText={cancelText}
        okText={okText}
      />
      <ConfirmationDialog
        show={showConfirmation}
        onCancel={onDismissConfirmation}
        onConfirm={onConfirmation}
        message={confirmationMessage}
        cancelText={cancelText}
        okText={okText}
        className={styles.resumeBox}
      >
        <div className={styles.resume}>
          <table>
            <tbody>
              <tr>
                <td>Código:</td>
                <td className={styles.uppercase}>
                  {productState.product.code}
                </td>
              </tr>
              <tr>
                <td>Nome:</td>
                <td>{productState.product.name}</td>
              </tr>
              <tr>
                <td>Categoria:</td>
                <td className={styles.capitalize}>
                  {productState.product.categoryId &&
                    categoryList.find(
                      (c) => c._id === productState.product.categoryId
                    ).text}
                </td>
              </tr>
              <tr>
                <td>Seção:</td>
                <td className={styles.capitalize}>
                  {productState.product.sectionId &&
                    sectionList.find(
                      (c) => c._id === productState.product.sectionId
                    ).text}
                </td>
              </tr>
              <tr>
                <td>Estoque:</td>
                <td className={styles.capitalize}>
                  {productState.product.limitStock
                    ? 'Limitado à ' +
                      productState.product.stockNumber +
                      ' unidades'
                    : 'Ilimitado'}
                </td>
              </tr>
              <tr>
                <td>Preço:</td>
                <td className={styles.capitalize}>
                  {'R$ '}
                  {(+productState.product.price).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>Desconto:</td>
                <td className={styles.capitalize}>
                  {productState.product.discountPercentage
                    ? (+productState.product.discountPercentage).toFixed(2) +
                      '%'
                    : 'Sem desconto'}
                </td>
              </tr>
              <tr>
                <td>Peso Unitário:</td>
                <td className={styles.capitalize}>
                  {productState.product.weight}
                  {' Kg'}
                </td>
              </tr>
              <tr>
                <td>Descrição Curta:</td>
                <td className={styles.capitalize}>
                  {productState.product.shortDescription}
                </td>
              </tr>
              <tr>
                <td>Descrição Longa:</td>
                <td className={styles.textLong}>
                  {productState.product.longDescription}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>Opções:</td>
              </tr>
            </tbody>
            {productState.product.sets.map((set) => (
              <tbody key={set.colorId}>
                <tr>
                  <td colSpan={2} className={styles.tbodySeparator}></td>
                </tr>
                <tr>
                  <td>Cor:</td>
                  <td className={styles.capitalize}>
                    {colorList.find((c) => c._id === set.colorId).text}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    {'Tamanhos: '}
                    {set.sizeSets.unique ||
                    Object.getOwnPropertySymbols(set.sizeSets).length > 0
                      ? ''
                      : 'Sem Tamanho'}
                  </td>
                </tr>
                {set.sizeSets.unique && (
                  <tr>
                    <td>Único:</td>
                    <td className={styles.uppercase}>
                      {(function () {
                        let text = '';
                        for (const k in set.sizeSets.unique.availableSizes) {
                          if (text.length > 0) text = text + ' - ';
                          if (
                            Object.hasOwnProperty.call(
                              set.sizeSets.unique.availableSizes,
                              k
                            )
                          ) {
                            text = text + k;
                          }
                        }
                        return text;
                      })()}
                    </td>
                  </tr>
                )}
                {Object.getOwnPropertySymbols(set.sizeSets).length > 0 && (
                  <tr>
                    <td>Personalizado:</td>
                    <td>
                      {Object.getOwnPropertySymbols(set.sizeSets).map(
                        (size) => (
                          <span
                            key={set.sizeSets[size].name}
                            className={styles.block}
                          >
                            {set.sizeSets[size].name}
                            {': '}
                            {(function () {
                              let text = '';
                              for (const k in set.sizeSets[size]
                                .availableSizes) {
                                if (text.length > 0) text = text + ' - ';
                                if (
                                  Object.hasOwnProperty.call(
                                    set.sizeSets[size].availableSizes,
                                    k
                                  )
                                ) {
                                  text = text + k;
                                }
                              }
                              return text.toUpperCase();
                            })()}
                          </span>
                        )
                      )}
                    </td>
                  </tr>
                )}
                {set.extraOptions.length > 0 && (
                  <tr>
                    <td>Opções Extras:</td>
                    <td>
                      {set.extraOptions.map((opt) => (
                        <span
                          key={opt.name}
                          className={[styles.block, styles.capitalize].join(
                            ' '
                          )}
                        >
                          {opt.name}
                          {': '}
                          {opt.options.join(' / ')}
                        </span>
                      ))}
                    </td>
                  </tr>
                )}
              </tbody>
            ))}
          </table>
        </div>
      </ConfirmationDialog>
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
