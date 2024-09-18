import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const Events = sqliteTable('Events', {
  id: integer('id').primaryKey(),
  name: text("name").notNull(),
  series: integer("series_id").$type<"Series">(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  organiser: integer("organiser_id").$type<"Organisers">().notNull(),
});

export const Series = sqliteTable('Series', {
  id: integer('id').primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  organiser: integer("organiser_id").$type<"Organisers">(),
});

export const Organisers = sqliteTable('Organisers', {
  id: integer('id').primaryKey(),
  entityName: text("entity_name").notNull(),
  contactUser: integer("contact_user_id").$type<"Users">().notNull(),
});

export const EventRequiredRoles = sqliteTable('EventRequiredRoles', {
  id: integer('id').primaryKey(),
  event: integer('event_id').$type<"Events">().notNull(),
  numberRequired: integer('number_required').default(1),
  details: text('details'),
  role: integer('role_id').$type<"OrganisationRoles">().notNull(),
});

export const EventRequiredRoleAccreditations = sqliteTable('EventRequiredRoleAccreditations', {
  id: integer('id').primaryKey(),
  eventRequiredRole: integer('event_required_role_id').$type<"EventRequiredRoles">().notNull(),
  accreditation: integer('accreditation_id').$type<"Accreditations">().notNull(),
});

export const EventRoles = sqliteTable('EventRoles', {
  id: integer('id').primaryKey(),
  event: integer('event_id').$type<"Events">().notNull(),
  user: integer('user_id').$type<"Users">().notNull(),
  eventRole: integer('role_id').$type<"EventRequiredRoles">().notNull(),
  roleRequestCreated: text('role_request_created').notNull(),
  roleApprovedBy: integer('role_approved_by').notNull(),
  roleApprovedAt: text('role_approved_at').notNull(),
  userRequestNotes: text('user_request_notes'),
  approverNotes: text('approver_notes')
});

