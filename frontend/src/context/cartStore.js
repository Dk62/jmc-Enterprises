import create from 'zustand';

const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart')) || [],
  totalPrice: 0,

  addToCart: (product, quantity) => {
    const { items } = get();
    const existingItem = items.find(item => item.productId === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity,
        image: product.image
      });
    }

    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(items));
    set({ items, totalPrice });
  },

  removeFromCart: (productId) => {
    const { items } = get();
    const filteredItems = items.filter(item => item.productId !== productId);
    const totalPrice = filteredItems.reduce((total, item) => total + item.price * item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(filteredItems));
    set({ items: filteredItems, totalPrice });
  },

  updateQuantity: (productId, quantity) => {
    const { items } = get();
    const item = items.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(items));
    set({ items, totalPrice });
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [], totalPrice: 0 });
  },

  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}));

export default useCartStore;
