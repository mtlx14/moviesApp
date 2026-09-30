import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import db from './conection';
import { useFocusEffect } from 'expo-router';

const DataContext = createContext();

export const DataProviderLists = ({ children, listNames }) => {
  const [data, setData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (listNames.length === 0) return;

      const unsubscribes = [];

      listNames.forEach((list) => {
        const docRef = doc(db, 'lists', list);

        const unsubscribe = onSnapshot(docRef, (snapshot) => {
          setData((prev) => {
            const newList = snapshot.exists() ? snapshot.data().tmdb_id || [] : [];

            const prevList = prev[list] || [];

            const isEqual = prevList.length === newList.length && prevList.every((id, idx) => id === newList[idx]);

            if (isEqual) return prev;

            return {
              ...prev,
              [list]: newList,
            };
          });
        });

        unsubscribes.push(unsubscribe);
      });

      // -------list cast
      const extraRef = doc(db, 'castLists', 'checked');
      const unsubscribeExtra = onSnapshot(extraRef, (snapshot) => {
        setData((prev) => {
          const newList = snapshot.exists() ? (snapshot.data().tmdb_id ?? []) : [];
          const prevList = prev.castLists;

          if (prevList !== undefined) {
            const isEqual = prevList.length === newList.length && prevList.every((id, idx) => id === newList[idx]);

            if (isEqual) return prev;
          }

          return {
            ...prev,
            castLists: newList,
          };
        });
      });

      unsubscribes.push(unsubscribeExtra);

      // -----
      return () => {
        unsubscribes.forEach((u) => u());
      };
    }, [JSON.stringify(listNames)]),
  );

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useDataLists = () => useContext(DataContext);
