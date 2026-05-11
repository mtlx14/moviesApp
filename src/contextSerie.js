import { createContext, useContext, useState, useCallback } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import db from './conection';
import { useFocusEffect } from '@react-navigation/native';

const DataContext = createContext();

export const DataProviderSerie = ({ children, imdb_id }) => {
  const [data, setData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (imdb_id) {
        const docRef = doc(db, 'series', imdb_id);

        const unsubscribe = onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            const dataDB = snapshot.data();
            setData(dataDB);
          } else {
            setData(null);
          }
        });

        return () => {
          unsubscribe();
        };
      }

      return () => {};
    }, [imdb_id]),
  );

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useDataSerie = () => useContext(DataContext);
