import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Users = sqliteTable('Users', {
  id: integer('id').primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
});

export const UserAccreditationFields = sqliteTable('UserAccreditationFields', {
  id: integer('id').primaryKey(),
  userAccreditation: integer('user_accreditation_id').$type<"UserAccreditations">().notNull(),
  field: integer('field_id').$type<"AccreditationFields">().notNull(),
  value: text('value').notNull(),
});

export const UserAccreditations = sqliteTable('UserAccreditations', {
  id: integer('id').primaryKey(),
  user: integer('user_id').$type<"Users">().notNull(),
  accreditation: integer('accreditation_id').$type<"Accreditations">().notNull(),
  addedDate: text('added_date').notNull(),
  expiryDate: text('expiry_date').notNull(),
  verifiedByUser: integer('verified_by_user').notNull(),
  verifiedByTime: text('verified_by_time').notNull(),
});
