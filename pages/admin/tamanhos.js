import ConfirmationDialog from '../../components/utilities/ConfirmationDialog';
import Admin from '../../components/admin/Admin';
import { Input } from '../../components/utilities/FormComponents';
import Button from '../../components/utilities/Button';
import styles from '../../styles/AdSizesPage.module.scss';
import { useEffect, useState } from 'react';
import { getSizeSetsJSON } from '../../data/sizeSets';

const METHOD = {
  SAVE: 'SAVE',
  DELETE: 'DELETE',
  EDIT: 'EDIT',
};

const ItemList = ({ item, onEdit, onDelete }) => {
  const [sizeName, setName] = useState(item.name);
  const [sizes, setSizes] = useState(item.sizes);
  const [size, setSize] = useState('');
  const [edit, setEdit] = useState(false);

  const onAddToSet = (event) => {
    event.preventDefault();
    if (!sizes.find((s) => s === size)) {
      const sz = size;
      setSizes((list) => [...list, sz]);
      setSize('');
    }
  };

  const onRemoveFromSet = (event, size) => {
    event.preventDefault();
    setSizes((list) => {
      let newList = [...list];
      newList.splice(newList.indexOf(newList.find((s) => s === size)), 1);
      return newList;
    });
  };

  return (
    <span
      className={[styles.block, styles.padding, styles.borderBottom].join(' ')}
    >
      {!edit ? (
        <>
          <span
            className={[
              styles.block,
              styles.paddingBottom,
              styles.capitalize,
            ].join(' ')}
          >
            {item.name}
          </span>
          <span className={styles.flexLine}>
            <span className={styles.gridLine}>
              {sizes.map((size) => (
                <span key={size} className={styles.tag}>
                  {size}
                </span>
              ))}
            </span>
            <span className={styles.flexLine}>
              <Button
                className={styles.button}
                onClick={(event) => {
                  event.preventDefault();
                  setEdit(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  className={styles.icon}
                  viewBox="0 0 16 16"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                </svg>
              </Button>
              <Button
                className={[styles.button, styles.button_delete].join(' ')}
                onClick={(event) => {
                  event.preventDefault();
                  onDelete(event, item._id);
                }}
              >
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
              </Button>
            </span>
          </span>
        </>
      ) : (
        <>
          <span className={[styles.block, styles.paddingBottom].join(' ')}>
            <Input
              className={styles.capitalize}
              value={sizeName}
              onChange={(e) => setName(e.target.value)}
            />
          </span>
          <span className={styles.flexLine}>
            <span className={styles.flexLine}>
              {sizes.map((size) => (
                <span
                  key={size}
                  className={[styles.tag, styles.tagEdit].join(' ')}
                  onClick={(e) => onRemoveFromSet(e, size)}
                >
                  {size}
                </span>
              ))}
            </span>
            <span className={styles.flexLine}>
              <form className={styles.setForm} onSubmit={onAddToSet}>
                <label htmlFor="tag">
                  Tag:
                  <Input
                    id="tag"
                    className={styles.uppercase}
                    onChange={(e) => setSize(e.target.value)}
                    maxLength={2}
                    value={size}
                  />
                </label>
                <label>
                  <Button className={styles.button} type="submit">
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
                </label>
              </form>
            </span>
          </span>
          <span
            className={[styles.flexLine, styles.toTheLeft, styles.padding].join(
              ' '
            )}
          >
            <Button
              className={styles.button}
              onClick={(event) => {
                event.preventDefault();
                setEdit(false);
                onEdit(event, item._id, sizeName, sizes);
              }}
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
            <Button
              className={[styles.button, styles.button_delete].join(' ')}
              onClick={(event) => {
                event.preventDefault();
                setEdit(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                className={styles.icon}
                viewBox="0 0 16 16"
              >
                <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
              </svg>
            </Button>
          </span>
        </>
      )}
    </span>
  );
};

const AdSizesPage = ({ user, sizeSets }) => {
  if (user !== 'admin') {
    return <p>Esta página no ecxiste!</p>;
  }

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationMethod, setConfirmationMethod] = useState('');
  const [okText, setOkText] = useState('');
  const [selectedSizeSet, setSelectedSizeSet] = useState('');

  // new
  const [newSizeSetName, setNewSizeSetName] = useState('');
  const [newSizeSetSizes, setNewSizeSetSizes] = useState([]);
  const [newSize, setNewSize] = useState('');

  // update
  const [updSizeSetName, setUpdSizeSetName] = useState('');
  const [updSizeSetSizes, setUpdSizeSetSizes] = useState([]);

  const [sizeSetList, setSizeSetList] = useState([]);

  useEffect(() => {
    setSizeSetList(sizeSets);
  }, []);

  const onConfirmation = (event) => {
    event.preventDefault();

    const name = newSizeSetName;
    const sizes = newSizeSetSizes;
    if (confirmationMethod === METHOD.SAVE) {
      saveSizeSet(name, sizes);
    }

    if (confirmationMethod === METHOD.DELETE) {
      deleteSizeSet();
    }

    if (confirmationMethod === METHOD.EDIT) {
      editSizeSet();
    }

    setNewSizeSetName('');
    setNewSizeSetSizes([]);
    setNewSize('');
    onDismissConfirmation(event);
  };

  // Save New
  const onSaveConfirmation = async (event) => {
    event.preventDefault();
    if (newSizeSetName.length > 0 || newSizeSetSizes.length > 0) {
      setConfirmationMessage(`Salvar novo tamanho "${newSizeSetName}"?`);
      setConfirmationMethod(METHOD.SAVE);
      setOkText('Salvar');
      setShowConfirmation(true);
    }
  };

  const saveSizeSet = async (name, sizes) => {
    const newSizeSet = await fetch('/api/admin/sizeSets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, sizes: sizes }),
    });
    if (newSizeSet.status === 201) {
      const data = await newSizeSet.json();
      setSizeSetList((list) => [...list, data.sizeSet]);
    } else {
      window.alert(
        'Ops, Algo de errado não está certo! ERRO: ' + newSizeSet.status
      );
    }
  };

  // Delete
  const onDeleteConfirmation = async (event, _id) => {
    event.preventDefault();
    let sizeSetName = sizeSetList.find((i) => i._id === _id).name;
    setConfirmationMessage(
      `ATENÇÃO: Todos os produtos com estes tamanhos serão afetados. Deseja deletar o tamanho "${sizeSetName}"?`
    );
    setConfirmationMethod(METHOD.DELETE);
    setSelectedSizeSet(_id);
    setOkText('Deletar');
    setShowConfirmation(true);
  };

  const deleteSizeSet = async () => {
    const deleteSizeSet = await fetch('/api/admin/sizeSets', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedSizeSet }),
    });
    if (deleteSizeSet.status === 200) {
      const data = await deleteSizeSet.json();
      setSizeSetList((list) => {
        let newList = [...list];
        newList.splice(
          newList.indexOf(newList.find((i) => i._id === data.sizeSet._id)),
          1
        );
        return newList;
      });
    } else {
      window.alert(
        'Ops, Algo de errado não está certo! ERRO: ' + deleteSizeSet.status
      );
    }
  };

  // Update
  const onEditConfirmation = async (event, _id, newName, newSizes) => {
    event.preventDefault();
    setConfirmationMessage(`Salvar alterações?`);
    setUpdSizeSetName(newName);
    setUpdSizeSetSizes(newSizes);
    setConfirmationMethod(METHOD.EDIT);
    setSelectedSizeSet(_id);
    setOkText('Salvar');
    setShowConfirmation(true);
  };

  const editSizeSet = async () => {
    const updatedSizeSet = await fetch('/api/admin/sizeSets', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedSizeSet,
        name: updSizeSetName,
        sizes: updSizeSetSizes,
      }),
    });
    if (updatedSizeSet.status === 200) {
      const data = await updatedSizeSet.json();
      setSizeSetList((list) => {
        let newList = [...list];
        newList[
          newList.indexOf(newList.find((i) => i._id === data.sizeSet._id))
        ] = data.sizeSet;
        return newList;
      });
    } else {
      window.alert(
        'Ops, Algo de errado não está certo! ERRO: ' + updatedSizeSet.status
      );
    }
  };

  const onDismissConfirmation = (event) => {
    event.preventDefault();
    setShowConfirmation(false);
  };

  const onAddToSet = (event) => {
    event.preventDefault();
    const size = newSize;
    setNewSizeSetSizes((list) => [...list, size]);
    setNewSize('');
  };

  const onRemoveFromSet = (event, size) => {
    event.preventDefault();
    setNewSizeSetSizes((list) => {
      let newList = [...list];
      newList.splice(newList.indexOf(newList.find((s) => s === size)), 1);
      return newList;
    });
  };

  return (
    <Admin>
      <div className={styles.wrapper}>
        <section className={[styles.warning, styles.borderBottom].join(' ')}>
          <h1>Tamanhos:</h1>
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
        <section className={styles.sizeSets}>
          <div className={[styles.border, styles.set].join(' ')}>
            {sizeSetList.map((i) => (
              <ItemList
                key={i._id}
                item={i}
                onEdit={onEditConfirmation}
                onDelete={onDeleteConfirmation}
              />
            ))}
            <span>
              <label htmlFor="name">
                Nome:
                <Input
                  id="name"
                  className={styles.inp_text}
                  onChange={(e) => setNewSizeSetName(e.target.value)}
                  value={newSizeSetName}
                />
              </label>
            </span>
            <span className={styles.flexLine}>
              <span className={styles.flexLine}>
                <span className={styles.gridLine}>
                  {newSizeSetSizes.map((size) => (
                    <span
                      key={size}
                      className={[styles.tag, styles.tagEdit].join(' ')}
                      onClick={(e) => onRemoveFromSet(e, size)}
                    >
                      {size}
                    </span>
                  ))}
                </span>
              </span>
              <span className={styles.flexLine}>
                <form className={styles.setForm} onSubmit={onAddToSet}>
                  <label htmlFor="tag">
                    Tag:
                    <Input
                      id="tag"
                      className={styles.uppercase}
                      onChange={(e) => setNewSize(e.target.value)}
                      maxLength={2}
                      value={newSize}
                    />
                  </label>
                  <label>
                    <Button className={styles.button} type="submit">
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
                  </label>
                </form>
              </span>
            </span>
            <span className={[styles.flexLine, styles.toTheLeft].join(' ')}>
              <Button
                className={styles.buttonLarge}
                onClick={onSaveConfirmation}
              >
                Salvar
              </Button>
            </span>
          </div>
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
  const sizeSets = await getSizeSetsJSON();
  const list = await JSON.parse(sizeSets);
  return {
    props: {
      user: 'admin',
      sizeSets: list,
    },
  };
}

export default AdSizesPage;
