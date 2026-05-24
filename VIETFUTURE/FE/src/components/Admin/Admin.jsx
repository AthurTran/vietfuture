import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BookOpen,
  HelpCircle,
  Link2,
  Eye,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Database,
  ChevronRight,
  Award,
  Map,
  MessageSquare,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Layers,
  FileText,
  Activity,
} from "lucide-react";
import axiosClient from "../../api/axiosClient";

// ═══════════════════════════════════════════════
//  COMPONENT CHÍNH
// ═══════════════════════════════════════════════
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // ── State cho từng bảng ──
  const [skills, setSkills] = useState([]);
  const [careers, setCareers] = useState([]);
  const [careerSkills, setCareerSkills] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseSkills, setCourseSkills] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skRes, caRes, csRes, coRes, cskRes, asRes, usRes] =
          await Promise.allSettled([
            axiosClient.get("/skills"),
            axiosClient.get("/careerPaths"),
            axiosClient.get("/careerSkills"),
            axiosClient.get("/courses"),
            axiosClient.get("/courseSkills"),
            axiosClient.get("/assessments"),
            axiosClient.get("/users"),
          ]);
        if (skRes.status === "fulfilled") setSkills(skRes.value || []);
        if (caRes.status === "fulfilled") setCareers(caRes.value || []);
        if (csRes.status === "fulfilled") setCareerSkills(csRes.value || []);
        if (coRes.status === "fulfilled") setCourses(coRes.value || []);
        if (cskRes.status === "fulfilled") setCourseSkills(cskRes.value || []);
        if (asRes.status === "fulfilled") setAssessments(asRes.value || []);
        if (usRes.status === "fulfilled") setUsers(usRes.value || []);
      } catch (e) {
        console.error("Lỗi tải dữ liệu", e);
      }
    };
    fetchData();
  }, []);

  // ── State form Skill ──
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [skillForm, setSkillForm] = useState({
    skill_name: "",
    description: "",
    category: "",
  });

  // ── State form CareerPath ──
  const [editingCareerId, setEditingCareerId] = useState(null);
  const [careerForm, setCareerForm] = useState({
    career_name: "",
    description: "",
    salary_range: "",
    demand_level: "",
  });

  // ── State form CareerSkill ──
  const [csForm, setCsForm] = useState({
    career_id: "",
    skill_id: "",
    required_level: "Beginner",
  });

  // ── State form Course ──
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseForm, setCourseForm] = useState({
    course_name: "",
    provider: "",
    description: "",
    level: "Beginner",
    duration_hours: "",
    course_url: "",
  });

  // ── State form CourseSkill ──
  const [cskForm, setCskForm] = useState({ course_id: "", skill_id: "" });
  const [editingCourseSkillId, setEditingCourseSkillId] = useState(null);

  // ── State Assessment ──
  const [editingAssessId, setEditingAssessId] = useState(null);
  const [assessForm, setAssessForm] = useState({
    title: "",
    description: "",
    duration_minutes: 30,
  });
  const [expandedAssess, setExpandedAssess] = useState(null);

  // ── State Question (trong modal Assessment) ──
  const [showQModal, setShowQModal] = useState(false);
  const [targetAssessId, setTargetAssessId] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    content: "",
    question_type: "multiple_choice",
    difficulty_level: "Easy",
    score: 1,
    options: [
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
    ],
  });

  // ═══════════════════════
  //  CRUD: Skill
  // ═══════════════════════
  const saveSkill = async (e) => {
    e.preventDefault();
    try {
      if (editingSkillId) {
        const res = await axiosClient.put(
          `/skills/${editingSkillId}`,
          skillForm,
        );
        setSkills(
          skills.map((s) =>
            s.skill_id === editingSkillId ? { ...s, ...skillForm } : s,
          ),
        );
        setEditingSkillId(null);
      } else {
        const res = await axiosClient.post("/skills", skillForm);
        setSkills([...skills, res]);
      }
      setSkillForm({ skill_name: "", description: "", category: "" });
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu");
    }
  };

  const deleteSkill = async (id) => {
    if (
      !window.confirm(
        "Xóa kỹ năng này sẽ ảnh hưởng đến CareerSkill và CourseSkill liên quan!",
      )
    )
      return;
    try {
      await axiosClient.delete(`/skills/${id}`);
      setSkills(skills.filter((s) => s.skill_id !== id));
      setCareerSkills(careerSkills.filter((cs) => cs.skill_id !== id));
      setCourseSkills(courseSkills.filter((csk) => csk.skill_id !== id));
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa");
    }
  };

  // ═══════════════════════
  //  CRUD: CareerPath
  // ═══════════════════════
  const saveCareer = async (e) => {
    e.preventDefault();
    try {
      if (editingCareerId) {
        await axiosClient.put(`/careerPaths/${editingCareerId}`, careerForm);
        setCareers(
          careers.map((c) =>
            c.career_id === editingCareerId ? { ...c, ...careerForm } : c,
          ),
        );
        setEditingCareerId(null);
      } else {
        const res = await axiosClient.post("/careerPaths", careerForm);
        setCareers([...careers, res]);
      }
      setCareerForm({
        career_name: "",
        description: "",
        salary_range: "",
        demand_level: "",
      });
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu");
    }
  };

  const deleteCareer = async (id) => {
    if (
      !window.confirm(
        "Xóa định hướng nghề nghiệp này? Các CareerSkill liên quan cũng sẽ bị xóa.",
      )
    )
      return;
    try {
      await axiosClient.delete(`/careerPaths/${id}`);
      setCareers(careers.filter((c) => c.career_id !== id));
      setCareerSkills(careerSkills.filter((cs) => cs.career_id !== id));
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa");
    }
  };

  // ═══════════════════════
  //  CRUD: CareerSkill (mapping)
  // ═══════════════════════
  const saveCareerSkill = async (e) => {
    e.preventDefault();
    const cid = Number(csForm.career_id),
      sid = Number(csForm.skill_id);

    if (
      careerSkills.some((cs) => cs.career_id === cid && cs.skill_id === sid)
    ) {
      alert("Kết nối này đã tồn tại!");
      return;
    }

    try {
      const res = await axiosClient.post("/careerSkills", {
        career_id: cid,
        skill_id: sid,
        required_level: csForm.required_level,
      });

      setCareerSkills([...careerSkills, res]);
      setCsForm({ career_id: "", skill_id: "", required_level: "Beginner" });
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu CareerSkill");
    }
  };

  // ═══════════════════════
  //  CRUD: Course
  // ═══════════════════════
  const saveCourse = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...courseForm,
        duration_hours: Number(courseForm.duration_hours),
      };
      if (editingCourseId) {
        const res = await axiosClient.put(
          `/courses/${editingCourseId}`,
          payload,
        );
        setCourses(
          courses.map((c) => (c.course_id === editingCourseId ? res : c)),
        );
        setEditingCourseId(null);
      } else {
        const res = await axiosClient.post("/courses", payload);
        setCourses([...courses, res]);
      }
      setCourseForm({
        course_name: "",
        provider: "",
        description: "",
        level: "Beginner",
        duration_hours: "",
        course_url: "",
      });
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu Course");
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Xóa khóa học? CourseSkill liên quan cũng sẽ bị xóa."))
      return;
    try {
      await axiosClient.delete(`/courses/${id}`);
      setCourses(courses.filter((c) => c.course_id !== id));
      setCourseSkills(courseSkills.filter((csk) => csk.course_id !== id));
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa Course");
    }
  };

  // ═══════════════════════
  //  CRUD: CourseSkill (mapping)
  // ═══════════════════════
  const saveCourseSkill = async (e) => {
    e.preventDefault();
    const cid = Number(cskForm.course_id),
      sid = Number(cskForm.skill_id);
    if (
      courseSkills.some((csk) => csk.course_id === cid && csk.skill_id === sid)
    ) {
      alert("Kết nối này đã tồn tại!");
      return;
    }
    try {
      const res = await axiosClient.post("/courseSkills", {
        course_id: cid,
        skill_id: sid,
      });
      setCourseSkills([...courseSkills, res]);
      setCskForm({ course_id: "", skill_id: "" });
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu CourseSkill");
    }
  };

  const deleteCourseSkill = async (id) => {
    if (!window.confirm("Xóa liên kết CourseSkill này?")) return;
    try {
      await axiosClient.delete(`/courseSkills/${id}`);
      setCourseSkills(courseSkills.filter((csk) => csk.course_skill_id !== id));
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa liên kết CourseSkill");
    }
  };

  // ═══════════════════════
  //  CRUD: Assessment
  // ═══════════════════════
  const saveAssessment = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...assessForm,
        duration_minutes: Number(assessForm.duration_minutes),
        total_questions: 0,
      };
      if (editingAssessId) {
        const res = await axiosClient.put(
          `/assessments/${editingAssessId}`,
          payload,
        );
        setAssessments(
          assessments.map((a) =>
            a.assessment_id === editingAssessId ? { ...a, ...res } : a,
          ),
        );
        setEditingAssessId(null);
      } else {
        const res = await axiosClient.post("/assessments", payload);
        setAssessments([
          ...assessments,
          { ...res, total_questions: 0, questions: [] },
        ]);
      }
      setAssessForm({ title: "", description: "", duration_minutes: 30 });
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu Assessment");
    }
  };

  const deleteAssessment = async (id) => {
    if (!window.confirm("Xóa bài kiểm tra này cùng tất cả câu hỏi?")) return;
    try {
      await axiosClient.delete(`/assessments/${id}`);
      setAssessments(assessments.filter((a) => a.assessment_id !== id));
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa Assessment");
    }
  };

  // ═══════════════════════
  //  CRUD: Question + Options
  // ═══════════════════════
  const openAddQuestion = (assessId) => {
    setTargetAssessId(assessId);
    setQuestionForm({
      content: "",
      question_type: "multiple_choice",
      difficulty_level: "Easy",
      score: 1,
      options: [
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
      ],
    });
    setShowQModal(true);
  };

  const saveQuestion = (e) => {
    e.preventDefault();
    if (!questionForm.options.some((o) => o.is_correct)) {
      alert("Phải chọn ít nhất một đáp án đúng!");
      return;
    }
    setAssessments(
      assessments.map((a) => {
        if (a.assessment_id !== targetAssessId) return a;
        const maxQId =
          Math.max(0, ...a.questions.map((q) => q.question_id)) + 1;
        const maxOptId =
          Math.max(
            0,
            ...a.questions.flatMap((q) => q.options.map((o) => o.option_id)),
            0,
          ) + 1;
        const newQ = {
          ...questionForm,
          question_id: maxQId,
          assessment_id: targetAssessId,
          options: questionForm.options.map((opt, i) => ({
            option_id: maxOptId + i,
            question_id: maxQId,
            ...opt,
          })),
        };
        return {
          ...a,
          questions: [...a.questions, newQ],
          total_questions: a.questions.length + 1,
        };
      }),
    );
    setShowQModal(false);
  };

  const deleteQuestion = (assessId, questionId) => {
    setAssessments(
      assessments.map((a) => {
        if (a.assessment_id !== assessId) return a;
        const updated = a.questions.filter((q) => q.question_id !== questionId);
        return { ...a, questions: updated, total_questions: updated.length };
      }),
    );
  };

  // ═══════════════════════
  //  Helpers
  // ═══════════════════════
  const getSkillName = (id) =>
    skills.find((s) => s.skill_id === id)?.skill_name || `#${id}`;
  const getCareerName = (id) =>
    careers.find((c) => c.career_id === id)?.career_name || `#${id}`;
  const getCourseName = (id) =>
    courses.find((c) => c.course_id === id)?.course_name || `#${id}`;

  const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];
  const DIFF_OPTIONS = ["Easy", "Medium", "Hard"];
  const DEMAND_OPTIONS = ["Thấp", "Trung bình", "Cao", "Rất cao"];

  // ═══════════════════════
  //  Dashboard stats
  // ═══════════════════════
  const stats = [
    {
      label: "Quản lý người dùng",
      value: users.length,
      icon: <Users size={18} />,
      color: "#a78bfa",
      tab: "users",
    },
    {
      label: "Kỹ năng & Nghề nghiệp",
      value: skills.length + careers.length,
      icon: <Award size={18} />,
      color: "#34d399",
      tab: "skills",
    },
    {
      label: "Quản lý khóa học",
      value: courses.length,
      icon: <BookOpen size={18} />,
      color: "#38bdf8",
      tab: "courses",
    },
    {
      label: "Quản lý bài kiểm tra",
      value: assessments.length,
      icon: <HelpCircle size={18} />,
      color: "#d97706",
      tab: "assessments",
    },
    {
      label: "Theo dõi & Báo cáo",
      value: 0,
      icon: <Activity size={18} />,
      color: "#ef4444",
      tab: "reports",
    },
    {
      label: "Roadmap & Gợi ý",
      value: 0,
      icon: <Map size={18} />,
      color: "#10b981",
      tab: "roadmap",
    },
  ];

  // ── NAV ITEMS ──
  const navItems = [
    {
      id: "dashboard",
      icon: <LayoutDashboard size={16} />,
      label: "Dashboard",
    },
    { id: "users", icon: <Users size={16} />, label: "Quản lý người dùng" },
    { id: "skills", icon: <Award size={16} />, label: "Kỹ năng & Nghề" },
    { id: "careers", icon: <Briefcase size={16} />, label: "CareerPath (map)" },
    {
      id: "career_skills",
      icon: <Link2 size={16} />,
      label: "CareerSkill (map)",
    },
    { id: "courses", icon: <BookOpen size={16} />, label: "Khóa học" },
    {
      id: "course_skills",
      icon: <Layers size={16} />,
      label: "CourseSkill (map)",
    },
    {
      id: "assessments",
      icon: <HelpCircle size={16} />,
      label: "Bài kiểm tra",
    },
    {
      id: "reports",
      icon: <Activity size={16} />,
      label: "Theo dõi & Báo cáo",
    },
    { id: "roadmap", icon: <Map size={16} />, label: "Roadmap & Gợi ý" },
  ];

  const tabTitles = {
    dashboard: "Dashboard tổng quan",
    skills: "Quản lý Kỹ năng (Skill)",
    careers: "Quản lý Định hướng Nghề nghiệp (CareerPath)",
    career_skills: "Gán Kỹ năng ↔ Nghề nghiệp (CareerSkill)",
    courses: "Quản lý Khóa học (Course)",
    course_skills: "Gán Khóa học ↔ Kỹ năng (CourseSkill)",
    assessments: "Quản lý Bài kiểm tra & Câu hỏi (Assessment)",
  };

  // ══════════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════════
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#040810",
        color: "#e2e8f0",
        fontFamily: '"IBM Plex Mono", "Fira Code", monospace',
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        style={{
          width: "256px",
          minHeight: "100vh",
          backgroundColor: "#070d1c",
          borderRight: "1px solid #1e293b",
          display: "flex",
          flexDirection: "column",
          padding: "0",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: "#00e5ff22",
                border: "1px solid #00e5ff44",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Database size={18} color="#00e5ff" />
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#f1f5f9",
                  letterSpacing: "-0.3px",
                }}
              >
                V-Future
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#475569",
                  letterSpacing: "0.5px",
                }}
              >
                ADMIN PANEL
              </div>
            </div>
          </div>
        </div>

        {/* Seed data flow indicator */}
        <div
          style={{
            padding: "12px 16px",
            margin: "12px 12px 4px",
            backgroundColor: "#0f172a",
            borderRadius: 8,
            border: "1px solid #1e3a5f",
            fontSize: 10,
            color: "#64748b",
            lineHeight: 1.8,
          }}
        >
          <div
            style={{
              color: "#38bdf8",
              fontWeight: 700,
              marginBottom: 4,
              fontSize: 11,
            }}
          >
            LUỒNG NHẬP DỮ LIỆU
          </div>
          {[
            "Skill",
            "CareerPath",
            "Course",
            "CareerSkill",
            "CourseSkill",
            "Assessment",
          ].map((s, i) => (
            <div
              key={s}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <span style={{ color: "#334155" }}>{i + 1}.</span>
              <span style={{ color: i < 3 ? "#94a3b8" : "#64748b" }}>{s}</span>
              {i < 5 && (
                <ArrowRight
                  size={8}
                  color="#334155"
                  style={{ marginLeft: "auto" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            padding: "8px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 12,
                fontFamily: "inherit",
                fontWeight: activeTab === item.id ? 700 : 400,
                backgroundColor:
                  activeTab === item.id ? "#1e293b" : "transparent",
                color: activeTab === item.id ? "#00e5ff" : "#64748b",
                transition: "all 0.15s",
              }}
            >
              <span style={{ opacity: activeTab === item.id ? 1 : 0.6 }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px", borderTop: "1px solid #1e293b" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "transparent",
              color: "#475569",
              fontSize: 12,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            <LogOut size={14} /> Thoát Admin
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          maxHeight: "100vh",
          padding: "28px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Topbar */}
        <div
          style={{
            borderBottom: "1px solid #1e293b",
            paddingBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "#f1f5f9",
                letterSpacing: "-0.5px",
              }}
            >
              {tabTitles[activeTab]}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#475569" }}>
              {activeTab === "dashboard"
                ? "Tổng quan dữ liệu seed — nền tảng cho AI hoạt động"
                : "Thay đổi tại đây ảnh hưởng trực tiếp đến luồng AI và Roadmap của học viên"}
            </p>
          </div>
          <span
            style={{
              fontSize: 11,
              padding: "5px 12px",
              backgroundColor: "#0f3460",
              color: "#38bdf8",
              borderRadius: 20,
              border: "1px solid #1e4d80",
            }}
          >
            ● Live
          </span>
        </div>

        {/* ─────────── DASHBOARD ─────────── */}
        {activeTab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
              }}
            >
              {stats.map((s) => (
                <button
                  key={s.tab}
                  onClick={() => setActiveTab(s.tab)}
                  style={{
                    background: "#070d1c",
                    border: "1px solid #1e293b",
                    borderRadius: 12,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 0.2s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = s.color)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#1e293b")
                  }
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: s.color + "18",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: s.color,
                    }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: s.color,
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}
                    >
                      {s.label}
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    color="#334155"
                    style={{ marginLeft: "auto" }}
                  />
                </button>
              ))}
            </div>

            {/* Seed data flow diagram */}
            <div
              style={{
                background: "#070d1c",
                border: "1px solid #1e293b",
                borderRadius: 14,
                padding: 20,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#38bdf8",
                  fontWeight: 700,
                  marginBottom: 14,
                  letterSpacing: 1,
                }}
              >
                LUỒNG DỮ LIỆU NỀN (SEED DATA FLOW)
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { label: "Skill", color: "#a78bfa", desc: "Kỹ năng" },
                  { label: "+", color: "#334155", desc: "" },
                  {
                    label: "CareerPath",
                    color: "#34d399",
                    desc: "Nghề nghiệp",
                  },
                  { label: "→", color: "#334155", desc: "" },
                  { label: "CareerSkill", color: "#f472b6", desc: "Mapping" },
                  { label: "→", color: "#334155", desc: "" },
                  { label: "AI Roadmap", color: "#00e5ff", desc: "Tự sinh" },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: item.desc ? 12 : 16,
                        color: item.color,
                        fontWeight: item.desc ? 700 : 400,
                      }}
                    >
                      {item.label}
                    </span>
                    {item.desc && (
                      <span
                        style={{ fontSize: 9, color: "#475569", marginTop: 2 }}
                      >
                        {item.desc}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { label: "Course", color: "#38bdf8", desc: "Khóa học" },
                  { label: "→", color: "#334155", desc: "" },
                  { label: "CourseSkill", color: "#facc15", desc: "Mapping" },
                  { label: "→", color: "#334155", desc: "" },
                  {
                    label: "AI gợi ý",
                    color: "#00e5ff",
                    desc: "RecommendedCourse",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: item.desc ? 12 : 16,
                        color: item.color,
                        fontWeight: item.desc ? 700 : 400,
                      }}
                    >
                      {item.label}
                    </span>
                    {item.desc && (
                      <span
                        style={{ fontSize: 9, color: "#475569", marginTop: 2 }}
                      >
                        {item.desc}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* View-only reminder */}
            <div
              style={{
                background: "#0f1a2e",
                border: "1px dashed #1e3a5f",
                borderRadius: 10,
                padding: "12px 16px",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <Eye
                size={16}
                color="#38bdf8"
                style={{ marginTop: 1, flexShrink: 0 }}
              />
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: "#64748b",
                  lineHeight: 1.7,
                }}
              >
                <strong style={{ color: "#94a3b8" }}>
                  Dữ liệu Admin chỉ xem (không nhập thủ công):{" "}
                </strong>
                <code style={{ color: "#f472b6" }}>User</code> ·{" "}
                <code style={{ color: "#f472b6" }}>Roadmap</code> ·{" "}
                <code style={{ color: "#f472b6" }}>AssessmentAttempt</code> ·{" "}
                <code style={{ color: "#f472b6" }}>SkillReport</code> ·{" "}
                <code style={{ color: "#f472b6" }}>RecommendedCourse</code> ·{" "}
                <code style={{ color: "#f472b6" }}>AIChatHistory</code> — do AI
                và hệ thống tự sinh khi user hoạt động.
              </p>
            </div>
          </div>
        )}

        {/* ─────────── TAB: SKILL ─────────── */}
        {activeTab === "skills" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: 20,
            }}
          >
            <form onSubmit={saveSkill} style={S.formBox}>
              <div style={S.formTitle}>
                {editingSkillId ? "✎ Cập nhật Skill" : "+ Thêm Skill mới"}
              </div>
              <Field label="Tên kỹ năng *">
                <input
                  style={S.input}
                  required
                  value={skillForm.skill_name}
                  onChange={(e) =>
                    setSkillForm({ ...skillForm, skill_name: e.target.value })
                  }
                  placeholder="Ví dụ: React, Docker, Python"
                />
              </Field>
              <Field label="Danh mục (category)">
                <input
                  style={S.input}
                  value={skillForm.category}
                  onChange={(e) =>
                    setSkillForm({ ...skillForm, category: e.target.value })
                  }
                  placeholder="Frontend / Backend / DevOps..."
                />
              </Field>
              <Field label="Mô tả ngắn">
                <textarea
                  style={{ ...S.input, height: 64, resize: "none" }}
                  value={skillForm.description}
                  onChange={(e) =>
                    setSkillForm({ ...skillForm, description: e.target.value })
                  }
                  placeholder="Mô tả kỹ năng..."
                />
              </Field>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" style={S.btnPrimary}>
                  <Save size={13} /> {editingSkillId ? "Cập nhật" : "Lưu"}
                </button>
                {editingSkillId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSkillId(null);
                      setSkillForm({
                        skill_name: "",
                        description: "",
                        category: "",
                      });
                    }}
                    style={S.btnCancel}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </form>

            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr style={S.thead}>
                    <th style={S.th}>ID</th>
                    <th style={S.th}>Tên kỹ năng</th>
                    <th style={S.th}>Category</th>
                    <th style={S.th}>Mô tả</th>
                    <th style={S.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((sk) => (
                    <tr key={sk.skill_id} style={S.tr}>
                      <td
                        style={{ ...S.td, color: "#a78bfa", fontWeight: 700 }}
                      >
                        #{sk.skill_id}
                      </td>
                      <td
                        style={{ ...S.td, fontWeight: 600, color: "#f1f5f9" }}
                      >
                        {sk.skill_name}
                      </td>
                      <td style={S.td}>
                        <Tag color="#7c3aed">{sk.category || "—"}</Tag>
                      </td>
                      <td style={{ ...S.td, color: "#64748b", fontSize: 11 }}>
                        {sk.description || "—"}
                      </td>
                      <td style={S.td}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <ActionBtn
                            onClick={() => {
                              setEditingSkillId(sk.skill_id);
                              setSkillForm({
                                skill_name: sk.skill_name,
                                description: sk.description || "",
                                category: sk.category || "",
                              });
                            }}
                          >
                            <Edit size={12} />
                          </ActionBtn>
                          <ActionBtn
                            danger
                            onClick={() => deleteSkill(sk.skill_id)}
                          >
                            <Trash2 size={12} />
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─────────── TAB: CAREERPATH ─────────── */}
        {activeTab === "careers" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: 20,
            }}
          >
            <form onSubmit={saveCareer} style={S.formBox}>
              <div style={S.formTitle}>
                {editingCareerId
                  ? "✎ Cập nhật CareerPath"
                  : "+ Thêm Career mới"}
              </div>
              <Field label="Tên nghề nghiệp *">
                <input
                  style={S.input}
                  required
                  value={careerForm.career_name}
                  onChange={(e) =>
                    setCareerForm({
                      ...careerForm,
                      career_name: e.target.value,
                    })
                  }
                  placeholder="Ví dụ: Frontend Engineer"
                />
              </Field>
              <Field label="Mô tả">
                <textarea
                  style={{ ...S.input, height: 64, resize: "none" }}
                  value={careerForm.description}
                  onChange={(e) =>
                    setCareerForm({
                      ...careerForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Mô tả công việc..."
                />
              </Field>
              <Field label="Mức lương (salary_range)">
                <input
                  style={S.input}
                  value={careerForm.salary_range}
                  onChange={(e) =>
                    setCareerForm({
                      ...careerForm,
                      salary_range: e.target.value,
                    })
                  }
                  placeholder="Ví dụ: 15 - 35M"
                />
              </Field>
              <Field label="Nhu cầu thị trường (demand_level)">
                <select
                  style={S.input}
                  value={careerForm.demand_level}
                  onChange={(e) =>
                    setCareerForm({
                      ...careerForm,
                      demand_level: e.target.value,
                    })
                  }
                >
                  <option value="">-- Chọn mức --</option>
                  {DEMAND_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" style={S.btnPrimary}>
                  <Save size={13} /> {editingCareerId ? "Cập nhật" : "Lưu"}
                </button>
                {editingCareerId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCareerId(null);
                      setCareerForm({
                        career_name: "",
                        description: "",
                        salary_range: "",
                        demand_level: "",
                      });
                    }}
                    style={S.btnCancel}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </form>

            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr style={S.thead}>
                    <th style={S.th}>ID</th>
                    <th style={S.th}>Tên nghề</th>
                    <th style={S.th}>Lương</th>
                    <th style={S.th}>Nhu cầu</th>
                    <th style={S.th}>Skills đã gán</th>
                    <th style={S.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {careers.map((c) => {
                    const linked = careerSkills.filter(
                      (cs) => cs.career_id === c.career_id,
                    );
                    return (
                      <tr key={c.career_id} style={S.tr}>
                        <td
                          style={{ ...S.td, color: "#34d399", fontWeight: 700 }}
                        >
                          #{c.career_id}
                        </td>
                        <td
                          style={{ ...S.td, fontWeight: 600, color: "#f1f5f9" }}
                        >
                          {c.career_name}
                          <div
                            style={{
                              fontSize: 10,
                              color: "#475569",
                              marginTop: 2,
                            }}
                          >
                            {c.description}
                          </div>
                        </td>
                        <td style={S.td}>
                          <Tag color="#0369a1">{c.salary_range || "—"}</Tag>
                        </td>
                        <td style={S.td}>
                          <Tag
                            color={
                              c.demand_level === "Rất cao"
                                ? "#b45309"
                                : "#374151"
                            }
                          >
                            {c.demand_level || "—"}
                          </Tag>
                        </td>
                        <td style={S.td}>
                          <div
                            style={{
                              display: "flex",
                              gap: 4,
                              flexWrap: "wrap",
                            }}
                          >
                            {linked.length === 0 ? (
                              <span style={{ color: "#475569", fontSize: 11 }}>
                                Chưa gán
                              </span>
                            ) : (
                              linked.map((cs) => (
                                <Tag key={cs.career_skill_id} color="#6d28d9">
                                  {getSkillName(cs.skill_id)}
                                </Tag>
                              ))
                            )}
                          </div>
                        </td>
                        <td style={S.td}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <ActionBtn
                              onClick={() => {
                                setEditingCareerId(c.career_id);
                                setCareerForm({
                                  career_name: c.career_name,
                                  description: c.description || "",
                                  salary_range: c.salary_range || "",
                                  demand_level: c.demand_level || "",
                                });
                              }}
                            >
                              <Edit size={12} />
                            </ActionBtn>
                            <ActionBtn
                              danger
                              onClick={() => deleteCareer(c.career_id)}
                            >
                              <Trash2 size={12} />
                            </ActionBtn>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─────────── TAB: CAREERSKILL MAPPING ─────────── */}
        {activeTab === "career_skills" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: 20,
            }}
          >
            <form onSubmit={saveCareerSkill} style={S.formBox}>
              <div style={S.formTitle}>+ Gán Skill → Career</div>
              <div
                style={{
                  background: "#0f172a",
                  borderRadius: 8,
                  padding: "10px 12px",
                  fontSize: 10,
                  color: "#64748b",
                  lineHeight: 1.7,
                  marginBottom: 4,
                }}
              >
                Bảng này tương đương{" "}
                <code style={{ color: "#f472b6" }}>CareerSkill</code> trong
                schema — xác định kỹ năng nào bắt buộc cho nghề nào với mức độ
                nào.
              </div>
              <Field label="Nghề nghiệp (CareerPath) *">
                <select
                  style={S.input}
                  required
                  value={csForm.career_id}
                  onChange={(e) =>
                    setCsForm({ ...csForm, career_id: e.target.value })
                  }
                >
                  <option value="">-- Chọn Career --</option>
                  {careers.map((c) => (
                    <option key={c.career_id} value={c.career_id}>
                      {c.career_name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Kỹ năng (Skill) *">
                <select
                  style={S.input}
                  required
                  value={csForm.skill_id}
                  onChange={(e) =>
                    setCsForm({ ...csForm, skill_id: e.target.value })
                  }
                >
                  <option value="">-- Chọn Skill --</option>
                  {skills.map((s) => (
                    <option key={s.skill_id} value={s.skill_id}>
                      {s.skill_name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Mức độ yêu cầu (required_level)">
                <select
                  style={S.input}
                  value={csForm.required_level}
                  onChange={(e) =>
                    setCsForm({ ...csForm, required_level: e.target.value })
                  }
                >
                  {LEVEL_OPTIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              <button type="submit" style={S.btnPrimary}>
                <Plus size={13} /> Thêm liên kết
              </button>
            </form>

            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr style={S.thead}>
                    <th style={S.th}>ID</th>
                    <th style={S.th}>CareerPath</th>
                    <th style={S.th}>Skill</th>
                    <th style={S.th}>Required Level</th>
                    <th style={S.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {careerSkills.map((cs) => (
                    <tr key={cs.career_skill_id} style={S.tr}>
                      <td
                        style={{ ...S.td, color: "#f472b6", fontWeight: 700 }}
                      >
                        #{cs.career_skill_id}
                      </td>
                      <td style={{ ...S.td, color: "#34d399" }}>
                        {getCareerName(cs.career_id)}
                      </td>
                      <td style={{ ...S.td, color: "#a78bfa" }}>
                        {getSkillName(cs.skill_id)}
                      </td>
                      <td style={S.td}>
                        <Tag
                          color={
                            cs.required_level === "Advanced"
                              ? "#b45309"
                              : cs.required_level === "Intermediate"
                                ? "#0369a1"
                                : "#374151"
                          }
                        >
                          {cs.required_level}
                        </Tag>
                      </td>
                      <td style={S.td}>
                        <ActionBtn
                          danger
                          onClick={() =>
                            setCareerSkills(
                              careerSkills.filter(
                                (x) => x.career_skill_id !== cs.career_skill_id,
                              ),
                            )
                          }
                        >
                          <Trash2 size={12} />
                        </ActionBtn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─────────── TAB: COURSE ─────────── */}
        {activeTab === "courses" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: 20,
            }}
          >
            <form onSubmit={saveCourse} style={S.formBox}>
              <div style={S.formTitle}>
                {editingCourseId ? "✎ Cập nhật Course" : "+ Thêm Course mới"}
              </div>
              <Field label="Tên khóa học *">
                <input
                  style={S.input}
                  required
                  value={courseForm.course_name}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      course_name: e.target.value,
                    })
                  }
                  placeholder="Tên khóa học..."
                />
              </Field>
              <Field label="Nhà cung cấp (provider)">
                <input
                  style={S.input}
                  value={courseForm.provider}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, provider: e.target.value })
                  }
                  placeholder="Udemy, Coursera, YouTube..."
                />
              </Field>
              <Field label="Mô tả ngắn">
                <textarea
                  style={{ ...S.input, height: 56, resize: "none" }}
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Mô tả nội dung..."
                />
              </Field>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <Field label="Cấp độ (level)">
                  <select
                    style={S.input}
                    value={courseForm.level}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, level: e.target.value })
                    }
                  >
                    {LEVEL_OPTIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Số giờ học">
                  <input
                    style={S.input}
                    type="number"
                    min={1}
                    value={courseForm.duration_hours}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        duration_hours: e.target.value,
                      })
                    }
                    placeholder="0"
                  />
                </Field>
              </div>
              <Field label="URL khóa học (course_url)">
                <input
                  style={S.input}
                  type="url"
                  value={courseForm.course_url}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, course_url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </Field>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" style={S.btnPrimary}>
                  <Save size={13} /> {editingCourseId ? "Cập nhật" : "Lưu"}
                </button>
                {editingCourseId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCourseId(null);
                      setCourseForm({
                        course_name: "",
                        provider: "",
                        description: "",
                        level: "Beginner",
                        duration_hours: "",
                        course_url: "",
                      });
                    }}
                    style={S.btnCancel}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </form>

            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr style={S.thead}>
                    <th style={S.th}>ID</th>
                    <th style={S.th}>Tên khóa học</th>
                    <th style={S.th}>Provider</th>
                    <th style={S.th}>Level</th>
                    <th style={S.th}>Giờ</th>
                    <th style={S.th}>Skills</th>
                    <th style={S.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => {
                    const linked = courseSkills.filter(
                      (csk) => csk.course_id === c.course_id,
                    );
                    return (
                      <tr key={c.course_id} style={S.tr}>
                        <td
                          style={{ ...S.td, color: "#38bdf8", fontWeight: 700 }}
                        >
                          #{c.course_id}
                        </td>
                        <td
                          style={{ ...S.td, fontWeight: 600, color: "#f1f5f9" }}
                        >
                          {c.course_name}
                          <div
                            style={{
                              fontSize: 10,
                              color: "#475569",
                              marginTop: 2,
                            }}
                          >
                            {c.description}
                          </div>
                        </td>
                        <td style={S.td}>
                          <Tag color="#0e7490">{c.provider || "—"}</Tag>
                        </td>
                        <td style={S.td}>
                          <Tag color="#0369a1">{c.level}</Tag>
                        </td>
                        <td style={{ ...S.td, color: "#64748b" }}>
                          {c.duration_hours}h
                        </td>
                        <td style={S.td}>
                          <div
                            style={{
                              display: "flex",
                              gap: 4,
                              flexWrap: "wrap",
                            }}
                          >
                            {linked.length === 0 ? (
                              <span style={{ color: "#475569", fontSize: 11 }}>
                                Chưa gán
                              </span>
                            ) : (
                              linked.map((csk) => (
                                <Tag key={csk.course_skill_id} color="#854d0e">
                                  {getSkillName(csk.skill_id)}
                                </Tag>
                              ))
                            )}
                          </div>
                        </td>
                        <td style={S.td}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <ActionBtn
                              onClick={() => {
                                setEditingCourseId(c.course_id);
                                setCourseForm({
                                  course_name: c.course_name,
                                  provider: c.provider || "",
                                  description: c.description || "",
                                  level: c.level || "Beginner",
                                  duration_hours: c.duration_hours || "",
                                  course_url: c.course_url || "",
                                });
                              }}
                            >
                              <Edit size={12} />
                            </ActionBtn>
                            <ActionBtn
                              danger
                              onClick={() => deleteCourse(c.course_id)}
                            >
                              <Trash2 size={12} />
                            </ActionBtn>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─────────── TAB: COURSESKILL MAPPING ─────────── */}
        {activeTab === "course_skills" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: 20,
            }}
          >
            <form onSubmit={saveCourseSkill} style={S.formBox}>
              <div style={S.formTitle}>+ Gán Skill → Course</div>
              <div
                style={{
                  background: "#0f172a",
                  borderRadius: 8,
                  padding: "10px 12px",
                  fontSize: 10,
                  color: "#64748b",
                  lineHeight: 1.7,
                  marginBottom: 4,
                }}
              >
                Bảng <code style={{ color: "#f472b6" }}>CourseSkill</code> — xác
                định khóa học này dạy những kỹ năng nào. AI dùng để gợi ý khóa
                học khi user thiếu skill.
              </div>
              <Field label="Khóa học (Course) *">
                <select
                  style={S.input}
                  required
                  value={cskForm.course_id}
                  onChange={(e) =>
                    setCskForm({ ...cskForm, course_id: e.target.value })
                  }
                >
                  <option value="">-- Chọn Course --</option>
                  {courses.map((c) => (
                    <option key={c.course_id} value={c.course_id}>
                      {c.course_name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Kỹ năng (Skill) *">
                <select
                  style={S.input}
                  required
                  value={cskForm.skill_id}
                  onChange={(e) =>
                    setCskForm({ ...cskForm, skill_id: e.target.value })
                  }
                >
                  <option value="">-- Chọn Skill --</option>
                  {skills.map((s) => (
                    <option key={s.skill_id} value={s.skill_id}>
                      {s.skill_name}
                    </option>
                  ))}
                </select>
              </Field>
              <button type="submit" style={S.btnPrimary}>
                <Plus size={13} /> Thêm liên kết
              </button>
            </form>

            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr style={S.thead}>
                    <th style={S.th}>ID</th>
                    <th style={S.th}>Course</th>
                    <th style={S.th}>Skill</th>
                    <th style={S.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {courseSkills.map((csk) => (
                    <tr key={csk.course_skill_id} style={S.tr}>
                      <td
                        style={{ ...S.td, color: "#facc15", fontWeight: 700 }}
                      >
                        #{csk.course_skill_id}
                      </td>
                      <td style={{ ...S.td, color: "#38bdf8" }}>
                        {getCourseName(csk.course_id)}
                      </td>
                      <td style={{ ...S.td, color: "#a78bfa" }}>
                        {getSkillName(csk.skill_id)}
                      </td>
                      <td style={S.td}>
                        <ActionBtn
                          danger
                          onClick={() => deleteCourseSkill(csk.course_skill_id)}
                        >
                          <Trash2 size={12} />
                        </ActionBtn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─────────── TAB: ASSESSMENT & QUESTIONS ─────────── */}
        {activeTab === "assessments" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Form tạo Assessment */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "300px 1fr",
                gap: 20,
              }}
            >
              <form onSubmit={saveAssessment} style={S.formBox}>
                <div style={S.formTitle}>
                  {editingAssessId
                    ? "✎ Cập nhật Assessment"
                    : "+ Tạo bài kiểm tra mới"}
                </div>
                <Field label="Tiêu đề bài test *">
                  <input
                    style={S.input}
                    required
                    value={assessForm.title}
                    onChange={(e) =>
                      setAssessForm({ ...assessForm, title: e.target.value })
                    }
                    placeholder="Tên bài kiểm tra..."
                  />
                </Field>
                <Field label="Mô tả">
                  <textarea
                    style={{ ...S.input, height: 56, resize: "none" }}
                    value={assessForm.description}
                    onChange={(e) =>
                      setAssessForm({
                        ...assessForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Mô tả bài test..."
                  />
                </Field>
                <Field label="Thời gian (phút)">
                  <input
                    style={S.input}
                    type="number"
                    min={1}
                    value={assessForm.duration_minutes}
                    onChange={(e) =>
                      setAssessForm({
                        ...assessForm,
                        duration_minutes: e.target.value,
                      })
                    }
                  />
                </Field>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="submit" style={S.btnPrimary}>
                    <Save size={13} />{" "}
                    {editingAssessId ? "Cập nhật" : "Tạo bài test"}
                  </button>
                  {editingAssessId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAssessId(null);
                        setAssessForm({
                          title: "",
                          description: "",
                          duration_minutes: 30,
                        });
                      }}
                      style={S.btnCancel}
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </form>

              {/* Danh sách Assessment */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {assessments.map((a) => (
                  <div
                    key={a.assessment_id}
                    style={{
                      background: "#070d1c",
                      border: "1px solid #1e293b",
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setExpandedAssess(
                          expandedAssess === a.assessment_id
                            ? null
                            : a.assessment_id,
                        )
                      }
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "#f1f5f9",
                            fontSize: 13,
                          }}
                        >
                          {a.title}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#475569",
                            marginTop: 2,
                          }}
                        >
                          {a.description} · {a.duration_minutes} phút ·{" "}
                          {a.total_questions} câu hỏi
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddQuestion(a.assessment_id);
                          }}
                          style={{
                            ...S.btnPrimary,
                            padding: "5px 10px",
                            fontSize: 11,
                          }}
                        >
                          <Plus size={11} /> Thêm câu hỏi
                        </button>
                        <ActionBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAssessId(a.assessment_id);
                            setAssessForm({
                              title: a.title,
                              description: a.description || "",
                              duration_minutes: a.duration_minutes,
                            });
                          }}
                        >
                          <Edit size={12} />
                        </ActionBtn>
                        <ActionBtn
                          danger
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAssessment(a.assessment_id);
                          }}
                        >
                          <Trash2 size={12} />
                        </ActionBtn>
                        <ChevronRight
                          size={14}
                          color="#334155"
                          style={{
                            transform:
                              expandedAssess === a.assessment_id
                                ? "rotate(90deg)"
                                : "none",
                            transition: "transform 0.2s",
                          }}
                        />
                      </div>
                    </div>

                    {/* Questions list */}
                    {expandedAssess === a.assessment_id && (
                      <div
                        style={{
                          borderTop: "1px solid #1e293b",
                          padding: "12px 16px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        {a.questions.length === 0 && (
                          <p
                            style={{
                              color: "#475569",
                              fontSize: 11,
                              margin: 0,
                            }}
                          >
                            Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu.
                          </p>
                        )}
                        {a.questions.map((q, qi) => (
                          <div
                            key={q.question_id}
                            style={{
                              background: "#0a1322",
                              borderRadius: 8,
                              padding: "10px 14px",
                              border: "1px solid #1e293b",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: "#e2e8f0",
                                    fontWeight: 600,
                                  }}
                                >
                                  <span
                                    style={{ color: "#475569", marginRight: 6 }}
                                  >
                                    Q{qi + 1}.
                                  </span>
                                  {q.content}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 8,
                                    marginTop: 8,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {q.options.map((opt, oi) => (
                                    <span
                                      key={opt.option_id}
                                      style={{
                                        fontSize: 10,
                                        padding: "2px 8px",
                                        borderRadius: 4,
                                        backgroundColor: opt.is_correct
                                          ? "#14532d"
                                          : "#0f172a",
                                        color: opt.is_correct
                                          ? "#4ade80"
                                          : "#64748b",
                                        border: `1px solid ${opt.is_correct ? "#166534" : "#1e293b"}`,
                                      }}
                                    >
                                      {String.fromCharCode(65 + oi)}.{" "}
                                      {opt.option_text} {opt.is_correct && "✓"}
                                    </span>
                                  ))}
                                </div>
                                <div
                                  style={{
                                    marginTop: 6,
                                    display: "flex",
                                    gap: 6,
                                  }}
                                >
                                  <Tag color="#374151">
                                    {q.difficulty_level}
                                  </Tag>
                                  <Tag color="#374151">{q.question_type}</Tag>
                                  <Tag color="#374151">{q.score} điểm</Tag>
                                </div>
                              </div>
                              <ActionBtn
                                danger
                                onClick={() =>
                                  deleteQuestion(a.assessment_id, q.question_id)
                                }
                              >
                                <Trash2 size={11} />
                              </ActionBtn>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─────────── TAB: USERS ─────────── */}
        {activeTab === "users" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr style={S.thead}>
                    <th style={S.th}>ID</th>
                    <th style={S.th}>Họ Tên</th>
                    <th style={S.th}>Email</th>
                    <th style={S.th}>Role</th>
                    <th style={S.th}>Trạng thái</th>
                    <th style={S.th}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.user_id} style={S.tr}>
                      <td
                        style={{ ...S.td, color: "#a78bfa", fontWeight: 700 }}
                      >
                        #{u.user_id}
                      </td>
                      <td
                        style={{ ...S.td, fontWeight: 600, color: "#f1f5f9" }}
                      >
                        {u.full_name}
                      </td>
                      <td style={S.td}>{u.email}</td>
                      <td style={S.td}>
                        <Tag color={u.role === "admin" ? "#f43f5e" : "#34d399"}>
                          {u.role}
                        </Tag>
                      </td>
                      <td style={S.td}>
                        <Tag
                          color={u.status === "active" ? "#10b981" : "#64748b"}
                        >
                          {u.status}
                        </Tag>
                      </td>
                      <td style={S.td}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <ActionBtn>
                            <Edit size={12} />
                          </ActionBtn>
                          <ActionBtn danger>
                            <Trash2 size={12} />
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ ...S.td, textAlign: "center" }}>
                        Chưa có người dùng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─────────── TAB: REPORTS ─────────── */}
        {activeTab === "reports" && (
          <div style={{ padding: 20, textAlign: "center", color: "#64748b" }}>
            <Activity
              size={48}
              style={{ margin: "0 auto 16px", opacity: 0.5 }}
            />
            <h3>Theo dõi & Báo cáo</h3>
            <p>
              Tính năng đang được phát triển. Dữ liệu báo cáo sẽ được AI tổng
              hợp tại đây.
            </p>
          </div>
        )}

        {/* ─────────── TAB: ROADMAP ─────────── */}
        {activeTab === "roadmap" && (
          <div style={{ padding: 20, textAlign: "center", color: "#64748b" }}>
            <Map size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
            <h3>Roadmap & Gợi ý</h3>
            <p>
              Tính năng đang được phát triển. Dữ liệu Roadmap của user sẽ hiển
              thị tại đây.
            </p>
          </div>
        )}
      </main>

      {/* ── MODAL THÊM CÂU HỎI ── */}
      {showQModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#070d1c",
              border: "1px solid #1e293b",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 560,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>
                + Thêm câu hỏi mới (Question)
              </div>
              <button
                onClick={() => setShowQModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={saveQuestion}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <Field label="Nội dung câu hỏi *">
                <textarea
                  style={{ ...S.input, height: 72, resize: "none" }}
                  required
                  value={questionForm.content}
                  onChange={(e) =>
                    setQuestionForm({
                      ...questionForm,
                      content: e.target.value,
                    })
                  }
                  placeholder="Nhập nội dung câu hỏi..."
                />
              </Field>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                }}
              >
                <Field label="Loại câu hỏi">
                  <select
                    style={S.input}
                    value={questionForm.question_type}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        question_type: e.target.value,
                      })
                    }
                  >
                    <option value="multiple_choice">Multiple choice</option>
                    <option value="true_false">True / False</option>
                    <option value="essay">Essay</option>
                  </select>
                </Field>
                <Field label="Độ khó">
                  <select
                    style={S.input}
                    value={questionForm.difficulty_level}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        difficulty_level: e.target.value,
                      })
                    }
                  >
                    {DIFF_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Điểm (score)">
                  <input
                    style={S.input}
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={questionForm.score}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        score: Number(e.target.value),
                      })
                    }
                  />
                </Field>
              </div>

              {/* Options */}
              <div>
                <div
                  style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}
                >
                  Các đáp án — tích vào đáp án đúng (QuestionOption)
                </div>
                {questionForm.options.map((opt, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={opt.is_correct}
                      onChange={(e) => {
                        const updated = questionForm.options.map((o, j) =>
                          j === i ? { ...o, is_correct: e.target.checked } : o,
                        );
                        setQuestionForm({ ...questionForm, options: updated });
                      }}
                      style={{
                        accentColor: "#00e5ff",
                        width: 16,
                        height: 16,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: opt.is_correct ? "#4ade80" : "#475569",
                        fontSize: 12,
                        width: 20,
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + i)}.
                    </span>
                    <input
                      style={{ ...S.input, flex: 1 }}
                      required
                      value={opt.option_text}
                      onChange={(e) => {
                        const updated = questionForm.options.map((o, j) =>
                          j === i ? { ...o, option_text: e.target.value } : o,
                        );
                        setQuestionForm({ ...questionForm, options: updated });
                      }}
                      placeholder={`Đáp án ${String.fromCharCode(65 + i)}...`}
                    />
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  paddingTop: 8,
                  borderTop: "1px solid #1e293b",
                }}
              >
                <button type="submit" style={S.btnPrimary}>
                  <CheckCircle size={13} /> Lưu câu hỏi
                </button>
                <button
                  type="button"
                  onClick={() => setShowQModal(false)}
                  style={S.btnCancel}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════
//  MINI COMPONENTS
// ══════════════════════════════════════
function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontSize: 10,
          color: "#64748b",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Tag({ children, color }) {
  return (
    <span
      style={{
        fontSize: 10,
        padding: "2px 7px",
        borderRadius: 4,
        backgroundColor: color + "22",
        color: color,
        border: `1px solid ${color}44`,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function ActionBtn({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: 6,
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 6,
        color: danger ? "#f43f5e" : "#94a3b8",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

// ══════════════════════════════════════
//  SHARED STYLES
// ══════════════════════════════════════
const S = {
  formBox: {
    background: "#070d1c",
    border: "1px solid #1e293b",
    borderRadius: 14,
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    height: "fit-content",
  },
  formTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#00e5ff",
    marginBottom: 4,
    paddingBottom: 10,
    borderBottom: "1px solid #1e293b",
  },
  input: {
    background: "#040810",
    border: "1px solid #1e293b",
    borderRadius: 7,
    padding: "8px 10px",
    color: "#e2e8f0",
    fontSize: 12,
    fontFamily: '"IBM Plex Mono", monospace',
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  tableWrap: {
    background: "#070d1c",
    border: "1px solid #1e293b",
    borderRadius: 14,
    padding: 16,
    overflowX: "auto",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
  thead: { borderBottom: "1px solid #1e293b" },
  th: {
    padding: "8px 12px",
    color: "#475569",
    fontWeight: 600,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    textAlign: "left",
  },
  tr: { borderBottom: "1px solid #0f172a" },
  td: { padding: "10px 12px", verticalAlign: "middle", color: "#94a3b8" },
  btnPrimary: {
    flex: 1,
    padding: "8px 14px",
    background: "#00e5ff",
    color: "#000",
    border: "none",
    borderRadius: 7,
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    fontFamily: "inherit",
  },
  btnCancel: {
    padding: "8px 12px",
    background: "#0f172a",
    color: "#64748b",
    border: "1px solid #1e293b",
    borderRadius: 7,
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
