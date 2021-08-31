import Link from 'next/link';
import styles from './MainMenu.module.scss';
import PropTypes from 'prop-types';

const MainMenu = ({ categoryList, onMobileClick }) => {
  return (
    <div className={styles.mainmenu}>
      <ul className={styles.mainmenu_list}>
        {categoryList.map((category) => (
          <li key={category._id}>
            <Link
              href={{
                pathname: `/loja/${category.name}`,
                query: {
                  page: 1,
                  color: 'all',
                  size: 'all',
                  order: 1
                }
              }}
              passHref
            >
              <a onClick={onMobileClick && onMobileClick}>
                {category.text.toLowerCase()}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

MainMenu.propTypes = {
  categoryList: PropTypes.array.isRequired,
  onMobileClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

export default MainMenu;
