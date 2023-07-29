import express, { Express } from 'express';
import cors from "cors"; 
import * as scheduler from "./scheduler"; 

const app: Express = express();
const port = 4000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
    res.json({
        message: "HackerNews -> Discord notifier",
    });
});

scheduler.initScheduledJobs();

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running on port 4000`);
});