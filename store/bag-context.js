import { createContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const BagContext = createContext({
  bag: {
    bagId: '',
    qtyItemsInBag: 0,
  },
  user: {},
  addToBag: function (product) {},
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
    bag.items.forEach((item) => {
      qty = qty + item.quantity;
    });
    let cookie = {
      bag: {
        id: bag._id,
        qty: qty,
      },
      // userId: bag.userId,
    };

    let expiration = new Date();
    setCookie('@laruci/bag', cookie, {
      expires: new Date(expiration.setTime(expiration.getTime() + 24 * 3600000)),
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

  async function addToBagHandler(newToBag) {
    // Follow rules:
    // gets a obj item as: 
    // {
    //   id, quantity
    // }
    // if quantity:
    //  - positive, adds to quantity
    //  - negative, subtracts from quantity
    //  - zero, removes item from bag
    let bag;
    if (bagId) {
      bag = await saveBag(newToBag);
    } else {
      bag = await createNewBag(newToBag);
      setBagId(bag._id);
    }

    setQtyItemsInBag((v) => v + newToBag.quantity);
    saveCookie(bag);
    return bag._id;
  }

  async function removeFromBagHandler(item) {
    const newToBag = {
      ...item,
      quantity: 0,
    }
    addToBagHandler(newToBag);
  }

  const context = {
    bag: {
      bagId: bagId,
      qtyItemsInBag: qtyItemsInBag,
    },
    user: {},
    addToBag: addToBagHandler,
    removeFromBag: removeFromBagHandler,
  };

  return (
    <BagContext.Provider value={context}>{props.children}</BagContext.Provider>
  );
}

export default BagContext;
