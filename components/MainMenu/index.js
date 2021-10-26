import Link from 'next/link';
import styles from './styles.module.scss';
import PropTypes from 'prop-types';

const MainMenu = ({ categoryList, onMobileClick }) => {
  return (
    <div className={styles.mainmenu}>
      <ul className={styles.mainmenu_list}>
        {categoryList.map((category) => (
          <li key={category.name}>
            <Link
              href={{
                pathname: `/loja/${category.link}`,
                query: {
                  page: 1,
                },
              }}
              passHref
            >
              <a onClick={onMobileClick && onMobileClick}>
                {category.name.toLowerCase()}
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
