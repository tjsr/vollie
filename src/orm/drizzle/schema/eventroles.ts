import { RaceEvent, raceEventField } from './events.js';
import { User, userReferenceField } from './users.js';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { Accreditation } from './accreditations.js';
import { OrganisationRoles } from './roles.js';
import { idPrimaryKey } from './types.js';

export const RaceEventRequiredRolesTable = sqliteTable('EventRequiredRoles', {
  id: idPrimaryKey(),
  event: raceEventField().notNull(),
  numberRequired: integer('number_required').default(1),
  details: text('details'),
  role: integer('role_id').$type<OrganisationRoles>().notNull(),
});
export type RaceEventRequiredRoleTO = typeof RaceEventRequiredRolesTable.$inferSelect;
export type RaceEventRequiredRole = Omit<RaceEventRequiredRoleTO, 'role' | 'event'> & { role: OrganisationRoles };

export const RaceEventRequiredRoleAccreditationsTable = sqliteTable('EventRequiredRoleAccreditations', {
  id: idPrimaryKey(),
  eventRequiredRole: integer('event_required_role_id').$type<RaceEventRequiredRoleTO>().notNull(),
  accreditation: integer('accreditation_id').$type<Accreditation>().notNull(),
});
export type RaceEventRequiredRoleAccreditationsTO = typeof RaceEventRequiredRoleAccreditationsTable.$inferSelect;

export const RaceEventRolesTable = sqliteTable('EventRoles', {
  id: idPrimaryKey(),
  event: integer('event_id').$type<RaceEvent>().notNull(),
  user: userReferenceField().notNull(),
  eventRole: integer('role_id').$type<RaceEventRequiredRole>().notNull(),
  roleRequestCreated: text('role_request_created').notNull(),
  roleApprovedBy: integer('role_approved_by').notNull(),
  roleApprovedAt: text('role_approved_at').notNull(),
  userRequestNotes: text('user_request_notes'),
  approverNotes: text('approver_notes')
});
export type RaceEventRolesTO = typeof RaceEventRolesTable.$inferSelect;
export type RaceEventRole = Omit<RaceEventRolesTO, 'event' | 'user' | 'eventRole' | 'roleApprovedBy'> & { event: RaceEvent, user: User, eventRole: RaceEventRequiredRole, roleApprovedBy: User };

