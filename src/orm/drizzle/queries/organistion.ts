import { Organisation, OrganisationTO, OrganisationsTable, OrganisationsTableTO } from "../schema/organisations";

import { Existing } from "../../../model/to";
import { IdType } from "../schema/types";
import { OrganisationId } from "../../../model/id";
import { UsersTable } from "../schema/users";
import { VollieDatabaseError } from "../../errors";
import { VollieDrizzleConnection } from "../../types";
import { eq } from "drizzle-orm";
import { safeCheckAndCopy } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const organisationSelectToOrganisationType = (result: any): Organisation => ({
  ...result.events,
  contactUser: result.contactUser
});

const organisationSelectJoined = (db: VollieDrizzleConnection) => db
  .select({ organiser: OrganisationsTable, contactUser: UsersTable })
  .from(OrganisationsTable)
  .leftJoin(UsersTable, eq(OrganisationsTable.contactUser, UsersTable.id))

const organisationSelectById = (db: VollieDrizzleConnection, id: IdType) => organisationSelectJoined(db).where(eq(OrganisationsTable.id, id));

export const organisationSelectAll = (db: VollieDrizzleConnection) => db.query.OrganisationsTable.findMany();

export const selectOrganisationById = async (db: VollieDrizzleConnection, id: number): Promise<Organisation|undefined> => {
  const resultPromise = organisationSelectById(db, id).then((result) => {
    if (result.length > 1) {
      throw new VollieDatabaseError(`Database query for event with id ${id} returned more than one result`);
    }
  
    if (result.length === 0) {
      return undefined;
    }
    const org: Organisation = organisationSelectToOrganisationType(result[0]);
    return org;
  });
  
  return resultPromise;
};

export const createOrganisation = async (db: VollieDrizzleConnection, organisation: OrganisationTO): Promise<OrganisationTO> => {
  return db.insert(OrganisationsTableTO).values(organisation).returning().then((result) => {
    if (result.length > 1) {
      throw new Error('Returned multiple results from insert');
    }
    console.log(`Created organisation with id ${result[0].id}`);
    return result[0];
  }).catch((err) => {
    console.error(createOrganisation, 'Failed to create organisation', err);
    throw err;
  });
};

export const updateOrganisation = async (db: VollieDrizzleConnection, organisation: Existing<OrganisationTO>): Promise<OrganisationId> => {
  const updateOrganisation: Partial<OrganisationTO> = safeCheckAndCopy(organisation,
    ['entityName', 'contactUser']
  );
  return db.update(OrganisationsTableTO)
    .set(organisation)
    .where(eq(OrganisationsTable.id, updateOrganisation.id!))
    .returning({ id: OrganisationsTable.id })
    .then((result) => {
  
    if (result.length > 1) {
      throw new Error('Returned multiple results from insert');
    }
    console.log(`Updated organisation with id ${result[0].id}`);
    return result[0].id;
  });
};
