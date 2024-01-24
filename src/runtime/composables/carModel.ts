export const useCarTableState = () => useState('carTable', () => ({
  refresh: null,
  pages: 0,
  count: 0,
}))
