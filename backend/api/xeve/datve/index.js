import express from "express";
import { postDatVe } from "./postDatVe.js";
import { getCountByXeVe } from "./getCountByXeVe.js";

const router = express.Router();

router.post("/", postDatVe);
router.get("/count", getCountByXeVe);

export default router;
