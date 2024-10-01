import { Organisation, OrganisationsTable } from "../schema/organisations";

import { IdType } from "../schema/types";
import { UsersTable } from "../schema/users";
import { VollieDatabaseError } from "../../errors";
import { VollieDrizzleConnection } from "../../types";
import { eq } from "drizzle-orm";

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