"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dataset, Question, QuizCMSConfig, Division, GitHubSyncSettings } from "../types/cms";
import { cmsStorage } from "../services/cmsStorage";
import { soundManager } from "../utils/soundEffects";
import {
  X,
  Plus,
  Trash2,
  Edit3,
  Check,
  Shuffle,
  Sliders,
  Database,
  Layers,
  HelpCircle,
  Upload,
  Download,
  Sparkles,
  CheckSquare,
  Square,
  Search,
  CheckCircle2,
  FolderDown,
  Info,
  GitBranch,
  RefreshCw,
  Table,
  Eye,
} from "lucide-react";

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange?: () => void;
}

export default function AdminCMSModal({ isOpen, onClose, onConfigChange }: AdminCMSModalProps) {
  const [activeTab, setActiveTab] = useState<"rows" | "divisions" | "randomizer" | "datasets" | "github">("rows");
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [activeDataset, setActiveDataset] = useState<Dataset | null>(null);
  const [config, setConfig] = useState<QuizCMSConfig>({
    activeDatasetId: "default_quiz_dataset",
    selectedDivisions: ["All"],
    selectedQuestionIds: ["*"],
    questionLimit: 0,
    enableQuestionRandomizer: true,
    enableOptionShuffle: true,
    enableRandomSampling: false,
    sampleCount: 10,
    githubSync: {
      token: "",
      owner: "",
      repo: "Flashcard_Quiz_App",
      branch: "main",
    },
  });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDivision, setFilterDivision] = useState("All");

  // GitHub Credentials State
  const [ghForm, setGhForm] = useState<GitHubSyncSettings>({
    token: "",
    owner: "",
    repo: "Flashcard_Quiz_App",
    branch: "main",
  });
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);

  // Question Edit Modal State
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question>>({
    level: "Round 1 — General Trivia",
    category: "General Trivia",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    points: 10,
  });

  // Status Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [authError, setAuthError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    const validUser = process.env.NEXT_PUBLIC_ADMIN_USER || "admin";
    const validPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "admin123";

    if (adminUser === validUser && adminPass === validPass) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid credentials");
    }
  };

  const loadData = useCallback(async () => {
    try {
      await cmsStorage.initDB();
      const loadedDatasets = await cmsStorage.getDatasets();
      setDatasets(loadedDatasets);

      const loadedConfig = await cmsStorage.getQuizConfig();
      setConfig(loadedConfig);
      if (loadedConfig.githubSync) {
        setGhForm(loadedConfig.githubSync);
      }

      const active = await cmsStorage.getActiveDataset();
      setActiveDataset(active);
    } catch (e) {
      console.error("Failed to load CMS data:", e);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadData();
    } else {
      setIsAuthenticated(false);
      setAdminPass("");
      setAuthError("");
    }
  }, [isOpen, loadData]);

  if (!isOpen) return null;

  // Handle Dataset Change
  const handleSelectDataset = async (datasetId: string) => {
    soundManager.playClick();
    const newConfig = { ...config, activeDatasetId: datasetId, selectedDivisions: ["All"], selectedQuestionIds: ["*"] };
    setConfig(newConfig);
    await cmsStorage.saveQuizConfig(newConfig);

    const datasetsList = await cmsStorage.getDatasets();
    const target = datasetsList.find((d) => d.id === datasetId) || null;
    setActiveDataset(target);
    showToast(`Active dataset set to "${target?.name || datasetId}"`);
    if (onConfigChange) onConfigChange();
  };

  // Division Multi-Select Toggle
  const handleToggleDivision = async (divisionId: string) => {
    soundManager.playClick();
    let updatedDivisions: string[] = [];

    if (divisionId === "All") {
      updatedDivisions = ["All"];
    } else {
      const currentWithoutAll = config.selectedDivisions.filter((d) => d !== "All");
      if (currentWithoutAll.includes(divisionId)) {
        updatedDivisions = currentWithoutAll.filter((d) => d !== divisionId);
        if (updatedDivisions.length === 0) updatedDivisions = ["All"];
      } else {
        updatedDivisions = [...currentWithoutAll, divisionId];
      }
    }

    const newConfig = { ...config, selectedDivisions: updatedDivisions };
    setConfig(newConfig);
    await cmsStorage.saveQuizConfig(newConfig);
    if (onConfigChange) onConfigChange();
  };

  // Individual Question Checkbox Selection
  const handleToggleQuestionCheckbox = async (qId: number | string) => {
    soundManager.playClick();
    let currentSelected = [...(config.selectedQuestionIds || ["*"])];

    if (currentSelected.includes("*")) {
      currentSelected = (activeDataset?.questions || []).map(q => q.id);
    }

    if (currentSelected.includes(qId)) {
      currentSelected = currentSelected.filter((id) => id !== qId);
    } else {
      currentSelected.push(qId);
    }

    if (activeDataset && currentSelected.length === activeDataset.questions.length) {
      currentSelected = ["*"];
    }

    const newConfig = { ...config, selectedQuestionIds: currentSelected };
    setConfig(newConfig);
    await cmsStorage.saveQuizConfig(newConfig);
    if (onConfigChange) onConfigChange();
  };

  // Select / Deselect All Questions in filtered rows
  const handleSelectAllFilteredQuestions = async (select: boolean) => {
    soundManager.playClick();
    const filtered = (activeDataset?.questions || []).filter((q) => {
      const matchesSearch =
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.options.some((o) => o.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDiv = filterDivision === "All" || q.category === filterDivision || q.level === filterDivision;
      return matchesSearch && matchesDiv;
    });

    let currentSelected = [...(config.selectedQuestionIds || ["*"])];
    if (currentSelected.includes("*")) {
      currentSelected = (activeDataset?.questions || []).map(q => q.id);
    }

    const filteredIds = filtered.map((q) => q.id);

    if (select) {
      currentSelected = Array.from(new Set([...currentSelected, ...filteredIds]));
    } else {
      currentSelected = currentSelected.filter((id) => !filteredIds.includes(id));
    }

    if (activeDataset && currentSelected.length === activeDataset.questions.length) {
      currentSelected = ["*"];
    }

    const newConfig = { ...config, selectedQuestionIds: currentSelected };
    setConfig(newConfig);
    await cmsStorage.saveQuizConfig(newConfig);
    if (onConfigChange) onConfigChange();
  };

  // Handle Question Limit Change
  const handleQuestionLimitChange = async (limit: number) => {
    const newConfig = { ...config, questionLimit: limit };
    setConfig(newConfig);
    await cmsStorage.saveQuizConfig(newConfig);
    if (onConfigChange) onConfigChange();
  };

  // Handle Randomizer Toggles
  const handleToggleRandomizer = async (key: keyof QuizCMSConfig) => {
    soundManager.playClick();
    const newConfig = { ...config, [key]: !config[key] };
    setConfig(newConfig);
    await cmsStorage.saveQuizConfig(newConfig);
    if (onConfigChange) onConfigChange();
  };

  // Save GitHub Settings
  const handleSaveGithubSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    const newConfig = { ...config, githubSync: ghForm };
    setConfig(newConfig);
    await cmsStorage.saveQuizConfig(newConfig);
    showToast("GitHub Repository credentials updated!");
  };

  // Push & Sync Active Dataset to Remote GitHub Repo
  const handlePushToGitHub = async () => {
    if (!activeDataset) return;
    soundManager.playClick();
    setIsSyncingGithub(true);

    try {
      const res = await cmsStorage.saveDataset(activeDataset, true);
      showToast(res.message);
    } catch (e: any) {
      showToast(`GitHub Commit Error: ${e.message}`);
    } finally {
      setIsSyncingGithub(false);
    }
  };

  // Handle JSON File Upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed.name || !Array.isArray(parsed.questions)) {
        showToast("Invalid Dataset JSON format! Must contain 'name' and 'questions' array.");
        return;
      }

      const newDataset: Dataset = {
        id: parsed.id || `uploaded_${Date.now()}`,
        name: parsed.name,
        description: parsed.description || "Uploaded dataset file",
        version: parsed.version || "1.0.0",
        updatedAt: new Date().toISOString(),
        divisions: parsed.divisions || [
          { id: "General Trivia", title: "General Trivia", subtitle: "General questions" },
        ],
        questions: parsed.questions,
      };

      const res = await cmsStorage.saveDataset(newDataset, true);
      await handleSelectDataset(newDataset.id);
      showToast(`Dataset "${newDataset.name}" uploaded! ${res.message}`);
      loadData();
    } catch (e) {
      showToast("Error parsing dataset JSON file.");
    }
  };

  // Handle Export Active Dataset to JSON Download
  const handleExportJSON = () => {
    if (!activeDataset) return;
    soundManager.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeDataset, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${activeDataset.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Exported ${activeDataset.name} to JSON dataset file!`);
  };

  // Save / Add / Update Question
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDataset) return;
    soundManager.playClick();

    const currentQuestions = [...(activeDataset.questions || [])];

    if (editingQuestion.id) {
      const idx = currentQuestions.findIndex((q) => q.id === editingQuestion.id);
      if (idx >= 0) {
        currentQuestions[idx] = editingQuestion as Question;
      }
    } else {
      const newQuestion: Question = {
        ...(editingQuestion as Question),
        id: Date.now(),
      };
      currentQuestions.push(newQuestion);
    }

    const existingDivisions = [...(activeDataset.divisions || [])];
    if (editingQuestion.category && !existingDivisions.some((d) => d.id === editingQuestion.category)) {
      existingDivisions.push({
        id: editingQuestion.category,
        title: editingQuestion.level || editingQuestion.category,
        subtitle: "Custom division",
      });
    }

    const updatedDataset: Dataset = {
      ...activeDataset,
      questions: currentQuestions,
      divisions: existingDivisions,
      updatedAt: new Date().toISOString(),
    };

    const res = await cmsStorage.saveDataset(updatedDataset, true);
    setActiveDataset(updatedDataset);
    setIsEditingQuestion(false);
    showToast(res.message);
    if (onConfigChange) onConfigChange();
  };

  // Delete Question
  const handleDeleteQuestion = async (qId: number | string) => {
    if (!activeDataset) return;
    if (!confirm("Are you sure you want to delete this question row?")) return;
    soundManager.playClick();

    const updatedQuestions = activeDataset.questions.filter((q) => q.id !== qId);
    const updatedDataset: Dataset = {
      ...activeDataset,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString(),
    };

    const res = await cmsStorage.saveDataset(updatedDataset, true);
    setActiveDataset(updatedDataset);
    showToast(`Question deleted. ${res.message}`);
    if (onConfigChange) onConfigChange();
  };

  const datasetDivisions = activeDataset?.divisions || [];
  const totalQuestions = activeDataset?.questions.length || 0;

  // Filtered Questions for Table
  const filteredQuestions = (activeDataset?.questions || []).filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.options.some((o) => o.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiv = filterDivision === "All" || q.category === filterDivision || q.level === filterDivision;
    return matchesSearch && matchesDiv;
  });

  const selectedQuestionIds = config.selectedQuestionIds || ["*"];
  const activeSelectedCount =
    selectedQuestionIds.includes("*") ? totalQuestions : selectedQuestionIds.length;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-6 text-gray-900"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-gray-900" />
              Admin Access
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 font-semibold mb-1 block">Username</label>
              <input
                type="text"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 font-semibold mb-1 block">Password</label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
            {authError && <div className="text-red-400 text-sm font-semibold">{authError}</div>}
            <button
              type="submit"
              className="w-full py-2 bg-black text-white hover:bg-gray-800 text-gray-900 font-medium rounded-lg mt-2 cursor-pointer transition-colors"
            >
              Log In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-gray-900/40 backdrop-blur-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-6xl h-[92vh] bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col overflow-hidden text-gray-900"
      >
        {/* Header Bar */}
        <div className="px-8 py-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-black text-white shadow-sm">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-normal text-gray-900 flex items-center gap-2">
                Quiz Settings & Content
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-700 font-medium border border-gray-300 flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5" /> Cloud Sync Active
                </span>
              </h2>
              <p className="text-sm text-gray-500">
                Current Question Bank: <span className="text-gray-900 font-semibold">{activeDataset?.name || "None"}</span> •{" "}
                <span className="text-gray-700 font-medium">{activeSelectedCount} Questions Included</span> / {totalQuestions} Total
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handlePushToGitHub}
              disabled={isSyncingGithub}
              className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-semibold text-sm rounded-lg flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingGithub ? "animate-spin" : ""}`} />
              {isSyncingGithub ? "Saving to Cloud..." : "Save Changes to Cloud"}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-white border-b border-gray-200 flex gap-2 overflow-x-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab("rows");
            }}
            className={`px-6 py-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "rows"
                ? "border-black text-gray-900 bg-gray-50"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Table className="w-4 h-4" />
            Manage Questions ({filteredQuestions.length})
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab("divisions");
            }}
            className={`px-6 py-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "divisions"
                ? "border-black text-gray-900 bg-gray-50"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Layers className="w-4 h-4" />
            Categories & Rounds
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab("randomizer");
            }}
            className={`px-6 py-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "randomizer"
                ? "border-black text-gray-900 bg-gray-50"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Shuffle className="w-4 h-4" />
            Quiz Rules
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab("datasets");
            }}
            className={`px-6 py-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "datasets"
                ? "border-black text-gray-900 bg-gray-50"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <FolderDown className="w-4 h-4" />
            Manage Question Banks ({datasets.length})
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab("github");
            }}
            className={`px-6 py-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "github"
                ? "border-black text-gray-900 bg-gray-50"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <GitBranch className="w-4 h-4 text-gray-900" />
            Cloud Connection
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
          {/* TAB 1: PRODUCTION ROWS & CHECKBOX DATA TABLE */}
          {activeTab === "rows" && (
            <div className="space-y-4">
              {/* Row Filter Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                  <div className="relative w-full max-w-xs">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search questions or options..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <select
                    value={filterDivision}
                    onChange={(e) => setFilterDivision(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  >
                    <option value="All">All Divisions</option>
                    {datasetDivisions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title || d.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    onClick={() => handleSelectAllFilteredQuestions(true)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-sm font-semibold rounded-lg text-gray-800 transition-all cursor-pointer"
                  >
                    Select All
                  </button>

                  <button
                    onClick={() => handleSelectAllFilteredQuestions(false)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-sm font-semibold rounded-lg text-gray-800 transition-all cursor-pointer"
                  >
                    Deselect All
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setEditingQuestion({
                        level: "Round 1 — General Trivia",
                        category: "General Trivia",
                        question: "",
                        options: ["", "", "", ""],
                        correctAnswer: 0,
                        explanation: "",
                        points: 10,
                      });
                      setIsEditingQuestion(true);
                    }}
                    className="px-4 py-1.5 bg-black hover:bg-gray-800 text-white font-semibold text-sm rounded-lg flex items-center gap-2 transition-all shadow-sm shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Question Row
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                      <th className="py-3 px-4 w-10 text-center">Include</th>
                      <th className="py-3 px-3 w-14">ID</th>
                      <th className="py-3 px-4 min-w-[240px]">Question Prompt</th>
                      <th className="py-3 px-3 min-w-[120px]">Division / Category</th>
                      <th className="py-3 px-4 min-w-[260px]">Options (Correct highlighted)</th>
                      <th className="py-3 px-3 w-16 text-center">Points</th>
                      <th className="py-3 px-4 w-24 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredQuestions.map((q) => {
                      const isSelected =
                        selectedQuestionIds.includes("*") || selectedQuestionIds.includes(q.id);

                      return (
                        <tr
                          key={q.id}
                          className={`transition-colors hover:bg-gray-50 ${
                            isSelected ? "bg-white text-gray-900" : "opacity-50 bg-gray-50/50"
                          }`}
                        >
                          {/* Checkbox Column */}
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleQuestionCheckbox(q.id)}
                              className="w-4 h-4 accent-black cursor-pointer rounded"
                            />
                          </td>

                          {/* ID */}
                          <td className="py-3 px-3 font-mono text-gray-500">#{q.id}</td>

                          {/* Question Text */}
                          <td className="py-3 px-4 font-semibold text-gray-900 leading-relaxed">
                            {q.question}
                          </td>

                          {/* Category Badge */}
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-xs border border-gray-300">
                              {q.category || q.level}
                            </span>
                          </td>

                          {/* Options Grid */}
                          <td className="py-3 px-4">
                            <div className="grid grid-cols-2 gap-1.5">
                              {q.options.map((opt, oIdx) => (
                                <div
                                  key={oIdx}
                                  className={`px-2.5 py-1 rounded text-xs font-medium border truncate ${
                                    oIdx === q.correctAnswer
                                      ? "bg-slate-100 border-slate-400 text-slate-900 font-bold"
                                      : "bg-white border-gray-200 text-gray-600"
                                  }`}
                                >
                                  <span className="font-mono opacity-60 mr-1">{String.fromCharCode(65 + oIdx)}.</span>
                                  {opt}
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Points */}
                          <td className="py-3 px-3 text-center font-mono font-bold text-gray-900">
                            +{q.points}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  soundManager.playClick();
                                  setEditingQuestion(q);
                                  setIsEditingQuestion(true);
                                }}
                                className="p-1.5 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                                title="Edit Question Row"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteQuestion(q.id)}
                                className="p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-gray-100 transition-colors cursor-pointer"
                                title="Delete Row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
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

          {/* TAB 2: DIVISIONS & SCOPE */}
          {activeTab === "divisions" && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-black/10 border border-amber-500/20 flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-200 leading-relaxed">
                  <span className="font-semibold text-gray-900">Select Quiz Divisions:</span> Choose which divisions
                  or rounds to include in the active quiz scope.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  onClick={() => handleToggleDivision("All")}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    config.selectedDivisions.includes("All")
                      ? "bg-black/20 border-amber-400 shadow-lg shadow-amber-500/10"
                      : "bg-gray-50 border-gray-200 hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono uppercase px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                      Full Scope
                    </span>
                    {config.selectedDivisions.includes("All") ? (
                      <CheckCircle2 className="w-5 h-5 text-gray-900" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">All Divisions & Rounds</h3>
                  <div className="text-sm text-gray-900 font-semibold">{totalQuestions} Questions Available</div>
                </div>

                {datasetDivisions.map((div) => {
                  const divQuestionsCount = (activeDataset?.questions || []).filter(
                    (q) => q.category === div.id || q.level === div.id
                  ).length;
                  const isSelected =
                    config.selectedDivisions.includes("All") || config.selectedDivisions.includes(div.id);

                  return (
                    <div
                      key={div.id}
                      onClick={() => handleToggleDivision(div.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-gray-800/10 border-black shadow-sm"
                          : "bg-gray-50 border-gray-200 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono uppercase px-2 py-0.5 rounded bg-gray-800/20 text-gray-600 border border-indigo-500/30">
                          {div.id}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-gray-900" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-base mb-1">{div.title || div.id}</h3>
                      <div className="text-sm text-gray-600 font-semibold">{divQuestionsCount} Questions</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: RANDOMIZER & LIMITS */}
          {activeTab === "randomizer" && (
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-gray-900" />
                      Limit Number of Questions
                    </h3>
                    <p className="text-sm text-gray-500">
                      Choose how many questions to show in a single quiz session.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-semibold text-gray-900">
                      {config.questionLimit === 0 ? "ALL" : config.questionLimit}
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={activeSelectedCount > 0 ? activeSelectedCount : 50}
                  value={config.questionLimit}
                  onChange={(e) => handleQuestionLimitChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => handleToggleRandomizer("enableQuestionRandomizer")}
                  className={`p-5 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                    config.enableQuestionRandomizer
                      ? "bg-gray-800/10 border-black"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-gray-900">
                      <Shuffle className="w-5 h-5 text-gray-900" />
                      Shuffle Question Order
                    </div>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full p-1 ${
                      config.enableQuestionRandomizer ? "bg-emerald-400" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        config.enableQuestionRandomizer ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>

                <div
                  onClick={() => handleToggleRandomizer("enableOptionShuffle")}
                  className={`p-5 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                    config.enableOptionShuffle
                      ? "bg-gray-800/10 border-black"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-gray-900">
                      <Sparkles className="w-5 h-5 text-gray-900" />
                      Shuffle Answers (A, B, C, D)
                    </div>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full p-1 ${
                      config.enableOptionShuffle ? "bg-cyan-400" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        config.enableOptionShuffle ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DATASET MANAGER */}
          {activeTab === "datasets" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Question Bank Manager</h3>
                  <p className="text-sm text-gray-500">
                    Uploaded question banks are saved locally and pushed to your cloud repository.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="px-5 py-2.5 bg-black hover:bg-gray-800 text-gray-900 font-semibold text-sm rounded-lg cursor-pointer flex items-center gap-2 transition-all shadow-md">
                    <Upload className="w-4 h-4" />
                    Upload JSON Bank
                    <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                  </label>

                  <button
                    onClick={handleExportJSON}
                    className="px-5 py-2.5 bg-black text-white hover:bg-gray-800 text-gray-900 font-medium text-sm rounded-lg flex items-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Export JSON File
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {datasets.map((ds) => {
                  const isActive = ds.id === activeDataset?.id;
                  return (
                    <div
                      key={ds.id}
                      className={`p-5 rounded-lg border transition-all ${
                        isActive
                          ? "bg-gray-800/10 border-black"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{ds.name}</h4>
                      <p className="text-sm text-gray-500 mb-3">{ds.description}</p>
                      <div className="text-sm font-mono text-gray-500 mb-4">{ds.questions?.length || 0} Questions • v{ds.version}</div>

                      {!isActive ? (
                        <button
                          onClick={() => handleSelectDataset(ds.id)}
                          className="px-4 py-1.5 bg-gray-200 hover:bg-black hover:text-white text-gray-800 text-sm font-semibold rounded-lg transition-all cursor-pointer"
                        >
                          Select Active Dataset
                        </button>
                      ) : (
                        <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Currently Active
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: GITHUB REPO DIRECT SYNC CONFIG */}
          {activeTab === "github" && (
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-gray-900" />
                      Connect your Cloud Repository
                    </h3>
                    <p className="text-sm text-gray-500">
                      Add your GitHub access token below so any changes you make are instantly saved to your live deployed application.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveGithubSettings} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500 font-semibold mb-1 block">
                        GitHub Personal Access Token (PAT)
                      </label>
                      <input
                        type="password"
                        value={ghForm.token}
                        onChange={(e) => setGhForm({ ...ghForm, token: e.target.value })}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 font-semibold mb-1 block">
                        Repository Owner / Username
                      </label>
                      <input
                        type="text"
                        value={ghForm.owner}
                        onChange={(e) => setGhForm({ ...ghForm, owner: e.target.value })}
                        placeholder="e.g. your_github_username"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 font-semibold mb-1 block">
                        Repository Name
                      </label>
                      <input
                        type="text"
                        value={ghForm.repo}
                        onChange={(e) => setGhForm({ ...ghForm, repo: e.target.value })}
                        placeholder="Flashcard_Quiz_App"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 font-semibold mb-1 block">
                        Target Branch
                      </label>
                      <input
                        type="text"
                        value={ghForm.branch}
                        onChange={(e) => setGhForm({ ...ghForm, branch: e.target.value })}
                        placeholder="main"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm rounded-lg transition-all cursor-pointer shadow-md"
                    >
                      Save GitHub Credentials
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Status Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 right-6 z-50 px-6 py-4 bg-amber-400 text-white font-bold text-sm rounded-lg shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Edit / Add Question Modal */}
      {isEditingQuestion && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-gray-50lack/90 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg p-6 space-y-4 text-gray-900">
            <h3 className="text-lg font-bold text-gray-900">
              {editingQuestion.id ? "Edit Question Row" : "Add Question Row"}
            </h3>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 font-semibold mb-1 block">Question Text</label>
                <input
                  type="text"
                  required
                  value={editingQuestion.question || ""}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="Enter question prompt..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 font-semibold mb-1 block">Division / Category</label>
                  <input
                    type="text"
                    required
                    value={editingQuestion.category || "General Trivia"}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, category: e.target.value, level: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500 font-semibold mb-1 block">Points</label>
                  <input
                    type="number"
                    value={editingQuestion.points || 10}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-500 font-semibold block">Options (Select radio for correct choice)</label>
                {(editingQuestion.options || ["", "", "", ""]).map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={editingQuestion.correctAnswer === idx}
                      onChange={() => setEditingQuestion({ ...editingQuestion, correctAnswer: idx })}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                    <span className="font-mono text-sm text-gray-500 w-4">{String.fromCharCode(65 + idx)}.</span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...(editingQuestion.options || ["", "", "", ""])];
                        newOpts[idx] = e.target.value;
                        setEditingQuestion({ ...editingQuestion, options: newOpts });
                      }}
                      className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-sm text-gray-500 font-semibold mb-1 block">Explanation</label>
                <textarea
                  value={editingQuestion.explanation || ""}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingQuestion(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-white text-sm font-bold rounded-lg cursor-pointer"
                >
                  Save Question Row & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
