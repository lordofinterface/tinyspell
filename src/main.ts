import './style.css'
import {Cart} from './controllers/Cart';
import {Keyboard} from './controllers/Keyboard'; 
import {Mouse} from './controllers/Mouse'; 

const appEl = document.querySelector('#app');
const cart = new Cart('cart');

init(cart);

async function init(cart: Cart) {
  const canvas = await cart.init();
  Keyboard.init(cart.runtime);
  Mouse.init(canvas);
  if (appEl) appEl.appendChild(canvas);
}
