import express from "express";

import {
    getAllAIChatHistories,
    getAIChatHistoryById,
    createAIChatHistory,
    updateAIChatHistory,
    deleteAIChatHistory
} from "../controllers/aichathistory.controller";

const router = express.Router();

router.get("/", getAllAIChatHistories);
router.get("/:id", getAIChatHistoryById);
router.post("/", createAIChatHistory);
router.put("/:id", updateAIChatHistory);
router.delete("/:id", deleteAIChatHistory);

export default router;
