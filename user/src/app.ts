import { config } from "dotenv"
config()
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

const userRepository = myDataSource.getRepository(User)

// create and setup express app
const app = express()
app.use(express.json())

// register routes

app.get("/users", async function (req: Request, res: Response) {
  const results = await userRepository.find()
  res.json(results)
})

app.get("/users/:id", async function (req: Request, res: Response) {
  const results = await userRepository.findOneBy({
    // @ts-ignore
    id: req.params.id,
  })
  return res.send(results)
})

app.post("/users", async function (req: Request, res: Response) {
  const user = userRepository.create(req.body)
  const results = userRepository.save(user)
  return res.send(results)
})

app.put("/users/:id", async function (req: Request, res: Response) {
  const userToUpdate = await userRepository.findOneBy({
    // @ts-ignore
    id: req.params.id,
  })
  userRepository.merge(userToUpdate, req.body)
  const results = userRepository.save(userToUpdate)
  return res.send(results)
})

app.delete("/users/:id", async function (req: Request, res: Response) {
  const results = await userRepository.delete(req.params.id)
  return res.send(results)
})

// start express server
app.listen(3000, () => console.log("Server running"))