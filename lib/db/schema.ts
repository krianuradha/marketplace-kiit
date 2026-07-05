import { pgTable, text, varchar, integer, boolean, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const genderEnum = pgEnum('gender', ['M', 'F']);
export const categoryEnum = pgEnum('category', ['Clothing', 'Furniture', 'Electronics', 'Books', 'Sports', 'Home & Kitchen', 'Other']);
export const sectionEnum = pgEnum('section', ["Queen's Castle", "King Palace"]);

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash'),
  gender: genderEnum('gender'),
  avatarUrl: text('avatar_url'),
  googleId: varchar('google_id', { length: 255 }).unique(),
  googleEmail: varchar('google_email', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Products Table
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(), // Store in cents
  negotiable: boolean('negotiable').default(false).notNull(),
  usedTime: varchar('used_time', { length: 100 }).notNull(), // e.g., "Brand new", "Few months", "1 year"
  imageUrl: text('image_url'),
  category: categoryEnum('category').notNull(),
  section: sectionEnum('section').notNull(), // Queen's Castle or King Palace
  isSold: boolean('is_sold').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Chats Table
export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  buyerId: uuid('buyer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sellerId: uuid('seller_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Messages Table
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Ratings Table
export const ratings = pgTable('ratings', {
  id: uuid('id').primaryKey().defaultRandom(),
  sellerId: uuid('seller_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  buyerId: uuid('buyer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1-5
  review: text('review'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  chatsAsBuyer: many(chats, { relationName: 'buyer' }),
  chatsAsSeller: many(chats, { relationName: 'seller' }),
  messages: many(messages),
  ratingsReceived: many(ratings, { relationName: 'seller' }),
  ratingsGiven: many(ratings, { relationName: 'buyer' }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
  chats: many(chats),
}));

export const chatsRelations = relations(chats, ({ one, many }) => ({
  buyer: one(users, {
    fields: [chats.buyerId],
    references: [users.id],
    relationName: 'buyer',
  }),
  seller: one(users, {
    fields: [chats.sellerId],
    references: [users.id],
    relationName: 'seller',
  }),
  product: one(products, {
    fields: [chats.productId],
    references: [products.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  seller: one(users, {
    fields: [ratings.sellerId],
    references: [users.id],
    relationName: 'seller',
  }),
  buyer: one(users, {
    fields: [ratings.buyerId],
    references: [users.id],
    relationName: 'buyer',
  }),
  product: one(products, {
    fields: [ratings.productId],
    references: [products.id],
  }),
}));
