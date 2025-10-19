import express from "express";
import { getAllSan } from "./getAllSan.js";
import { postDatSan } from "./postDatSan.js";

const router = express.Router();

// API: GET /api/san
router.get("/", getAllSan);
router.post("/book", postDatSan);

export default router;
