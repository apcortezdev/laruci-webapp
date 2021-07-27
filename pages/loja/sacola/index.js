import styles from '../../../styles/BagPage.module.scss';

const BagPage = ({ notice }) => {
  return (
    <div className={styles.container}>
      <section >
        <p>
          <span>Sacola:</span>
          <span>Total:</span>
        </p>
      </section>
      <section>

      </section>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: {
      // notice: notice.notice,
    },
    revalidate: 86400,
  };
}

export default BagPage;
