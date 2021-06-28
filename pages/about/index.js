import styles from '../../styles/AboutPage.module.scss';

const AboutPage = props => {
    return (
        <div className={styles.main}>
        <div className={styles.aside} />
        <div className={styles.flex_center}>
            Sobre Nós
        </div>
        <div className={styles.aside} />
      </div>
    );
};

export default AboutPage;