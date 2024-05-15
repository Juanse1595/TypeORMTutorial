import * as express from "express"
import { Request, Response } from "express"
import { myDataSource } from "./app-data-source"
import { User } from "./entity/user.entity"

// Connect with data source
myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initializacion:", err)
  })


// create and setup express app
const app = express()
app.use(express.json())

// register routes

app.get("/users", async function (req: Request, res: Response) {
  const results = await myDataSource.getRepository(User).find()
  res.json(results)
})

app.get("/users/:id", async function (req: Request, res: Response) {
  const results = await myDataSource.getRepository(User).findOneBy({
    // @ts-ignore
    id: req.params.id,
  })
  return res.send(results)
})

app.post("/users", async function (req: Request, res: Response) {
  const user = myDataSource.getRepository(User).create(req.body)
  const results = myDataSource.getRepository(User).save(user)
  return res.send(results)
})

app.put("/users/:id", async function (req: Request, res: Response) {
  const userToUpdate = await myDataSource.getRepository(User).findOneBy({
    // @ts-ignore
    id: req.params.id,
  })
  myDataSource.getRepository(User).merge(userToUpdate, req.body)
  const results = myDataSource.getRepository(User).save(userToUpdate)
  return res.send(results)
})

app.delete("/users/:id", async function (req: Request, res: Response) {
  const results = await myDataSource.getRepository(User).delete(req.params.id)
  return res.send(results)
})

// start express server
app.listen(3000, () => console.log("Server running"))