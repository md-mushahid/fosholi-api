import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public profilePicture: string | null

  @column()
  public verificationToken: string | null

  @column()
  public isVerified: boolean

  @column()
  public password: string

  @column()
  public userType: 'admin' | 'user' | 'teacher'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
