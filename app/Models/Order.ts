import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public orderId: string;

  @column()
  public customerName: string;

  @column()
  public email: string | null;

  @column()
  public phoneNo: string | null;

  @column()
  public amount: number;

  @column()
  public currency: string;

  @column()
  public receivedAmount: number;

  @column()
  public bankStatus: string;

  @column()
  public invoiceNo: string;

  @column()
  public bankTrxId: string | null;

  @column()
  public status: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
