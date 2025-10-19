import express from "express";
import { getAllKhachHang } from "./getAllKhachHang.js";
import { searchKhachHang } from "./getSearch.js";
import { postKhachHang } from "./postKhachHang.js";

const router = express.Router();

router.get("/", getAllKhachHang);
router.get("/search", searchKhachHang);
router.post("/", postKhachHang);

export default router;
