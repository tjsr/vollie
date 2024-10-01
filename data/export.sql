PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE Events (
  id integer primary key autoincrement,
  name text not null,
  series_id integer,
  start_date text not null,
  end_date text not null,
  location text not null,
  description text not null,
  organiser_id integer not null
);
INSERT INTO Events VALUES(1,'Test event',2001,'2024-09-25','2024-09-25','Some location','Some desc',1001);
INSERT INTO Events VALUES(2,'Test event',2001,'2024-09-25','2024-09-25','Some location','Some desc',1001);
INSERT INTO Events VALUES(3,'Test event',2001,'2024-09-25','2024-09-25','Some location','Some desc',1001);
INSERT INTO Events VALUES(4,'Test event',2001,'2024-09-25','2024-09-25','Some location','Some desc',1001);
CREATE TABLE Series (
  id integer primary key autoincrement,
  name text not null,
  description text not null,
  organiser_id integer
);
CREATE TABLE Organisers (
  id integer primary key autoincrement,
  entity_name text not null,
  contact_user_id integer not null
);
CREATE TABLE Users (
  id integer primary key autoincrement,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null
);
CREATE TABLE OrganisationRoles (
  id integer primary key autoincrement,
  name text not null
);
CREATE TABLE Accreditations (
  id integer primary key autoincrement,
  name text not null,
  description text not null
);
CREATE TABLE AccreditationFields (
  id integer primary key autoincrement,
  accreditation_id integer not null,
  name text not null,
  description text not null,
  field_type text not null
);
CREATE TABLE UserAccreditations (
  id integer primary key autoincrement,
  user_id integer not null,
  accreditation_id integer not null,
  added_date text not null,
  expiry_date text not null,
  verified_by_user integer not null,
  verified_by_time text not null
);
CREATE TABLE UserAccreditationFields (
  id integer primary key autoincrement,
  user_accreditation_id integer not null,
  field_id integer not null,
  value text not null
);
CREATE TABLE EventRequiredRoles (
  id integer primary key autoincrement,
  event_id integer not null,
  role_id integer not null
);
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('Events',4);