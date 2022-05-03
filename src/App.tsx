import { useState } from 'react';
import { useQuery } from 'react-query';
// Components
import Item from './Item/Item';
import Cart from './Cart/Cart';
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Badge from '@material-ui/core/Badge';
// Styles
import { Wrapper, StyledButton } from './App.styles';
// Types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  quanity: number;
};

const getProducts = async (): Promise<CartItemType[]> =>
  await await (await fetch('https://fakestoreapi.com/products')).json();

const App = () => {
  const [cartOpen, isCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);

  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products',
    getProducts
  );

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((acc: number, item) => acc + item.quanity, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems((prev) => {
      // 1. Is the item already added in the cart?
      const isItemInCart = prev.find((item) => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map((item) =>
          item.id === clickedItem.id
            ? { ...item, quanity: item.quanity + 1 }
            : item
        );
      }
      // First time the item is added
      return [...prev, { ...clickedItem, quanity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    // setCartItem with previous state
    setCartItems((prev) =>
      // call the reduce on the previous state
      prev.reduce((acc, item) => {
        // check if the item.id is equal to the id that is sent as an argument
        if (item.id === id) {
          // if the item.quanity is equal to 1 return acc and that will delete item
          if (item.quanity === 1) return acc;
          // otherwise return a new array spread out acc and have new object
          // where I spread out the item and subtract 1 from quanity
          return [...acc, { ...item, quanity: item.quanity - 1 }];
        } else {
          // return item as it is
          return [...acc, item];
        }
        // acc that start as an empty array that specify as the CartItemType []
      }, [] as CartItemType[])
    );
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong...</div>;

  return (
    <Wrapper>
      <Drawer anchor="right" open={cartOpen} onClose={() => isCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => isCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;
