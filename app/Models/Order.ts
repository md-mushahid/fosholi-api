import { DateTime } from 'luxon';
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class Order extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column()
    public user_id: string;

    @column()
    public product_id: string | null;

}
