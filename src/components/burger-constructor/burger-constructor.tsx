import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  constructorSelector,
  clearAll
} from '../../services/slices/constructor';
import {
  getOrderModalData,
  getOrderRequest,
  placeNewOrder,
  resetOrder
} from '../../services/slices/newOrder';
import { isAuthCheckedSelector } from '../../services/slices/user';
import { AppDispatch } from '../../services/store';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const constructorItems = useSelector(constructorSelector.selectItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const isAuth = useSelector(isAuthCheckedSelector);

  const onOrderClick = () => {
    if (!isAuth) {
      return navigate('/login');
    }
    if (!constructorItems.bun || orderRequest) return;
    const orderData = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id)
    ];
    dispatch(placeNewOrder(orderData));
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
    dispatch(clearAll());
    navigate('/');
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
