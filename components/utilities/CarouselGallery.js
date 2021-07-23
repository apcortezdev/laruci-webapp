import PropTypes from 'prop-types';
import styles from './CarouselGallery.module.scss';

const CarouselGallery = (props) => {
    return (
        <div className={styles.container}>
            <div className={styles.galerry}>
                { props.children }
            </div>
        </div>
    );
};

CarouselGallery.propTypes = {
    category: PropTypes.string
};

export default CarouselGallery;