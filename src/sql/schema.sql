drop table if exists Events;
create table Events (
  id integer primary key autoincrement,
  name text not null,
  series_id integer,
  start_date text not null,
  end_date text not null,
  location text not null,
  description text not null,
  organiser_id integer not null
);

drop table if exists Series;
create table Series (
  id integer primary key autoincrement,
  name text not null,
  description text not null,
  organiser_id integer
);

drop table if exists Organisers;
create table Organisers (
  id integer primary key autoincrement,
  entity_name text not null,
  contact_user_id integer not null
);

drop table if exists Users;
create table Users (
  id integer primary key autoincrement,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null
);

drop table if exists OrganisationRoles;
create table OrganisationRoles (
  id integer primary key autoincrement,
  name text not null
);

drop table if exists Accreditations;
create table Accreditations (
  id integer primary key autoincrement,
  name text not null,
  description text not null
);

drop table if exists AccreditationFields;
create table AccreditationFields (
  id integer primary key autoincrement,
  accreditation_id integer not null,
  name text not null,
  description text not null,
  field_type text not null
);

drop table if exists UserAccreditations;
create table UserAccreditations (
  id integer primary key autoincrement,
  user_id integer not null,
  accreditation_id integer not null,
  added_date text not null,
  expiry_date text not null,
  verified_by_user integer not null,
  verified_by_time text not null
);

drop table if exists UserAccreditationFields;
create table UserAccreditationFields (
  id integer primary key autoincrement,
  user_accreditation_id integer not null,
  field_id integer not null,
  value text not null
);

drop table if exists EventRequiredRoles;
create table EventRequiredRoles (
  id integer primary key autoincrement,
  event_id integer not null,
  number_required integer default 1,
  role_id integer not null
);

drop table if exists EventRequiredRoleAccreditations;
create table EventRequiredRoleAccreditations (
  id integer primary key autoincrement,
  event_required_role_id integer not null,
  accreditation_id integer not null
);

drop table if exists EventRoles;
create table EventRoles (
  id integer primary key autoincrement,
  event_id integer not null,
  user_id integer not null,
  role_id integer not null,
  role_request_created text not null,
  role_approved_by integer not null,
  role_approved_at text not null,
  user_request_notes text,
  approver_notes text
);
