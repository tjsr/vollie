insert into Users (id, first_name, last_name, email, phone) values (1001, 'Test', 'Admin', 'tim@tjsr.id.au', '612413890213');

insert into Organisers (entity_name, contact_user_id) values ('Test Organiser', 1);

insert into Accreditations (name, description) values ('Test Accreditation', 'This is a test accreditation');
insert into Accreditations (name, description) values ('First Aid - basic', 'Basic First Aid');
insert into Accreditations (name, description) values ('First Aid - basic emergency', 'Basic Emergency Life Support First Aid');
insert into Accreditations (name, description) values ('First Aid - trainer', 'First Aid trainer');
insert into Accreditations (name, description) values ('First Aid - education', 'Education and Care Seting First Aid');
insert into Accreditations (name, description) values ('Paramedic', 'Paramedic or Emergency Paramedic');
insert into Accreditations (name, description) values ('Medical Doctor', 'Certified Medical Doctor');
insert into Accreditations (name, description) values ('Commissaire - MTB Club', 'NOAS Level 1 (Club) commissaire - MTB');
insert into Accreditations (name, description) values ('Commissaire - MTB State', 'NOAS Level 2 (State) commissaire - MTB');
insert into Accreditations (name, description) values ('Commissaire - MTB National', 'NOAS Level 3 (National) commissaire - MTB');
insert into Accreditations (name, description) values ('Commissaire - MTB National', 'NOAS Level 3 (National) commissaire - MTB');

insert into EventRequiredRoles (name) values ('Commissaire');