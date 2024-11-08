import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { ordersMockData } from './testData';
import {
  listOfOrders,
  initialState,
  userOrdersSlice,
  getUserOrders
} from './userOrders';

describe('orders tests', () => {
  test('selector test: listOfOrders, ', () => {
    const store = configureStore({
      reducer: {
        orders: userOrdersSlice.reducer
      },
      preloadedState: {
        orders: ordersMockData
      }
    });
    const orderRequest = listOfOrders(store.getState());

    expect(orderRequest).toEqual(ordersMockData.orders);
  });

  test('Reducer tests: getUserOrders, fulfilled', () => {
    const newState = userOrdersSlice.reducer(
      initialState,
      getUserOrders.fulfilled(ordersMockData.orders, '')
    );
    expect(newState.orders).toEqual(ordersMockData.orders);
    expect(newState.isLoading).toEqual(false);
  });

  test('Reducer tests: getUserOrders, rejected', () => {
    const newState = userOrdersSlice.reducer(
      initialState,
      getUserOrders.rejected(new Error('error'), 'testing error')
    );
    expect(newState.isLoading).toEqual(false);
  });

  test('Reducer tests: getUserOrders, pending', () => {
    const newState = userOrdersSlice.reducer(
      initialState,
      getUserOrders.pending('')
    );
    expect(newState.isLoading).toEqual(true);
  });
});
