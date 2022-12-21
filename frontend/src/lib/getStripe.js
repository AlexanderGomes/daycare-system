import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

const getStripe = () => {
  if(!stripePromise) {
    stripePromise = loadStripe(process.env.STRIPE__PLUBIC__KEY);
  }

  return stripePromise;
}

export default getStripe;