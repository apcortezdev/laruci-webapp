import styles from '../../styles/ImageSlideShow.module.scss';

const ImageSlideShow = props => {

    const images = props.images.map((image) => (<img class={styles.imgslide} src={image}/>));
    return (
        <div>
            ImageSlide
        </div>
    );
};

export default ImageSlideShow;