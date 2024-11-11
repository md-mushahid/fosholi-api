import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  BelongsTo,
  belongsTo,
  hasMany,
  HasMany,
} from "@ioc:Adonis/Lucid/Orm";
import Blog from "./Blog";
import User from "./User";

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public blogId: number;

  @column()
  public userId: number;

  @column()
  public parentId: number | null;

  @column()
  public content: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  // Relationships

  @belongsTo(() => Blog)
  public blog: BelongsTo<typeof Blog>;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @belongsTo(() => Comment, {
    foreignKey: "parentId",
  })
  public parent: BelongsTo<typeof Comment>;

  @hasMany(() => Comment, {
    foreignKey: "parentId",
  })
  public replies: HasMany<typeof Comment>;
  
}
