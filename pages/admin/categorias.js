import ConfirmationDialog from '../../components/utilities/ConfirmationDialog';
import Admin from '../../components/admin/Admin';
import { Input } from '../../components/utilities/FormComponents';
import Button from '../../components/utilities/Button';
import styles from '../../styles/AdCategoriesPage.module.scss';
import { useEffect, useState } from 'react';
import { getCategoriesJSON } from '../../data/categories';

const METHOD = {
  SAVE: 'SAVE',
  DELETE: 'DELETE',
  EDIT: 'EDIT',
};

const ItemList = ({ item, onEdit, onDelete }) => {
  const [categoryName, setCategoryName] = useState(item.text);
  const [edit, setEdit] = useState(false);
  return (
    <tr key={'tr_' + item._id}>
      {!edit ? (
        <td>{item.text}</td>
      ) : (
        <td>
          <Input
            className={styles.inp_text}
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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
              onEdit(event, item._id, categoryName);
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

const AdCategoriesPage = ({ user, categories }) => {
  if (user !== 'admin') {
    return <p>Esta página no ecxiste!</p>;
  }

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationMethod, setConfirmationMethod] = useState('');
  const [okText, setOkText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [newCategoryName, setNewCategoryName] = useState('');
  const [updCategoryName, setUpdCategoryName] = useState('');
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    setCategoryList(categories);
  }, []);

  const onConfirmation = (event) => {
    event.preventDefault();
    setNewCategoryName('');
    onDismissConfirmation(event);

    if (confirmationMethod === METHOD.SAVE) {
      saveCategory();
    }

    if (confirmationMethod === METHOD.DELETE) {
      deleteCategory();
    }

    if (confirmationMethod === METHOD.EDIT) {
      editCategory();
    }
  };

  // Save New
  const onSaveConfirmation = async (event) => {
    event.preventDefault();
    if (newCategoryName.length > 0) {
      setConfirmationMessage(`Adicionar "${newCategoryName}" às categorias?`);
      setConfirmationMethod(METHOD.SAVE);
      setOkText('Salvar');
      setShowConfirmation(true);
    }
  };

  const saveCategory = async () => {
    const newCategory = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newCategoryName }),
    });
    if (newCategory.status === 201) {
      const data = await newCategory.json();
      setCategoryList((list) => [...list, data.category]);
    } else {
      window.alert(
        'Ops, Algo de errado não está certo! ERRO: ' + newCategory.status
      );
    }
  };

  // Delete
  const onDeleteConfirmation = async (event, _id) => {
    event.preventDefault();
    let categoryName = categoryList.find((i) => i._id === _id).text;
    setConfirmationMessage(
      `ATENÇÃO: Deletar uma categoria irá deletar todos os produtos pertencentes a ela. Deseja deletar a categoria "${categoryName}"?`
    );
    setConfirmationMethod(METHOD.DELETE);
    setSelectedCategory(_id);
    setOkText('Deletar');
    setShowConfirmation(true);
  };

  const deleteCategory = async () => {
    const deleteCategory = await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedCategory }),
    });
    if (deleteCategory.status === 200) {
      const data = await deleteCategory.json();
      setCategoryList((list) => {
        let newList = [...list];
        newList.splice(newList.indexOf((i) => i._id === selectedCategory));
        return newList;
      });
    } else {
      window.alert(
        'Ops, Algo de errado não está certo! ERRO: ' + deleteCategory.status
      );
    }
  };

  // Update
  const onEditConfirmation = async (event, _id, newValue) => {
    event.preventDefault();
    let categoryName = categoryList.find((i) => i._id === _id).text;
    setConfirmationMessage(`Deseja alterar ${categoryName} para ${newValue}?`);
    setUpdCategoryName(newValue);
    setConfirmationMethod(METHOD.EDIT);
    setSelectedCategory(_id);
    setOkText('Salvar');
    setShowConfirmation(true);
  };

  const editCategory = async () => {
    const updatedCategory = await fetch('/api/admin/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedCategory, newText: updCategoryName }),
    });
    if (updatedCategory.status === 200) {
      const data = await updatedCategory.json();
      setCategoryList((list) => {
        let newList = [...list];
        // console.log(newList.indexOf((i) => i._id === selectedCategory));
        newList[newList.indexOf((i) => i._id === selectedCategory)] = data;
        return newList;
      });
    } else {
      window.alert(
        'Ops, Algo de errado não está certo! ERRO: ' + updatedCategory.status
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
          <h1>Categorias</h1>
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
        <section className={styles.categories}>
          <form>
            <table>
              <tbody>
                {categoryList.map((i) => (
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
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
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
  const categories = await getCategoriesJSON();
  const catList = await JSON.parse(categories);
  return {
    props: {
      user: 'admin',
      categories: catList,
    },
  };
}

export default AdCategoriesPage;
