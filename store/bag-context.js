import { createContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const BagContext = createContext({
  bag: {
    bagId: '',
    qtyItemsInBag: 0,
  },
  user: {},
  addOrRemoveFromBag: function (product) {},
  removeFromBag: function (product) {},
});

export function BagContextProvider(props) {
  const [cookies, setCookie, removeCookie] = useCookies(['@laruci/bag']);
  const [bagId, setBagId] = useState('');
  const [qtyItemsInBag, setQtyItemsInBag] = useState(0);

  useEffect(() => {
    // recover cookie
    const cookie = cookies['@laruci/bag'];

    if (cookie) {
      setBagId(cookie.bag.id);
      setQtyItemsInBag(cookie.bag.qty);
    }
  }, []);

  function saveCookie(bag) {
    let qty = 0;
    if (bag.items) {
      bag.items.forEach((item) => {
        qty = qty + item.quantity;
      });
    }

    let cookie = {
      bag: {
        id: bag._id,
        qty: qty,
      },
      // userId: bag.userId,
    };

    let expiration = new Date();
    setCookie('@laruci/bag', cookie, {
      expires: new Date(
        expiration.setTime(expiration.getTime() + 24 * 3600000)
      ),
      path: '/loja',
      sameSite: 'strict',
    });
  }

  const createNewBag = async (bag) => {
    const local = await fetch('https://geolocation-db.com/json/');
    const location = await local.json();
    const sendBag = {
      location: location,
      items: bag,
    };
    const response = await fetch('/api/loja/bag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bag: sendBag }),
    });
    switch (response.status) {
      case 201:
        const data = await response.json();
        return data.bag;
      default:
        window.alert(
          'Ops, Algo de errado não está certo! ERRO: ' + response.status
        );
        break;
    }
  };

  const saveBag = async (bag) => {
    const response = await fetch('/api/loja/bag', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: bagId, item: bag }),
    });
    switch (response.status) {
      case 200:
        const data = await response.json();
        return data.bag;
      default:
        window.alert(
          'Ops, Algo de errado não está certo! ERRO: ' + response.status
        );
        break;
    }
  };

  async function quantityInBagHandler(newToBag) {
    let bag;
    if (bagId) {
      bag = await saveBag(newToBag);
      bag = bag;
    } else {
      bag = await createNewBag(newToBag);
      setBagId(bag.bag._id);
    }

    setQtyItemsInBag((v) => v + newToBag.quantity);
    if (bag.status === '204' || bag.status === 204) {
      saveCookie({ _id: '' });
      setBagId('');
      setQtyItemsInBag(0);
      return bag.status;
    } else {
      saveCookie(bag.bag);
      return bag.bag._id;
    }
  }

  const context = {
    bag: {
      bagId: bagId,
      qtyItemsInBag: qtyItemsInBag,
    },
    user: {},
    addOrRemoveFromBag: quantityInBagHandler,
  };

  return (
    <BagContext.Provider value={context}>{props.children}</BagContext.Provider>
  );
}

export default BagContext;
