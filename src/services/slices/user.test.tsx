import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  userMockData,
  userMockDataUpdated,
  userRegisterData,
  userRegisterDataUpdated,
  userResponce,
  userResponceUpdated
} from './testData';
import {
  isAuthCheckedSelector,
  getUser,
  getName,
  getError,
  userSlice,
  initialState,
  register,
  login,
  apiGetUser,
  updateUser,
  logout
} from './user';

describe('user tests', () => {
  const stateConstructor = (action: { type: string; payload?: {} }) =>
    userSlice.reducer(initialState, action);

  test('Selectors tests: isAuthCheckedSelector, getUser, getName, getError, ', () => {
    const store = configureStore({
      reducer: {
        user: userSlice.reducer
      },
      preloadedState: {
        user: userMockData
      }
    });
    const isAuthChecked = isAuthCheckedSelector(store.getState());
    const user = getUser(store.getState());
    const name = getName(store.getState());
    const error = getError(store.getState());
    expect(isAuthChecked).toEqual(userMockData.isAuthChecked);
    expect(user).toEqual(userMockData.user);
    expect(name).toEqual(userMockData.user.name);
    expect(error).toEqual(userMockData.error);
  });

  test('Reducer tests: register, fulfilled', () => {
    const action = {
      type: register.fulfilled.type,
      payload: userResponce
    };
    expect(stateConstructor(action)).toEqual(userMockData);
  });

  test('Reducer tests: register, rejected', () => {
    const newState = userSlice.reducer(
      initialState,
      register.rejected(new Error('error'), 'testing error', userRegisterData)
    );
    expect(newState.error).toEqual('error');
  });

  test('Reducer tests: register, pending', () => {
    const newState = userSlice.reducer(
      initialState,
      register.pending('', userRegisterData)
    );
    expect(newState.isAuthChecked).toEqual(false);
    expect(newState.error).toEqual('');
  });

  test('Reducer tests: login, fulfilled', () => {
    const action = {
      type: login.fulfilled.type,
      payload: userResponce
    };
    expect(stateConstructor(action)).toEqual(userMockData);
  });

  test('Reducer tests: login, rejected', () => {
    const newState = userSlice.reducer(
      initialState,
      login.rejected(new Error('error'), 'testing error', userRegisterData)
    );
    expect(newState.error).toEqual('error');
    expect(newState.isAuthChecked).toEqual(false);
  });

  test('Reducer tests: login, pending', () => {
    const newState = userSlice.reducer(
      initialState,
      login.pending('', userRegisterData)
    );
    expect(newState.isAuthChecked).toEqual(false);
    expect(newState.error).toEqual('');
  });

  test('Reducer tests: apiGetUser, fulfilled', () => {
    const action = {
      type: apiGetUser.fulfilled.type,
      payload: userResponce
    };
    expect(stateConstructor(action)).toEqual(userMockData);
  });

  test('Reducer tests: apiGetUser, rejected', () => {
    const newState = userSlice.reducer(
      initialState,
      apiGetUser.rejected(new Error('error'), 'testing error')
    );
    expect(newState.error).toEqual('error');
    expect(newState.isAuthChecked).toEqual(false);
  });

  test('Reducer tests: updateUser, fulfilled', () => {
    const action = {
      type: updateUser.fulfilled.type,
      payload: userResponceUpdated
    };
    expect(stateConstructor(action)).toEqual(userMockDataUpdated);
  });

  test('Reducer tests: updateUser, rejected', () => {
    const newState = userSlice.reducer(
      initialState,
      updateUser.rejected(
        new Error('error'),
        'testing error',
        userRegisterDataUpdated
      )
    );
    expect(newState.error).toEqual('error');
    expect(newState.isAuthChecked).toEqual(false);
  });

  test('Reducer tests: updateUser, pending', () => {
    const newState = userSlice.reducer(
      initialState,
      updateUser.pending('', userRegisterDataUpdated)
    );
    expect(newState.isAuthChecked).toEqual(false);
    expect(newState.error).toEqual('');
  });

  test('Reducer tests: logout, fulfilled', () => {
    const action = {
      type: logout.fulfilled.type,
      payload: userResponce
    };
    expect(stateConstructor(action)).toEqual(initialState);
  });
});
