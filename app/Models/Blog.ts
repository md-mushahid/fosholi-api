import { DateTime } from 'luxon';
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class Blog extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column()
    public title: string;

    @column()
    public blogImage: string | null;

    @column()
    public content: string;

    @column()
    public userId: number;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;
}
