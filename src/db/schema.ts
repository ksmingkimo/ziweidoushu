// Drizzle ORM 数据库表定义
import {
  pgTable, serial, varchar, text, integer,
  timestamp, jsonb, boolean, index, pgEnum,
} from 'drizzle-orm/pg-core';

// ---- 枚举 ----

export const orderStatusEnum = pgEnum('order_status', [
  'pending', 'paid', 'cancelled', 'refunded',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'wechat', 'alipay',
]);

export const readingTypeEnum = pgEnum('reading_type', [
  'natal', 'palace_ming', 'palace_fuq', 'palace_caibo',
  'palace_shiye', 'palace_hunyin', 'palace_jiankang',
  'daxian', 'liunian', 'liuyue', 'liuri',
  'compatibility', 'zeri',
  'daily',
]);

// ---- 用户表 ----

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  phone: varchar('phone', { length: 20 }).unique(),
  wechatOpenid: varchar('wechat_openid', { length: 64 }).unique(),
  wechatUnionid: varchar('wechat_unionid', { length: 64 }).unique(),
  nickname: varchar('nickname', { length: 100 }),
  avatar: varchar('avatar', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ---- 命盘表 ----

export const charts = pgTable('charts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: varchar('name', { length: 50 }),
  gender: varchar('gender', { length: 2 }).notNull(),
  solarYear: integer('solar_year').notNull(),
  solarMonth: integer('solar_month').notNull(),
  solarDay: integer('solar_day').notNull(),
  birthHour: integer('birth_hour').notNull(),
  chartData: jsonb('chart_data').notNull(), // 完整命盘 JSON
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ---- 解读记录表 ----

export const readings = pgTable('readings', {
  id: serial('id').primaryKey(),
  chartId: integer('chart_id').references(() => charts.id).notNull(),
  userId: integer('user_id').references(() => users.id),
  readingType: readingTypeEnum('reading_type').notNull(),
  focusArea: varchar('focus_area', { length: 100 }),
  content: text('content'),               // AI 解读全文 Markdown
  model: varchar('model', { length: 50 }), // 使用的 AI 模型
  tokensUsed: integer('tokens_used'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ---- 支付订单表 ----

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  packageId: varchar('package_id', { length: 50 }).notNull(),
  amount: integer('amount').notNull(),      // 金额（分）
  status: orderStatusEnum('status').default('pending').notNull(),
  paymentMethod: paymentMethodEnum('payment_method'),
  payjsOrderId: varchar('payjs_order_id', { length: 64 }),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ---- 用户剩余次数表 ----

export const credits = pgTable('credits', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).unique().notNull(),
  remaining: integer('remaining').default(0).notNull(),
  totalUsed: integer('total_used').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
