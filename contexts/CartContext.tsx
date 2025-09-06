import React, { createContext, ReactNode, useContext, useReducer } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  seller: string;
  sellerId: string;
  shopName: string;
  quantity: number;
  maxQuantity?: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile' | 'bank' | 'cod';
  name: string;
  details: string;
  isDefault?: boolean;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  selectedPaymentMethod?: PaymentMethod;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      let updatedItems: CartItem[];
      if (existingItem) {
        const newQuantity = existingItem.quantity + (action.payload.quantity || 1);
        const maxQuantity = action.payload.maxQuantity || existingItem.maxQuantity || 99;
        
        updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.min(newQuantity, maxQuantity) }
            : item
        );
      } else {
        updatedItems = [
          ...state.items,
          {
            ...action.payload,
            quantity: action.payload.quantity || 1,
          } as CartItem
        ];
      }

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalAmount,
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalAmount,
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id });
      }

      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.min(action.payload.quantity, item.maxQuantity || 99) }
          : item
      );

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalAmount,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'SET_PAYMENT_METHOD':
      return {
        ...state,
        selectedPaymentMethod: action.payload,
      };

    default:
      return state;
  }
};

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  getItemQuantity: (id: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const getItemQuantity = (id: string): number => {
    return state.items.find(item => item.id === id)?.quantity || 0;
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setPaymentMethod,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
