import { describe, expect, test } from '@jest/globals';
import {
  feedsSlice,
  getAllFeeds,
  getOrdersFeeds,
  getTotalFeeds,
  getTotalTodayFeeds,
  initialState
} from './feeds';
import { configureStore } from '@reduxjs/toolkit';
import { feedsMockData } from './testData';

describe('feedsSlice tests', () => {
  test('selectors tests:  getOrdersFeeds, getTotalFeeds, getTotalTodayFeeds', () => {
    const store = configureStore({
      reducer: {
        feeds: feedsSlice.reducer
      },
      preloadedState: {
        feeds: feedsMockData
      }
    });
    const orders = getOrdersFeeds(store.getState());
    const total = getTotalFeeds(store.getState());
    const totalToday = getTotalTodayFeeds(store.getState());
    expect(orders).toEqual(feedsMockData.orders);
    expect(total).toEqual(feedsMockData.total);
    expect(totalToday).toEqual(feedsMockData.totalToday);
  });

  test('Reducer test: getAllFeeds, fulfilled', () => {
    const action = {
      type: getAllFeeds.fulfilled.type,
      payload: feedsMockData
    };
    const stateReceived = feedsSlice.reducer(initialState, action);
    expect(stateReceived).toEqual(feedsMockData);
    expect(stateReceived.isLoading).toEqual(false);
  });

  test('Reducer test: getAllFeeds, rejected', () => {
    const stateReceived = feedsSlice.reducer(
      initialState,
      getAllFeeds.rejected(new Error('error'), 'Testing error')
    );
    expect(stateReceived.orders).toEqual([]);
    expect(stateReceived.total).toEqual(0);
    expect(stateReceived.totalToday).toEqual(0);
    expect(stateReceived.isLoading).toEqual(false);
    expect(stateReceived.error).toEqual('error');
  });

  test('Reducer test: getAllFeeds, pending', () => {
    const stateReceived = feedsSlice.reducer(
      initialState,
      getAllFeeds.pending('')
    );
    expect(stateReceived.isLoading).toEqual(true);
  });
});
