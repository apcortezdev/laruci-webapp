import styles from './NoticeBar.module.scss';

const NoticeBar = props => {

    const notice = "Notice";

    return (
        <div className={styles.noticebar}>
            {notice}
        </div>
    );
};

export default NoticeBar;