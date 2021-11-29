import { createContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const BagContext = createContext({
  loading: true,
  bag: {
    id: '',
    items: [],
    qtyItems: 0,
    addOrRemoveItem: function (p) {},
  },
});

export function BagContextProvider(props) {
  const [cookieBag, setCookieBag] = useState({ id: '', qtyItems: 0 });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookies] = useCookies();

  const loadBag = async (id) => {
    const request = await fetch(`/api/loja/bag?id=${id}`);
    const data = await request.json();
    setItems(data.items);
  };

  useEffect(() => {
    setLoading(true);
    if (cookies) {
      if (cookies['@laruci:bag']) {
        setCookieBag(cookies['@laruci:bag']);
        loadBag(cookies['@laruci:bag'].id);
      } else {
        const today = new Date();
        setCookies('@laruci:bag', cookieBag, {
          expires: new Date(today.setTime(today.getTime() + 24 * 3600000)),
          path: '/',
          sameSite: 'strict',
        });
      }
    }
    setLoading(false);
  }, []);

  function saveCookie(bag) {
    let today = new Date();
    setCookies('@laruci:bag', bag, {
      expires: new Date(today.setTime(today.getTime() + 24 * 3600000)),
      path: '/',
      sameSite: 'strict',
    });
  }

  async function addOrRemoveItem(newToBag) {
    // newToBag = {
    //   id
    //   product
    //   selectedSet
    //   selectedSizes
    //   selectedExtras
    //   quantity
    // }
    let localGeo = {};
    const listToAdd = [...items];

    if (!cookieBag.id) {
      const local = await fetch('https://geolocation-db.com/json/');
      localGeo = await local.json();
    }

    console.log(newToBag)

    let itemIdx = -1;
    if (!newToBag.id) {
      // Has no id, detect item by comparing all fields
      itemIdx = listToAdd.findIndex((item) => {
        if (
          item.productId !== newToBag.productId ||
          item.selectedSet !== newToBag.selectedSet
        )
          return false;

        if (item.selectedSizes?.length !== newToBag.selectedSizes?.length)
          return false;

        if (item.selectedExtras?.length !== newToBag.selectedExtras?.length)
          return false;

        const itemSS = [];
        const ntBgSS = [];
        for (let i = 0; i < item.selectedSizes?.length; i++) {
          itemSS.push({
            sizeId: item.selectedSizes[i].size.sizeId,
            selected: item.selectedSizes[i].selected,
          });
          ntBgSS.push({
            sizeId: newToBag.selectedSizes[i].size.sizeId,
            selected: newToBag.selectedSizes[i].selected,
          });
        }

        const itemSE =
          item.selectedExtras?.map((extra) => ({
            extraId: extra.option._id,
            selected: extra.selected,
          })) || [];

        const ntBgSE =
          newToBag.selectedExtras?.map((extra) => ({
            extraId: extra.option._id,
            selected: extra.selected,
          })) || [];

        console.log(JSON.stringify(itemSS));
        console.log(JSON.stringify(ntBgSS));
        console.log(JSON.stringify(itemSE));
        console.log(JSON.stringify(ntBgSE));

        return (
          JSON.stringify(itemSS) === JSON.stringify(ntBgSS) &&
          JSON.stringify(itemSE) === JSON.stringify(ntBgSE)
        );
      });
    } else {
      itemIdx = listToAdd.findIndex((item) => item._id === newToBag.id);
    }

    if (itemIdx >= 0) {
      if (listToAdd[itemIdx].quantity === -1 * newToBag.quantity) {
        // if item.quantity is equal to negative bag.items.quantity, remove item from bag
        listToAdd.splice(itemIdx, 1);
      } else {
        // if not, add value
        listToAdd[itemIdx].quantity =
          listToAdd[itemIdx].quantity + newToBag.quantity;
      }
    } else {
      if (newToBag.quantity > 0) {
        listToAdd.push(newToBag);
      }
    }

    const response = await fetch('/api/loja/bag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: cookieBag.id,
        ...localGeo,
        items: listToAdd,
      }),
    });
    let data;
    switch (response.status) {
      case 201:
        data = await response.json();
        break;
      default:
        return false;
    }

    const newBag = {
      id: data.bag._id,
      qtyItems: cookieBag.qtyItems + newToBag.quantity,
    };

    setItems(listToAdd);
    setCookieBag(newBag);
    saveCookie(newBag);

    return true;
  }

  const context = {
    isLoading: loading,
    bag: {
      ...cookieBag,
      items: items,
      addOrRemoveItem: addOrRemoveItem,
    },
  };

  return (
    <BagContext.Provider value={context}>{props.children}</BagContext.Provider>
  );
}

export default BagContext;
