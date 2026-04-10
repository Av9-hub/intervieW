import express from 'express'
import { protectRoute } from '../middlewares/protectRoute.js';
import { createSessions,getActiveSessions,getMyRecentSessions,getSessionById,joinSession,endSession } from '../controllers/sessionController.js';
const router=express.Router();

router.post("/",protectRoute,createSessions);
router.get("/active",protectRoute,getActiveSessions);
router.get("/recentSessions",protectRoute,getMyRecentSessions)
router.get("/:id",protectRoute,getSessionById);
router.post("/:id/join",protectRoute,joinSession);
router.post("/:id/end",protectRoute,endSession);

export default router;