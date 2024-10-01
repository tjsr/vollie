import { integer } from "drizzle-orm/sqlite-core";

export type IdType = number;
export const idPrimaryKey = <I = IdType>() => integer('id').$type<I>().primaryKey();
