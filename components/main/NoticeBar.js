import styles from './NoticeBar.module.scss';

const NoticeBar = ({ className, notice }) => {

  return (
    <div className={[styles.noticebar, className].join(' ').trim()}>{notice}</div>
  );
};

export default NoticeBar;
