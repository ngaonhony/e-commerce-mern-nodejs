import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { Slot } from 'expo-router';
import store, { AppDispatch } from '../store';
import { loadUser } from '../store/authSlice';

const ReduxInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ReduxInitializer />
    </Provider>
  );
}