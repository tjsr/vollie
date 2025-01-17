import { Existing, TransferObject, Uninitialised } from "../../../model/to";

import { IdType } from "../../../model/id";
import { VollieDBConnection } from "../../types";

export type CreateFunction<
  TO,
  NewTO extends Uninitialised<TO> = Uninitialised<TO>,
  ExistingTO extends Existing<TO> = Existing<TO>
> = (db: VollieDBConnection, to: NewTO) => Promise<ExistingTO>;
export type UpdateFunction<TO extends TransferObject<unknown>, ID extends IdType> = (db: VollieDBConnection, to: TO) => Promise<ID>;
