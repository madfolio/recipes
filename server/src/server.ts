import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const SERVER_ROOT = path.resolve(__dirname, ".."); // server/
const UPLOADS_DIR = path.join(SERVER_ROOT, "uploads");

app.use("/uploads", express.static(UPLOADS_DIR));

console.log("Serving uploads from:", UPLOADS_DIR);

const DATA_PATH = path.join(SERVER_ROOT, "data", "meal-planner.json");

export type WeekPlan = {
    saturday: string | null;
    sunday: string | null;
    monday: string | null;
    tuesday: string | null;
    wednesday: string | null;
    thursday: string | null;
    friday: string | null;
};

const EMPTY_WEEK: WeekPlan = {
    saturday: null,
    sunday: null,
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null
};

type PlannerData = Record<string, WeekPlan>;

function readData(): PlannerData {
    if (!fs.existsSync(DATA_PATH)) return {};
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return raw ? JSON.parse(raw) : {};
}

function writeData(data: PlannerData) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

app.get("/planner/:week", (req, res) => {
    const { week } = req.params;
    const data = readData();
    res.json(data[week] ?? EMPTY_WEEK);
});

app.post("/planner/:week", (req, res) => {
    const { week } = req.params;
    const weekPlan: WeekPlan = req.body;

    const data = readData();
    data[week] = weekPlan;

    writeData(data);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Planner API running on http://localhost:${PORT}`);
});
