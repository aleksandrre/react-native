// მაგალითი: privateApi-ს გამოყენება (მომავლისთვის)

import { privateApi } from './config';

// ეს ფუნქციები ავტომატურად დაამატებენ ტოკენს რექვესტებს

export const examplePrivateApiUsage = {
  // მაგალითი: პროფილის მოხმობა
  getProfile: async () => {
    const response = await privateApi.get('/user/profile');
    return response.data;
  },

  // მაგალითი: კალათის მოხმობა
  getCart: async () => {
    const response = await privateApi.get('/cart');
    return response.data;
  },

  // მაგალითი: პროდუქტის დამატება კალათში
  addToCart: async (productId: string, quantity: number) => {
    const response = await privateApi.post('/cart/add', {
      productId,
      quantity,
    });
    return response.data;
  },
};

