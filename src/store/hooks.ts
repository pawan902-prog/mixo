// Simple Redux hooks with types
// These hooks help us use Redux in our components with TypeScript support

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './index';

// Hook to dispatch actions (send actions to Redux store)
export const useAppDispatch = () => {
    return useDispatch<AppDispatch>();
};

// Hook to get data from Redux store
export const useAppSelector = (selector: (state: RootState) => any) => {
    return useSelector(selector);
};
