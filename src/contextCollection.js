import { createContext, useContext, useState, useCallback } from 'react';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import db from './conection';
import { useFocusEffect } from '@react-navigation/native';

const DataContext = createContext();

export const DataProviderMovie = ({ children, imdb_id }) => {
  const [data, setData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (imdb_id) {
        const docRef = doc(db, 'movies', imdb_id);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            const dataDB = snapshot.data();
            setData(dataDB);
          }
        });

        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
        };
      }

      return () => {};
    }, [imdb_id]),
  );

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useDataMovie = () => useContext(DataContext);

export const DataProviderCollection = ({ children, moviesIds }) => {
  const [data, setData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (!Array.isArray(moviesIds) || moviesIds.length === 0) {
        setData([]);
        return;
      }

      const chunks = [];
      for (let i = 0; i < moviesIds.length; i += 10) {
        chunks.push(moviesIds.slice(i, i + 10));
      }

      let results = [];
      const unsubscribes = [];

      chunks.forEach((chunk) => {
        const moviesQuery = query(collection(db, 'movies'), where('imdbId', 'in', chunk));

        const unsubscribe = onSnapshot(
          moviesQuery,
          (querySnapshot) => {
            const movies = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            results = [...results.filter((movie) => !chunk.includes(movie.imdbId)), ...movies];

            setData([...results]);
          },
          (error) => {
            console.error('Error fetching movies chunk:', error);
          },
        );

        unsubscribes.push(unsubscribe);
      });

      return () => {
        unsubscribes.forEach((unsub) => unsub());
      };
    }, [JSON.stringify(moviesIds)]),
  );

  return <DataContext.Provider value={{ data }}>{children}</DataContext.Provider>;
};

export const useDataCollection = () => useContext(DataContext);
