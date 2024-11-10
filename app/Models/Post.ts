import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class Post extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public title: string

    @column()
    public postImage: string

    @column()
    public additionalImages: string[]

    @column()
    public additionalVideos: string[]

    @column()
    public content: string

    @column()
    public createdBy: number

    @column()
    public programId: number
    
    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
