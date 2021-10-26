import { useEffect, useReducer, useState } from 'react';
import { getSession } from 'next-auth/client';

import styles from './styles.module.scss';
import ConfirmationDialog from '../../../components/utilities/ConfirmationDialog';
import { useRouter } from 'next/router';
import Admin from '../../../components/admin/Admin';
import {
  Input,
  InputNumber,
  InputRadio,
  SelectText,
  SelectColor,
  Textarea,
  InputCheck,
  InputFile,
} from '../../../components/utilities/FormComponents';
import Button from '../../../components/utilities/Button';
import { getCategories, getSections } from '../../../data/access/appInfo';
import { getColors } from '../../../data/access/colors';
import { getSizeSets } from '../../../data/access/sizeSets';

const fields = {
  ID: 'id',
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
                <label htmlFor={'op' + name + set._id}>
                  <InputRadio
                    id={'op' + name + set._id}
                    name={name}
                    value={set._id}
                    disabled={disabled}
                    checked={selectedGroup === set._id}
                    onChange={(e) => {
                      onSelectGroup(name, e.target.value);
                    }}
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
  }
  if (action.type === 'CLEAR_ALL') {
    return {
      product: {
        id: '',
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
    };
  }
  if (action.type === 'POPULATE_ALL') {
    // Arrays to Objects
    let sets = action.product.sets.map((set) => {
      let sizeSetsObj = {};
      set.sizeSets.forEach((size) => {
        let name;
        if (size.isUnique) name = size.name;
        else name = Symbol(size.name);
        let availableSizesObj = {};
        size.availableSizes.forEach((av) => {
          availableSizesObj[av] = av;
        });
        sizeSetsObj[name] = {
          name: size.name,
          isUnique: size.isUnique,
          sizeSetId: size.sizeSetId,
          availableSizes: availableSizesObj,
        };
      });
      return {
        colorId: set.colorId,
        images: set.images,
        extraOptions: set.extraOptions,
        sizeSets: sizeSetsObj,
      };
    });

    product = {
      id: action.product._id,
      code: action.product.code,
      name: action.product.name,
      limitStock: action.product.limitStock,
      stockNumber: action.product.stockNumber || 0,
      categoryId: action.product.categoryId,
      sectionId: action.product.sectionId,
      price: action.product.price,
      discountPercentage: action.product.discountPercentage,
      weight: action.product.weight,
      shortDescription: action.product.shortDescription,
      longDescription: action.product.longDescription,
      sets: sets,
    };
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
  session,
  categoryList,
  colorList,
  sectionList,
  sizeSetList,
}) => {
  const router = useRouter();

  // Lists of Schemas
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sections, setSections] = useState([]);
  const [sizeSets, setSizeSets] = useState([]);

  // Extra options
  const [tempExtraOptName, setTempExtraOptName] = useState('');
  const [tempExtraOptOption, setTempExtraOptOption] = useState('');
  const [tempExtraOptOptions, setTempExtraOptOptions] = useState([]);

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
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [selectedSectionName, setSelectedSectionName] = useState('');
  const [imagesData, setImagesData] = useState([]);

  // temp Custom Options info
  const [tempSizeSetName, setTempSizeSetName] = useState('');
  const [tempSizeSetGroupId, setTempSizeSetGroupId] = useState();
  const [tempSizeSetSizes, setTempSizeSetSizes] = useState({});

  // Dialog
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [cancelText, setCancelText] = useState('');
  const [okText, setOkText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validations
  const [codeValidation, setCodeValidation] = useState(true);
  const [nameValidation, setNameValidation] = useState(true);
  const [categoryValidation, setCategoryValidation] = useState(true);
  const [sectionValidation, setSectionValidation] = useState(true);
  const [stockValidation, setStockValidation] = useState(true);
  const [priceValidation, setPriceValidation] = useState(true);
  const [discountPercentageValidation, setDiscountPercentageValidation] =
    useState(true);
  const [weightValidation, setWeightValidation] = useState(true);
  const [shortDescValidation, setShortDescValidation] = useState(true);
  const [longDescValidation, setLongDescValidation] = useState(true);

  const [productState, dispatchProductState] = useReducer(productReducer, {
    product: {
      id: '',
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

  // Prepare lists
  useEffect(() => {
    setCategories(categoryList.map((c) => ({ id: c._id, text: c.name })));
    setSections(sectionList.map((c) => ({ id: c._id, text: c.name })));
    setSizeSets(sizeSetList);
    setColors(
      colorList.map((c) => ({ id: c._id, text: c.name, code: c.code }))
    );
  }, []);

  // Set field to Reducer
  const onChange = (value, field) => {
    dispatchProductState({
      value: value,
      field: field,
      type: 'FIELD',
    });
  };

  // Remove Set
  const onRemoveSet = (index) => {
    const prodImages = productState.product.sets[index].images;
    dispatchProductState({
      index: index,
      type: 'REMOVE_SET',
    });
    setImagesData((oldArray) => {
      let newArray = oldArray.filter(
        (item) => prodImages.findIndex((i) => i === item.uniId) < 0
      );
      return [...newArray];
    });
  };

  // Add new Set
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

  // Set selected size from Size Group
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

  // Set Size Group
  const setSelectedSizeSets = (callback) => {
    setTempSet((list) => ({
      ...list,
      sizeSets: callback(list.sizeSets),
    }));
  };

  // Add new Custom Sizes Group
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
      setTempSizeSetSizes({});
    }
  };

  // Removes all Symbol() from SizeSets obj
  const onNoCustom = () => {
    setSelectedSizeSets((list) => JSON.parse(JSON.stringify(list)));
  };

  // Delete Custom Size Group
  const onRemoveCustom = (symbol) => {
    setSelectedSizeSets((list) => {
      let newList = { ...list };
      delete newList[symbol];
      return newList;
    });
  };

  // Add Option Group
  const onAddOption = () => {
    if (
      productState.product.sets.findIndex(
        (set) => set.colorId === tempSet.colorId
      ) >= 0
    ) {
      setConfirmationMessage(
        'Esta cor já foi escolhida. Por favor, escolha outra!'
      );
      window.scrollTo(0, 0);
      setCancelText('');
      setOkText('Ok');
      setShowDialog(true);
      return;
    }

    if (tempSet.colorId.length < 1) {
      setConfirmationMessage(
        'Por favor, escolha pelo menos a cor desta opção!'
      );
      window.scrollTo(0, 0);
      setCancelText('');
      setOkText('Ok');
      setShowDialog(true);
      return;
    }

    if (tempSet.images.length < 1) {
      setConfirmationMessage(
        'Por favor, Adicione pelo menos uma foto do produto!'
      );
      window.scrollTo(0, 0);
      setCancelText('');
      setOkText('Ok');
      setShowDialog(true);
      return;
    }

    onChange({ ...tempSet }, fields.SETS);
    setTempSet({
      colorId: '',
      sizeSets: {},
      images: [],
      extraOptions: [],
    });

    setSelectedColorName('Selecione');
    setToggleUnique(false);
    setToggleCustom(false);
  };

  // Add Extra Option Group
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
    setShowDialog(true);
  };

  // Delete Extra Option Group
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

  // Add item to Extra Options
  const onAddExtraOptOption = () => {
    const name = tempExtraOptOption;
    if (name.length > 0) {
      if (
        tempExtraOptOptions.findIndex(
          (opt) => opt.toLowerCase().trim() === name.toLowerCase().trim()
        ) >= 0
      ) {
        window.scrollTo(0, 0);
        setCancelText('');
        setShowDialog(true);
        setConfirmationMessage('Esta opção extra já existe!');
        return;
      }
      setTempExtraOptOptions((values) => [...values, name]);
      setTempExtraOptOption('');
    }
  };

  // Delete item from Extra Options
  const onDeleteExtraOptOption = (index) => {
    setTempExtraOptOptions((values) => {
      let newValues = [...values];
      newValues.splice(index, 1);
      return newValues;
    });
  };

  // Cancel Save and redirect to main page
  const onCancel = () => {
    router.replace({
      pathname: '/admin',
    });
  };

  // Populate form after search by Code
  const populateForm = (product) => {
    dispatchProductState({ type: 'POPULATE_ALL', product: product });
    setSelectedSectionName(
      sections.find((s) => s.text === product.sectionName).text || ''
    );
    setSelectedCategoryName(
      categories.find((c) => c.text === product.categoryName).text || ''
    );
  };

  // Validate Form becore Save
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
    if (!productState.product.price.toString().length > 0) {
      setPriceValidation(false);
      setConfirmationMessage('Digite um preço!');
      return false;
    }

    setPriceValidation(true);
    if (productState.product.price.toString().match(/\./g).length > 1) {
      setPriceValidation(false);
      setConfirmationMessage('Preço precitar ter somente um ponto!');
      return false;
    }

    setDiscountPercentageValidation(true);
    if (
      productState.product.discountPercentage.length > 0 &&
      (+productState.product.discountPercentage < 0 ||
        +productState.product.discountPercentage > 100)
    ) {
      setDiscountPercentageValidation(false);
      setConfirmationMessage('Valor para desconto inválido!');
      return false;
    }

    setWeightValidation(true);
    if (productState.product.weight.toString().length <= 0) {
      setWeightValidation(false);
      setConfirmationMessage(
        'Digite um peso! Isso será importante para calcular fretes!'
      );
      return false;
    }

    setWeightValidation(true);
    if (productState.product.weight.toString().match(/\./g).length > 1) {
      setWeightValidation(false);
      setConfirmationMessage('Peso precitar ter somente um ponto!');
      return false;
    }

    setShortDescValidation(true);
    if (productState.product.shortDescription.length <= 0) {
      setShortDescValidation(false);
      setConfirmationMessage('Digite uma descrição curta!');
      return false;
    }

    setLongDescValidation(true);
    if (productState.product.longDescription.length <= 0) {
      setLongDescValidation(false);
      setConfirmationMessage('Digite uma descrição Longa!');
      return false;
    }

    if (productState.product.sets.length <= 0) {
      setConfirmationMessage(
        'Este produto precisa de pelo menos um grupo de Opções!'
      );
      return false;
    }

    return true;
  };

  // Dismiss Dialog
  const onDismissConfirmation = (event) => {
    event.preventDefault();
    setShowConfirmation(false);
    setShowDialog(false);
  };

  // Clear Form
  const resetForm = () => {
    dispatchProductState({ type: 'CLEAR_ALL' });

    // Extra options
    setTempExtraOptName('');
    setTempExtraOptOption('');
    setTempExtraOptOptions([]);

    //toggles
    setToggleUnique(false);
    setToggleCustom(false);

    // Temporary Options info
    setTempSet({
      colorId: '',
      sizeSets: {},
      images: [],
      extraOptions: [],
    });
    setSelectedColorName('Selecione');
    setSelectedCategoryName('Selecione');
    setSelectedSectionName('Selecione');
    setImagesData([]);

    // temp Custom Options info
    setTempSizeSetName('');
    setTempSizeSetGroupId();
    setTempSizeSetSizes({});

    // Dialog
    setShowConfirmation(false);
    setShowResume(false);
    setShowDialog(false);
    setConfirmationMessage('');
    setCancelText('');
    setOkText('');
    setIsLoading(false);

    // Validations
    setCodeValidation(true);
    setNameValidation(true);
    setCategoryValidation(true);
    setSectionValidation(true);
    setStockValidation(true);
    setPriceValidation(true);
    setDiscountPercentageValidation(true);
    setWeightValidation(true);
    setShortDescValidation(true);
    setLongDescValidation(true);
  };

  // Save images to image Array
  const onSetImages = (event) => {
    event.preventDefault();
    let names = [];
    let files = [...event.target.files];
    files.forEach((file) => {
      let name = new Date().toISOString();
      name = name.replace(/[^a-z0-9]/gi, '');
      file.uniId = name + '_' + file.name;
      names.push(file.uniId);
    });

    setImagesData((oldArray) => {
      let newArray = oldArray.filter(
        (item) => tempSet.images.findIndex((i) => i === item.uniId) < 0
      );
      return [...newArray, ...files];
    });
    setTempSet((temp) => ({
      ...temp,
      images: names,
    }));
  };

  // Search Product by field Code
  const onSearchByCode = async (event) => {
    event.preventDefault();
    const code = productState.product.code;

    if (!!code) {
      setIsLoading(true);
      setConfirmationMessage('Carregando...');
      setShowDialog(true);
      const product = await fetch(`/api/admin/products?code=${code}`);
      setShowDialog(false);
      setIsLoading(false);

      const data = await product.json();

      switch (product.status) {
        case 200:
          window.scrollTo(0, 0);
          populateForm(data.product);
          break;
        case 404:
          window.scrollTo(0, 0);
          setConfirmationMessage('Não Encontrado');
          setShowDialog(true);
          break;
        case 400:
          window.alert(data.message);
          break;
        case 401:
          window.alert(
            'Você não está autorizado a fazer isso. Por favor, faça o login novamente.'
          );
          break;
        case 500:
        default:
          window.alert(
            'Ops, Erro interno! Por favor, contate o Administrador.'
          );
          break;
      }
    }
  };

  // Confirm Action
  const onConfirmForm = (event) => {
    event.preventDefault();

    if (!validate()) {
      window.scrollTo(0, 0);
      setCancelText('');
      setOkText('');
      setShowDialog(true);
      return;
    }

    if (productState.product.id.length > 0) {
      setShowResume(false);
      setConfirmationMessage(
        'ATENÇÃO: Você está prestes a remover este produto do site. Esta ação não tem volta! Deseja continuar?'
      );
      setCancelText('Cancelar');
      setOkText('Deletar');
      setShowConfirmation(true);
    } else {
      setShowResume(true);
      setConfirmationMessage(
        'Por favor, confira o novo produto antes de salvar:'
      );
      setShowConfirmation(true);
      setCancelText('Cancelar');
      setOkText('Salvar');
    }

    window.scrollTo(0, 0);
  };

  // Direct Action to Save or Delete
  const onDirectAction = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setOkText('');
    setCancelText('');
    setShowDialog(true);

    let result;
    if (productState.product.id.length > 0) {
      result = await onDeleteProduct();
    } else {
      result = await onSaveProduct();
    }

    const data = await result.json();

    window.scrollTo(0, 0);
   
    setShowConfirmation(false);
    setShowResume(false);
    setShowDialog(true);
    setCancelText('');
    setOkText('');

    switch (result.status) {
      case 200:
        resetForm();
        setConfirmationMessage(
          'Deletado com sucesso.'
        );
        break;
      case 201:
        resetForm();
        setConfirmationMessage('Salvo com sucesso!');
        // onChange(data.product._id, fields.ID);
        break;
      case 400:
        setConfirmationMessage(data.message);
        break;
      case 401:
        setConfirmationMessage(
          'Você não está autorizado a fazer isso. Por favor, faça o login novamente.'
        );
        break;
      case 500:
      default:
        setConfirmationMessage(
          'Ops, Erro interno! Por favor, contate o Administrador.'
        );
        break;
    }
    setIsLoading(false);
    setShowDialog(true);
  };

  // Save Product
  const onSaveProduct = async () => {
    setConfirmationMessage('Salvando...');

    // Transform Objects to Arrays
    let newProduct = { ...productState.product };
    let newSets = [];
    newProduct.sets.forEach((set) => {
      let arrayOfSizeSetsProps = Object.values(set.sizeSets) || [];
      let arrayOfSizeSetsPropsAndSymbols = arrayOfSizeSetsProps.concat(
        Object.getOwnPropertySymbols(set.sizeSets).map((sizeSet) => ({
          ...set.sizeSets[sizeSet],
        }))
      );
      let finalArray = [];
      arrayOfSizeSetsPropsAndSymbols.forEach((element) => {
        finalArray.push({
          ...element,
          availableSizes: Object.values(element.availableSizes),
        });
      });
      newSets.push({ ...set, sizeSets: finalArray });
    });
    newProduct.sets = newSets;
    delete newProduct.id;

    const formData = new FormData();
    let method = 'POST';

    formData.append('product', JSON.stringify(newProduct));
    imagesData.forEach((image) => {
      formData.append(image.uniId, image);
    });

    const createdProduct = await fetch('/api/admin/products', {
      method: method,
      body: formData,
    });

    return createdProduct;
  };

  // Delete Product
  const onDeleteProduct = async () => {
    const id = productState.product.id;
    const auth = 'AJSKOFDHJDASD';

    setConfirmationMessage('Deletando...');

    const deletedProduct = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, auth: auth }),
    });

    return deletedProduct;
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
          <form
            method="post"
            className={styles.form}
            onSubmit={onConfirmForm}
            encType="multipart/form-data"
          >
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
                    minLength={4}
                    maxLength={10}
                  />
                  <Button
                    className={styles.button}
                    type="button"
                    onClick={onSearchByCode}
                  >
                    Buscar
                  </Button>
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
                  placeholder="Limite de 25 caracteres"
                  value={productState.product.name}
                  valid={nameValidation}
                  minLength={4}
                  maxLength={25}
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
                  options={categories}
                  valid={categoryValidation}
                  onChange={(v) => {
                    onChange(v, fields.CATEGORY);
                    setSelectedCategoryName((_) => {
                      let category = categories.find((c) => c.id === v);
                      if (category) return category.name;
                      else return 'Selecione';
                    });
                  }}
                  value={selectedCategoryName}
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
                  options={sections}
                  valid={sectionValidation}
                  onChange={(v) => {
                    onChange(v, fields.SECTION);
                    setSelectedSectionName((_) => {
                      let section = sections.find((s) => s.id === v);
                      if (section) return section.name;
                      else return 'Selecione';
                    });
                  }}
                  value={selectedSectionName}
                />
              </label>
            </span>
            <span>
              Estoque:
              <span
                className={[styles.inp_check_line, styles.group_line].join(' ')}
              >
                <span>
                  <label htmlFor="prod_limitStock_nolimit">
                    <InputRadio
                      id="prod_limitStock_nolimit"
                      name={'limitStock'}
                      value={false}
                      checked={!productState.product.limitStock}
                      onChange={(e) =>
                        onChange(e.target.value, fields.LIMIT_STOCK)
                      }
                    />
                    Sem Limite
                  </label>
                </span>
                <span>
                  <label htmlFor="prod_limitStock_limit">
                    <InputRadio
                      id="prod_limitStock_limit"
                      name="limitStock"
                      value={true}
                      checked={productState.product.limitStock}
                      onChange={(e) =>
                        onChange(e.target.value, fields.LIMIT_STOCK)
                      }
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
                    valid={discountPercentageValidation}
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
                  minLength={5}
                  maxLength={40}
                  placeholder="Limite de 40 caracteres"
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
                  minLength={50}
                  maxLength={1000}
                />
              </label>
            </span>
            {productState.product.sets.length > 0 && (
              <span>
                Opções:
                {productState.product.sets.map((set, index) => (
                  <div
                    key={index + '_' + set.colorId}
                    className={[
                      styles.marginTop,
                      styles.padding,
                      styles.borderAround,
                    ].join(' ')}
                  >
                    <table
                      className={[styles.borderCollapse, styles.width100].join(
                        ' '
                      )}
                    >
                      <tbody>
                        <tr>
                          <td>Cor:</td>
                          <td className={styles.capitalize}>
                            {colorList.find((c) => c._id === set.colorId).name}
                          </td>
                          <td rowSpan={2} className={styles.width3}>
                            <Button
                              className={[
                                styles.buttonSmall,
                                styles.buttonRed,
                              ].join(' ')}
                              type="button"
                              onClick={() => onRemoveSet(index, set.colorId)}
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
                        <tr>
                          <td colSpan={2}>
                            {'Tamanhos: '}
                            {set.sizeSets.unique ||
                            Object.getOwnPropertySymbols(set.sizeSets).length >
                              0
                              ? ''
                              : 'Sem Tamanho'}
                          </td>
                        </tr>
                        {set.sizeSets.unique && (
                          <tr className={styles.borderAround}>
                            <td>Único:</td>
                            <td className={styles.uppercase} colSpan={2}>
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
                          <tr className={styles.borderAround}>
                            <td>Personalizado:</td>
                            <td colSpan={2}>
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
                                        if (text.length > 0)
                                          text = text + ' - ';
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
                          <tr className={styles.borderAround}>
                            <td>Opções Extras:</td>
                            <td colSpan={2}>
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
                        <tr className={styles.borderAround}>
                          <td>Fotos:</td>
                          <td colSpan={2}>
                            {set.images.map((img, index) => (
                              <span
                                key={index + '_' + img}
                                className={[styles.block].join(' ')}
                              >
                                {img.slice(img.indexOf('_') + 1)}
                              </span>
                            ))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
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
                        let color = colors.find((c) => c.id === v);
                        if (color) {
                          setSelectedColorName(
                            colors.find((c) => c.id === v).name
                          );
                        } else {
                          setSelectedColorName('Selecione');
                        }
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
                              styles.capitalize,
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
                            minLength={2}
                            maxLength={15}
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
                        minLength={2}
                        maxLength={15}
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
                        minLength={2}
                        maxLength={10}
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
                  <label htmlFor="images">
                    Fotos:
                    <InputFile
                      id="images"
                      name="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={onSetImages}
                    />
                  </label>
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
            <span className={styles.group_line}>
              {productState.product.id.length > 0 ? (
                <Button
                  className={[styles.button, styles.buttonRed].join(' ')}
                  type="submit"
                >
                  Deletar este Produto
                </Button>
              ) : (
                <>
                  <Button
                    className={[styles.button, styles.large].join(' ')}
                    type="button"
                    onClick={onCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className={[styles.button, styles.large].join(' ')}
                    type="submit"
                  >
                    Salvar
                  </Button>
                </>
              )}
            </span>
          </form>
        </section>
      </div>
      <ConfirmationDialog
        show={showDialog}
        onCancel={onDismissConfirmation}
        onConfirm={onDismissConfirmation}
        message={confirmationMessage}
        cancelText={cancelText}
        okText={okText}
        noButtons={isLoading}
      />
      <ConfirmationDialog
        show={showConfirmation}
        onCancel={onDismissConfirmation}
        onConfirm={onDirectAction}
        message={confirmationMessage}
        cancelText={cancelText}
        okText={okText}
        className={styles.resumeBox}
      >
        {showResume && (
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
                    {productState.product.categoryId.length > 1 &&
                      categoryList.find(
                        (c) => c._id === productState.product.categoryId
                      ).name}
                  </td>
                </tr>
                <tr>
                  <td>Seção:</td>
                  <td className={styles.capitalize}>
                    {productState.product.sectionId.length > 1 &&
                      sectionList.find(
                        (c) => c._id === productState.product.sectionId
                      ).name}
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
                      {colorList.find((c) => c._id === set.colorId).name}
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
                  <tr>
                    <td>Fotos:</td>
                    <td colSpan={2}>
                      {set.images.map((img) => (
                        <span
                          key={img}
                          className={[styles.block, styles.capitalize].join(
                            ' '
                          )}
                        >
                          {img.slice(img.indexOf('_') + 1)}
                        </span>
                      ))}
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        )}
      </ConfirmationDialog>
    </Admin>
  );
};

export async function getServerSideProps(context) {
  // const session = await getSession({ req: context.req });

  // if (!session || session.user.name !== process.env.USERADM) {
  //   return {
  //     notFound: true,
  //   };
  // }
  
  const categories = await getCategories();
  const colors = await getColors();
  const colorList = await JSON.parse(JSON.stringify(colors));
  const sections = await getSections();
  const sizeSets = await getSizeSets();
  const sizeSetList = await JSON.parse(JSON.stringify(sizeSets));

  return {
    props: {
      // session: session,
      categoryList: categories,
      colorList: colorList,
      sectionList: sections,
      sizeSetList: sizeSetList,
    },
  };
}

export default AdProductsPage;
