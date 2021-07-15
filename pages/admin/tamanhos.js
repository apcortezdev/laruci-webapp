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

  if (!props.notice) {
    console.log(props);
    return (
      <Admin>
        <div className={styles.wrapper}>
          <p>Loading...</p>
        </div>
      </Admin>
    );
  }

  const [notice, setNotice] = useState(props.notice.notice);
  const [isNoticeValid, setIsNoticeValid] = useState(true);

  const [initialDate, setInitialDate] = useState(props.notice.initialDate);
  const [isInitialDateValid, setIsInitialDateValid] = useState(true);

  const [finalDate, setFinalDate] = useState(props.notice.finalDate);
  const [isFinalDateValid, setIsFinalDateValid] = useState(true);

  const resetContactData = (event) => {
    event.preventDefault();
  };

  const saveContactData = (event) => {
    event.preventDefault();
  };

  const setNoticeValue = (event) => {
    setNotice(event.target.value);
  };

  const setInitialDateValue = (event) => {
    setInitialDate(event.target.value);
  };

  const setFinalDateValue = (event) => {
    setFinalDate(event.target.value);
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
            <label htmlFor="notice">Aviso:</label>
            <Input
              id="notice"
              type="text"
              placeholder="Sem Aviso"
              value={notice}
              valid={isNoticeValid}
              onChange={setNoticeValue}
              validationMessage={'Tem algo errado neste campo'}
            />
          </span>
          <span className={styles.form_line}>
            <label htmlFor="initial_date">Datas:</label>
            <span className={styles.form_input_dates}>
              <label htmlFor="initial_date">De:</label>
              <Input
                id="initial_date"
                type="date"
                placeholder="Sem Data"
                value={initialDate}
                valid={isInitialDateValid}
                onChange={setInitialDateValue}
                validationMessage={'Tem algo errado neste campo'}
                className={styles.input_date}
              />
              <label htmlFor="final_date">Até:</label>
              <Input
                id="final_date"
                type="date"
                placeholder="Sem Data"
                value={finalDate}
                valid={isFinalDateValid}
                onChange={setFinalDateValue}
                validationMessage={'Tem algo errado neste campo'}
                className={styles.input_date}
              />
            </span>
          </span>
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
