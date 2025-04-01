const salesToCreate = [
  {
    date: '2024-01-05',
    items: [
      { productId: 1, quantity: 2 },
      { productId: 3, quantity: 4 },
    ],
  },
  {
    date: '2024-2-11',
    items: [
      { productId: 9, quantity: 8 },
      { productId: 6, quantity: 7 },
      { productId: 7, quantity: 1 },
    ],
  },
  {
    date: '2024-02-14',
    items: [
      { productId: 9, quantity: 12 },
      { productId: 8, quantity: 6 },
    ],
  },
  {
    date: '2024-2-19',
    items: [
      { productId: 4, quantity: 3 },
      { productId: 7, quantity: 9 },
      { productId: 9, quantity: 8 },
    ],
  },
  {
    date: '2024-3-7',
    items: [
      { productId: 8, quantity: 19 },
      { productId: 4, quantity: 1 },
      { productId: 5, quantity: 12 },
    ],
  },
  {
    date: '2024-5-6',
    items: [
      { productId: 3, quantity: 4 },
      { productId: 10, quantity: 16 },
      { productId: 2, quantity: 19 },
    ],
  },
  {
    date: '2024-5-6',
    items: [
      { productId: 7, quantity: 11 },
      { productId: 8, quantity: 14 },
      { productId: 9, quantity: 17 },
    ],
  },
  {
    date: '2024-5-6',
    items: [
      { productId: 2, quantity: 12 },
      { productId: 3, quantity: 20 },
      { productId: 4, quantity: 12 },
    ],
  },
  {
    date: '2024-5-6',
    items: [
      { productId: 2, quantity: 13 },
      { productId: 3, quantity: 7 },
      { productId: 4, quantity: 9 },
    ],
  },
  {
    date: '2024-5-6',
    items: [
      { productId: 4, quantity: 11 },
      { productId: 5, quantity: 15 },
      { productId: 6, quantity: 4 },
    ],
  },
  {
    date: '2024-5-6',
    items: [
      { productId: 6, quantity: 4 },
      { productId: 7, quantity: 15 },
      { productId: 8, quantity: 19 },
    ],
  },
  {
    date: '2024-5-6',
    items: [
      { productId: 3, quantity: 12 },
      { productId: 4, quantity: 3 },
      { productId: 5, quantity: 16 },
    ],
  },
  {
    date: '2024-5-6',
    items: [
      { productId: 1, quantity: 9 },
      { productId: 2, quantity: 10 },
      { productId: 3, quantity: 22 },
    ],
  },
  {
    date: '2024-5-6',
    items: [
      { productId: 8, quantity: 5 },
      { productId: 9, quantity: 3 },
      { productId: 10, quantity: 6 },
    ],
  },
  {
    date: '2024-5-6',
    items: [
      { productId: 9, quantity: 18 },
      { productId: 10, quantity: 9 },
      { productId: 6, quantity: 10 },
    ],
  },
  {
    date: '2024-5-6',
    items: [
      { productId: 6, quantity: 16 },
      { productId: 7, quantity: 19 },
      { productId: 4, quantity: 15 },
    ],
  },
  {
    date: '2024-5-20',
    items: [
      { productId: 2, quantity: 7 },
      { productId: 3, quantity: 9 },
      { productId: 5, quantity: 18 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 1, quantity: 13 },
      { productId: 4, quantity: 18 },
      { productId: 7, quantity: 9 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 1, quantity: 4 },
      { productId: 2, quantity: 9 },
      { productId: 3, quantity: 20 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 4, quantity: 6 },
      { productId: 5, quantity: 12 },
      { productId: 6, quantity: 11 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 10, quantity: 13 },
      { productId: 5, quantity: 10 },
      { productId: 6, quantity: 16 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 6, quantity: 14 },
      { productId: 7, quantity: 18 },
      { productId: 8, quantity: 20 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 2, quantity: 3 },
      { productId: 3, quantity: 10 },
      { productId: 4, quantity: 20 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 5, quantity: 17 },
      { productId: 6, quantity: 6 },
      { productId: 7, quantity: 5 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 5, quantity: 8 },
      { productId: 6, quantity: 5 },
      { productId: 7, quantity: 18 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 2, quantity: 15 },
      { productId: 3, quantity: 18 },
      { productId: 4, quantity: 6 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 5, quantity: 6 },
      { productId: 6, quantity: 13 },
      { productId: 7, quantity: 22 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 7, quantity: 6 },
      { productId: 8, quantity: 21 },
      { productId: 9, quantity: 6 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 3, quantity: 16 },
      { productId: 4, quantity: 18 },
      { productId: 5, quantity: 4 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 5, quantity: 13 },
      { productId: 6, quantity: 8 },
      { productId: 7, quantity: 15 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 3, quantity: 11 },
      { productId: 4, quantity: 12 },
      { productId: 5, quantity: 12 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 4, quantity: 17 },
      { productId: 5, quantity: 6 },
      { productId: 6, quantity: 11 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 3, quantity: 14 },
      { productId: 4, quantity: 17 },
      { productId: 5, quantity: 7 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 2, quantity: 12 },
      { productId: 3, quantity: 17 },
      { productId: 4, quantity: 15 },
    ],
  },
  {
    date: '2024-6-23',
    items: [
      { productId: 3, quantity: 8 },
      { productId: 4, quantity: 13 },
      { productId: 5, quantity: 9 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 7, quantity: 5 },
      { productId: 3, quantity: 13 },
      { productId: 10, quantity: 5 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 1, quantity: 2 },
      { productId: 8, quantity: 10 },
      { productId: 10, quantity: 9 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 2, quantity: 13 },
      { productId: 3, quantity: 8 },
      { productId: 5, quantity: 10 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 7, quantity: 10 },
      { productId: 5, quantity: 16 },
      { productId: 4, quantity: 8 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 8, quantity: 2 },
      { productId: 4, quantity: 17 },
      { productId: 10, quantity: 12 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 7, quantity: 9 },
      { productId: 3, quantity: 18 },
      { productId: 5, quantity: 8 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 5, quantity: 4 },
      { productId: 4, quantity: 12 },
      { productId: 9, quantity: 11 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 2, quantity: 5 },
      { productId: 3, quantity: 21 },
      { productId: 4, quantity: 20 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 8, quantity: 15 },
      { productId: 4, quantity: 21 },
      { productId: 7, quantity: 18 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 10, quantity: 15 },
      { productId: 8, quantity: 21 },
      { productId: 7, quantity: 19 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 8, quantity: 4 },
      { productId: 7, quantity: 19 },
      { productId: 2, quantity: 9 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 2, quantity: 17 },
      { productId: 7, quantity: 4 },
      { productId: 9, quantity: 22 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 3, quantity: 2 },
      { productId: 1, quantity: 21 },
      { productId: 5, quantity: 12 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 4, quantity: 4 },
      { productId: 7, quantity: 3 },
      { productId: 2, quantity: 19 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 9, quantity: 6 },
      { productId: 2, quantity: 13 },
      { productId: 6, quantity: 5 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 7, quantity: 7 },
      { productId: 2, quantity: 5 },
      { productId: 8, quantity: 17 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 3, quantity: 2 },
      { productId: 1, quantity: 12 },
      { productId: 7, quantity: 15 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 3, quantity: 17 },
      { productId: 2, quantity: 9 },
      { productId: 4, quantity: 15 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 2, quantity: 7 },
      { productId: 10, quantity: 4 },
      { productId: 9, quantity: 11 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 3, quantity: 6 },
      { productId: 5, quantity: 11 },
      { productId: 6, quantity: 8 },
    ],
  },
  {
    date: '2024-7-4',
    items: [
      { productId: 3, quantity: 6 },
      { productId: 8, quantity: 8 },
      { productId: 4, quantity: 18 },
    ],
  },
  {
    date: '2024-8-8',
    items: [
      { productId: 9, quantity: 17 },
      { productId: 7, quantity: 9 },
      { productId: 1, quantity: 15 },
    ],
  },
  {
    date: '2024-9-4',
    items: [
      { productId: 7, quantity: 6 },
      { productId: 5, quantity: 4 },
      { productId: 1, quantity: 6 },
    ],
  },
  {
    date: '2024-11-25',
    items: [
      { productId: 3, quantity: 14 },
      { productId: 2, quantity: 3 },
      { productId: 6, quantity: 2 },
    ],
  },
];

export default salesToCreate;
