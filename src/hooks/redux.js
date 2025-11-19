import { useDispatch, useSelector } from 'react-redux';

// Переопределяем хуки для типизации
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;