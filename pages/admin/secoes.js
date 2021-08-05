import ConfirmationDialog from '../../components/utilities/ConfirmationDialog';
import Admin from '../../components/admin/Admin';
import { Input } from '../../components/utilities/FormComponents';
import Button from '../../components/utilities/Button';
import styles from '../../styles/AdSectionsPage.module.scss';
import { useEffect, useState } from 'react';
import { getSectionsJSON } from '../../data/sections';

const METHOD = {
  SAVE: 'SAVE',
  DELETE: 'DELETE',
  EDIT: 'EDIT',
};

const ItemList = ({ item, onEdit, onDelete }) => {
  const [sectionName, setSectionName] = useState(item.text);
  const [edit, setEdit] = useState(false);
  return (
    <tr key={'tr_' + item._id}>
      {!edit ? (
        <td>{item.text}</td>
      ) : (
        <td>
          <Input
            className={styles.inp_text}
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
          />
        </td>
      )}

      <td>
        <Button
          className={styles.button}
          onClick={(event) => {
            event.preventDefault();
            if (!edit) setEdit(true);
            else {
              setEdit(false);
              onEdit(event, item._id, sectionName);
            }
          }}
        >
          {edit ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              className={styles.icon}
              viewBox="0 0 16 16"
            >
              <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              className={styles.icon}
              viewBox="0 0 16 16"
            >
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
            </svg>
          )}
        </Button>
        <Button
          className={[styles.button, styles.button_delete].join(' ')}
          onClick={(event) => {
            event.preventDefault();
            if (edit) setEdit(false);
            else onDelete(event, item._id);
          }}
        >
          {edit ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              className={styles.icon}
              viewBox="0 0 16 16"
            >
              <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              className={styles.icon}
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
              <path
                fillRule="evenodd"
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
              />
            </svg>
          )}
        </Button>
      </td>
    </tr>
  );
};

const AdSectionsPage = ({ user, sections }) => {
  if (user !== 'admin') {
    return <p>Esta página no ecxiste!</p>;
  }

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationMethod, setConfirmationMethod] = useState('');
  const [okText, setOkText] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const [newSectionName, setNewSectionName] = useState('');
  const [updSectionName, setUpdSectionName] = useState('');
  const [sectionList, setSectionList] = useState([]);

  useEffect(() => {
    setSectionList(sections);
  }, []);

  const onConfirmation = (event) => {
    event.preventDefault();
    setNewSectionName('');
    onDismissConfirmation(event);

    if (confirmationMethod === METHOD.SAVE) {
      saveSection();
    }

    if (confirmationMethod === METHOD.DELETE) {
      deleteSection();
    }

    if (confirmationMethod === METHOD.EDIT) {
      editSection();
    }
  };

  // Save New
  const onSaveConfirmation = async (event) => {
    event.preventDefault();
    if (newSectionName.length > 0) {
      setConfirmationMessage(`Adicionar "${newSectionName}" às seções?`);
      setConfirmationMethod(METHOD.SAVE);
      setOkText('Salvar');
      setShowConfirmation(true);
    }
  };

  const saveSection = async () => {
    const newSection = await fetch('/api/admin/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newSectionName }),
    });
    if (newSection.status === 201) {
      const data = await newSection.json();
      setSectionList((list) => [...list, data.section]);
    } else {
      window.alert(
        'Ops, Algo de errado não está certo! ERRO: ' + newSection.status
      );
    }
  };

  // Delete
  const onDeleteConfirmation = async (event, _id) => {
    event.preventDefault();
    let sectionName = sectionList.find((i) => i._id === _id).text;
    setConfirmationMessage(
      `ATENÇÃO: Deletar uma seção irá afetar todos os produtos pertencentes a ela. Deseja deletar a seção "${sectionName}"?`
    );
    setConfirmationMethod(METHOD.DELETE);
    setSelectedSection(_id);
    setOkText('Deletar');
    setShowConfirmation(true);
  };

  const deleteSection = async () => {
    const deleteSection = await fetch('/api/admin/sections', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedSection }),
    });
    if (deleteSection.status === 200) {
      const data = await deleteSection.json();
      setSectionList((list) => {
        let newList = [...list];
        newList.splice(newList.indexOf(newList.find((i) => i._id === data.section._id)), 1);
        return newList;
      });
    } else {
      window.alert(
        'Ops, Algo de errado não está certo! ERRO: ' + deleteSection.status
      );
    }
  };

  // Update
  const onEditConfirmation = async (event, _id, newValue) => {
    event.preventDefault();
    let sectionName = sectionList.find((i) => i._id === _id).text;
    setConfirmationMessage(`Deseja alterar ${sectionName} para ${newValue}?`);
    setUpdSectionName(newValue);
    setConfirmationMethod(METHOD.EDIT);
    setSelectedSection(_id);
    setOkText('Salvar');
    setShowConfirmation(true);
  };

  const editSection = async () => {
    const updatedSection = await fetch('/api/admin/sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedSection, newText: updSectionName }),
    });
    if (updatedSection.status === 200) {
      const data = await updatedSection.json();
      setSectionList((list) => {
        let newList = [...list];
        newList[
          newList.indexOf(newList.find((i) => i._id === data.section._id))
        ] = data.section;
        return newList;
      });
    } else {
      window.alert(
        'Ops, Algo de errado não está certo! ERRO: ' + updatedSection.status
      );
    }
  };

  const onDismissConfirmation = (event) => {
    event.preventDefault();
    setShowConfirmation(false);
  };

  return (
    <Admin>
      <div className={styles.wrapper}>
        <section className={styles.warning}>
          <h1>Seções</h1>
          <div>
            ATENÇÃO: <br />
            <ul>
              <li>
                Tenha certeza de que as informações desta página estão corretas
                e atualizadas. Altere-as com cuidado!
              </li>
              <li>
                Alterações poderão <u> demorar até 24 horas</u> para serem
                atualizadas no site.
              </li>
            </ul>
          </div>
        </section>
        <section className={styles.sections}>
          <form>
            <table>
              <tbody>
                {sectionList.map((i) => (
                  <ItemList
                    key={i._id}
                    item={i}
                    onEdit={onEditConfirmation}
                    onDelete={onDeleteConfirmation}
                  />
                ))}
                <tr>
                  <td>
                    <Input
                      className={styles.inp_text}
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                    />
                  </td>
                  <td>
                    <Button
                      className={styles.button}
                      onClick={onSaveConfirmation}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        className={styles.icon}
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                      </svg>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </section>
      </div>
      <ConfirmationDialog
        show={showConfirmation}
        onCancel={onDismissConfirmation}
        onConfirm={onConfirmation}
        message={confirmationMessage}
        cancelText="Cancelar"
        okText={okText}
      />
    </Admin>
  );
};

export async function getServerSideProps() {
  const sections = await getSectionsJSON();
  const list = await JSON.parse(sections);

  return {
    props: {
      user: 'admin',
      sections: list,
    },
  };
}

export default AdSectionsPage;
