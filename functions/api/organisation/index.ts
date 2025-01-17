import { ApiModelContext, generateOnRequest } from '../generic';
import { createOrganisation, selectOrganisationById, updateOrganisation } from '../../../src/orm/drizzle/queries/organistion';

import { Env } from '../../../src/types';
import { OrganisationId } from '../../../src/model/id';
import { OrganisationTO } from '../../../src/model/to';
import { validateOrganisationBody } from "../../../src/validators/organisation";

type OrganisationIdKey = 'eventId';

const api: ApiModelContext<OrganisationTO, OrganisationId> = {
  entrypoint: '/organisation',
  idParam: 'organisationId',
  validateBody: validateOrganisationBody,
  create: createOrganisation,
  select: selectOrganisationById,
  update: updateOrganisation,
};

export const onRequest: PagesFunction<Env> = generateOnRequest<OrganisationId, OrganisationTO, OrganisationIdKey>(api);

export default onRequest;
