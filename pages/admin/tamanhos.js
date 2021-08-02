import Admin from '../../components/admin/Admin';
import { Input } from '../../components/utilities/FormComponents';
import Button from '../../components/utilities/Button';
import styles from '../../styles/AdNoticePage.module.scss';
import { getSizes } from '../../data/sizes';
import { useEffect, useState } from 'react';

const AdSizesPage = (props) => {
  if (props.user !== 'admin') {
    return <p>Esta página no ecxiste!</p>;
  }

  return (
    <Admin>
      <div className={styles.wrapper}>
        <h1>Alterar Aviso da Página Principal</h1>
        <div>
          ATENÇÃO: <br />
          <ul>
            <li>
              Tenha certeza de que as informações desta página estão corretas e
              atualizadas. Altere-as com cuidado!
            </li>
            <li>
              Alterações poderão <u> demorar até 24 horas</u> para serem
              atualizadas no site.
            </li>
            <li>
              Este aviso aparecerá no topo da página quando visitada pelo
              cliente. Caso deseje que nenhum aviso seja mostrado, deixe o campo
              em branco.
            </li>
            <li>
              As datas estipulam um limite de tempo em que o aviso estará à mostra
              no site.
            </li>
          </ul>
        </div>
        <form className={styles.form}>
          
          <span className={styles.form_line}>
            <Button className={styles.formButton} onClick={resetContactData}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className={styles.formButton}
              onClick={saveContactData}
            >
              Salvar
            </Button>
          </span>
        </form>
      </div>
    </Admin>
  );
};

export async function getServerSideProps() {
  const sizes = getSizes();
  return {
    props: {
      user: 'admin',
      sizes: sizes,
    },
  };
}

export default AdSizesPage;
