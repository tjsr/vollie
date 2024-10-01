import { Accreditation, AccreditationFields } from "./accreditations";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { idPrimaryKey } from "./types";

const accreditationReferenceId = () => integer('accreditation_id');
const accreditationReferenceField = () => accreditationReferenceId().$type<Accreditation>();
export const userReferenceId = (columnName: string = 'user_id') => integer(columnName).references(() => UsersTable.id);
export const userReferenceField = (columnName: string = 'user_id') => userReferenceId(columnName).$type<User>();

export const UsersTable = sqliteTable('Users', {
  id: idPrimaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
});

export type UserTO = typeof UsersTable.$inferSelect;
export type User = UserTO;

export const UserAccreditationFieldsTable = sqliteTable('UserAccreditationFields', {
  id: idPrimaryKey(),
  userAccreditation: integer('user_accreditation_id').$type<UserAccreditations>().notNull(),
  field: integer('field_id').$type<AccreditationFields>().notNull(),
  value: text('value').notNull(),
});

export type UserAccreditationFieldsTO = typeof UserAccreditationFieldsTable.$inferSelect;
export type UserAccreditationFields = Omit<UserAccreditationFieldsTO, 'field'> & { field: AccreditationFields };

export const UserAccreditationsTable = sqliteTable('UserAccreditations', {
  id: idPrimaryKey(),
  user: userReferenceField().notNull(),
  accreditation: accreditationReferenceField().notNull(),
  addedDate: text('added_date').notNull(),
  expiryDate: text('expiry_date').notNull(),
  verifiedByUser: integer('verified_by_user').notNull(),
  verifiedByTime: text('verified_by_time').notNull(),
});

export type UserAccreditationsTO = typeof UserAccreditationsTable.$inferSelect;
export type UserAccreditations = Omit<UserAccreditationsTO, 'user' | 'accreditation' | 'verifiedByUser'> & { user: User, accreditation: Accreditation, verifiedByUser: User };