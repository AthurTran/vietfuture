import express from "express";
import cors from "cors";
import "dotenv/config";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import roadmapRoutes from "./routes/roadmap.routes";
import skillRoutes from "./routes/skill.routes";
import careerPathRoutes from "./routes/careerPath.routes";
import careerSkillRoutes from "./routes/careerSkill.routes";
import roadmapCourseRoutes from "./routes/roadmapCourse.routes";
import courseSkillRoutes from "./routes/courseSkill.routes";
import aichathistoryRoutes from "./routes/aichathistory.routes";
import aiRoutes from "./routes/ai.routes";
import assessmentRoutes from "./routes/assessment.routes";

const app = express();

// Middleware
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/careers", careerPathRoutes);
app.use("/api/career-skills", careerSkillRoutes);
app.use("/api/roadmap-courses", roadmapCourseRoutes);
app.use("/api/course-skills", courseSkillRoutes);
app.use("/api/ai-chat-history", aichathistoryRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/assessments", assessmentRoutes);

// Health check
app.get("/", (req, res) => {
    return res.json({
        message: "VietFuture API running"
    });
});

// 404
app.use((req, res) => {
    return res.status(404).json({
        message: "Route not found"
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});

export default app;