import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Program extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public title: string

    @column()
    public description: string

    @column()
    public subscriptionType: 'monthly' | 'one-time'

    @column()
    public monthlyPrice: number | null

    @column()
    public oneTimePrice: number | null

    @column()
    public durationInMonths: number | null

    @column()
    public isLifetimeAccess: boolean

    @column()
    public instructorId: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
