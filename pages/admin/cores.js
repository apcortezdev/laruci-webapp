import ConfirmationDialog from '../../components/utilities/ConfirmationDialog';
import Admin from '../../components/admin/Admin';
import { Input, InputColor } from '../../components/utilities/FormComponents';
import Button from '../../components/utilities/Button';
import styles from '../../styles/AdColorsPage.module.scss';
import { useEffect, useState } from 'react';
import { getColorsJSON } from '../../data/colors';

const METHOD = {
  SAVE: 'SAVE',
  DELETE: 'DELETE',
  EDIT: 'EDIT',
};

const ItemList = ({ item, onEdit, onDelete }) => {
  const [colorName, setColorName] = useState(item.text);
  const [colorCode, setColorCode] = useState(item.code);
  const [edit, setEdit] = useState(false);
  return (
    <tr key={'tr_' + item._id}>
      <td>
        <InputColor
          className={styles.inp_color}
          value={colorCode}
          onChange={(e) => setColorCode(e.target.value)}
          disabled={!edit}
        />
      </td>
      {!edit ? (
        <td>{item.text}</td>
      ) : (
        <td>
          <Input
            className={styles.inp_text}
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
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
              onEdit(event, item._id, colorName, colorCode);
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

const AdColorsPage = ({ user, colors }) => {
  if (user !== 'admin') {
    return <p>Esta página no ecxiste!</p>;
  }

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationMethod, setConfirmationMethod] = useState('');
  const [okText, setOkText] = useState('');

  const [selectedColor, setSelectedColor] = useState('');

  const [newColorName, setNewColorName] = useState('');
  const [updColorName, setUpdColorName] = useState('');

  const [newColorCode, setNewColorCode] = useState('#000000');
  const [updColorCode, setUpdColorCode] = useState('');

  const [colorList, setColorList] = useState([]);

  useEffect(() => {
    setColorList(colors);
  }, []);

  const onConfirmation = (event) => {
    event.preventDefault();
    
    if (confirmationMethod === METHOD.SAVE) {
      saveColor();
    }
    
    if (confirmationMethod === METHOD.DELETE) {
      deleteColor();
    }
    
    if (confirmationMethod === METHOD.EDIT) {
      editColor();
    }
    
    setNewColorName('');
    setNewColorCode('#000000');
    onDismissConfirmation(event);
  };

  // Save New
  const onSaveConfirmation = async (event) => {
    event.preventDefault();
    if (newColorName.length > 0 && newColorCode.length > 0) {
      setConfirmationMessage(`Adicionar cor "${newColorName}"?`);
      setConfirmationMethod(METHOD.SAVE);
      setOkText('Salvar');
      setShowConfirmation(true);
    }
  };

  const saveColor = async () => {
    const newColor = await fetch('/api/admin/colors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newColorName, code: newColorCode }),
    });
    if (newColor.status === 201) {
      const data = await newColor.json();
      setColorList((list) => [...list, data.color]);
    } else {
      window.alert(
        'Ops, Algo de errado não está certo! ERRO: ' + newColor.status
      );
    }
  };

  // Delete
  const onDeleteConfirmation = async (event, _id) => {
    event.preventDefault();
    let colorName = colorList.find((i) => i._id === _id).text;
    setConfirmationMessage(
      `ATENÇÃO: Deletar uma cor irá afetar todos os produtos pertencentes a ela. Deseja deletar a cor "${colorName}"?`
    );
    setConfirmationMethod(METHOD.DELETE);
    setSelectedColor(_id);
    setOkText('Deletar');
    setShowConfirmation(true);
  };

  const deleteColor = async () => {
    const deleteColor = await fetch('/api/admin/colors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedColor }),
    });
    if (deleteColor.status === 200) {
      const data = await deleteColor.json();
      setColorList((list) => {
        let newList = [...list];
        newList.splice(newList.indexOf((i) => i._id === data._id));
        return newList;
      });
    } else {
      window.alert(
        'Ops, Algo de errado não está certo! ERRO: ' + deleteColor.status
      );
    }
  };

  // Update
  const onEditConfirmation = async (event, _id, newName, newCode) => {
    event.preventDefault();
    let colorName = colorList.find((i) => i._id === _id).text;
    setConfirmationMessage(`Deseja alterar ${colorName} para ${newName}?`);
    setUpdColorName(newName);
    setUpdColorCode(newCode);
    setConfirmationMethod(METHOD.EDIT);
    setSelectedColor(_id);
    setOkText('Salvar');
    setShowConfirmation(true);
  };

  const editColor = async () => {
    const updatedColor = await fetch('/api/admin/colors', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedColor,
        newText: updColorName,
        newCode: updColorCode,
      }),
    });
    if (updatedColor.status === 200) {
      const data = await updatedColor.json();
      setColorList((list) => {
        let newList = [...list];
        newList[
          newList.indexOf(newList.find((i) => i._id === data.color._id))
        ] = data.color;
        return newList;
      });
    } else {
      window.alert(
        'Ops, Algo de errado não está certo! ERRO: ' + updatedColor.status
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
          <h1>Cores</h1>
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
        <section className={styles.colors}>
          <form>
            <table>
              <tbody>
                {colorList.map((i) => (
                  <ItemList
                    key={i._id}
                    item={i}
                    onEdit={onEditConfirmation}
                    onDelete={onDeleteConfirmation}
                  />
                ))}
                <tr>
                  <td>
                    <InputColor
                      className={styles.inp_color}
                      value={newColorCode}
                      onChange={(e) => setNewColorCode(e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      className={styles.inp_text}
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
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
  const colors = await getColorsJSON();
  const ColorList = await JSON.parse(colors);

  return {
    props: {
      user: 'admin',
      colors: ColorList,
    },
  };
}

export default AdColorsPage;
