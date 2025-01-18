export { validateId } from '../model/id'

const validateHasNoId = async (body: Record<string, unknown>): Promise<Record<string, unknown>> => {
  if (body['id'] !== undefined) {
    throw new Error('Body contains an ID');
  }
  return body;
};

const validateHasId = async (body: Record<string, unknown>): Promise<Record<string, unknown>> => {
  if (body['id'] === undefined || body['id'] === null) {
    throw new Error('Body contains no ID');
  }
  return body;
};

export const validateIdIfRequired = async (body: Record<string, unknown>, newObject: boolean): Promise<Record<string, unknown>> =>
  newObject ? validateHasNoId(body) : validateHasId(body);
