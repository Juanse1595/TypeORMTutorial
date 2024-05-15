import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "mysql",
    host: process.env.HOST,
    port: Number(process.env.PORT),
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DB,
    entities: ["src/entity/*.js"],
    logging: true,
    synchronize: true,
})