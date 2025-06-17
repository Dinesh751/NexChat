import express,{Request, Response} from 'express';

const app = express(); 
app.use(express.json());


const PORT = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

