import { postRouter } from './router/postRouter';
import { userRouter } from './router/userRouter';
import  express, { Request, Response} from 'express'
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config()

const app = express();

app.use(express.json());

app.use(cors());

app.listen(Number(process.env.PORT), () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
});

app.use("/users", userRouter)
app.use("/posts", postRouter)

