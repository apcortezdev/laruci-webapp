import { useEffect, useState } from 'react';
import { SelectColor, SelectText } from './utilities/FormComponents';
import styles from './ListingPageFilter.module.scss';
import Button from '../components/utilities/Button';
import FilterIcon from './utilities/FilterIcon';

const ListingPageFilter = ({colorList, sizesList}) => {
  // const [colors, setColors] = useState([]);

  const [toggleFilter, setToggleFilter] = useState(false);
  const toggleMobileFilter = () => {
    setToggleFilter((toggle) => !toggle);
  };

  const orderList = {
    pop: 'Popular',
    che: 'Menor Preço',
    exp: 'Maior Preço',
    atz: 'A - Z',
    zta: 'Z - A',
  };

  const [selectedColor, setSelectedColor] = useState();

  const setColor = (color) => {
    //   setSelectedColor(color);
  };

  const setSize = (size) => {
    //   setSelectedColor(color);
  };

  const setOrder = (order) => {
    //   setSelectedColor(color);
  };

  const submitSearch = (event) => {
    event.preventDefault();
  };

  return (
    <div className={styles.container}>
      <div
        className={[
          styles.filter_box,
          toggleFilter && styles.filter_box_open,
        ].join(' ').trim()}
      >
        <span className={styles.filter_icon_container} onClick={toggleMobileFilter}>
          <span className={styles.icon}>
            <FilterIcon className={styles.icon_color} />
          </span>
          <span>Filtrar</span>
        </span>
        <form
          className={[styles.form, toggleFilter && styles.form_open].join(' ').trim()}
        >
          <div className={[styles.form_item_group, styles.form_item_group_one].join(' ').trim()}>
            <div className={styles.form_item}>
              <label htmlFor="color" className={styles.form_label}>
                Cor:
              </label>
              <SelectColor
                className={[
                  styles.container_capitalized,
                  styles.selector_colors,
                ].join(' ').trim()}
                id="color"
                placeholder="Todas"
                onChange={setColor}
                colors={colorList}
              />
            </div>
            <div className={styles.form_item}>
              <label htmlFor="size" className={styles.form_label}>
                Tamanho:
              </label>
              <SelectText
                className={styles.selector_sizes}
                id="size"
                placeholder="Todos"
                onChange={setSize}
                options={sizesList}
              />
            </div>
          </div>
          <div className={[styles.form_item_group, styles.form_item_group_two].join(' ').trim()}>
            <div className={styles.form_item}>
              <label htmlFor="order" className={styles.form_label}>
                Ordem:
              </label>
              <SelectText
                className={styles.selector_order}
                id="order"
                placeholder="Irrelevante"
                onChange={setOrder}
                options={orderList}
              />
            </div>
            <Button
              type="submit"
              className={styles.form__button}
              onclick={submitSearch}
            >
              Buscar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingPageFilter;
