import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes";
import { ApiError } from "../services/api";
import {
  adminLogin,
  adminLogout,
  adminMe,
  exportAdminExcel,
  getAdminDashboardMetrics,
  getAdminSessionAnswers,
  getAdminSessions,
  type AdminAnswerRecord,
  type AdminDashboardMetrics,
  type AdminSessionRecord,
} from "../services/adminApi";

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function formatScore(value: number | null, total: number | null): string {
  if (value == null || total == null) return "—";
  return `${value}/${total}`;
}

type AuthStatus = "checking" | "logged_out" | "logged_in";
type SortDirection = "asc" | "desc";
type SortField =
  | "name"
  | "email"
  | "country"
  | "sectorId"
  | "buysUruguayMeat"
  | "language"
  | "participantCreatedAt"
  | "startedAt"
  | "completedAt"
  | "score"
  | "scoreBand"
  | "status";

const emptyMetrics: AdminDashboardMetrics = {
  totalParticipants: 0,
  totalCompletedSessions: 0,
  averageScore: 0,
  buyersCount: 0,
};

function BackToTriviaButton() {
  const navigate = useNavigate();
  return (
    <Button type="button" variant="outlined" onClick={() => navigate(ROUTES.attract)}>
      Volver a trivia
    </Button>
  );
}

const dateFieldSx = {
  minWidth: 180,
  bgcolor: "rgba(255,255,255,0.04)",
  "& input[type='date']::-webkit-calendar-picker-indicator": {
    opacity: 1,
    cursor: "pointer",
    filter: "invert(0.88) sepia(0.2) saturate(0.6)",
  },
  "& input[type='date']::-webkit-clear-button": {
    display: "none",
  },
} as const;

export function AdminPage() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");
  const [authError, setAuthError] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<AdminDashboardMetrics>(emptyMetrics);
  const [sessions, setSessions] = useState<AdminSessionRecord[]>([]);
  const [answersBySession, setAnswersBySession] = useState<Record<number, AdminAnswerRecord[]>>({});
  const [answersLoadingId, setAnswersLoadingId] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<AdminSessionRecord | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortField, setSortField] = useState<SortField>("participantCreatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const selectedAnswers = useMemo(() => {
    if (!selectedSession?.sessionId) return [];
    return answersBySession[selectedSession.sessionId] ?? [];
  }, [answersBySession, selectedSession]);

  const filteredAndSortedSessions = useMemo(() => {
    const fromTs = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null;
    const toTs = toDate ? new Date(`${toDate}T23:59:59`).getTime() : null;

    const filtered = sessions.filter((row) => {
      if (fromTs == null && toTs == null) return true;
      const source = row.startedAt ?? row.participantCreatedAt;
      if (!source) return false;
      const ts = new Date(source).getTime();
      if (Number.isNaN(ts)) return false;
      if (fromTs != null && ts < fromTs) return false;
      if (toTs != null && ts > toTs) return false;
      return true;
    });

    const getComparable = (row: AdminSessionRecord): string | number => {
      switch (sortField) {
        case "name":
          return row.name.toLowerCase();
        case "email":
          return row.email.toLowerCase();
        case "country":
          return row.country.toLowerCase();
        case "sectorId":
          return row.sectorId.toLowerCase();
        case "buysUruguayMeat":
          return row.buysUruguayMeat ? 1 : 0;
        case "language":
          return row.language;
        case "participantCreatedAt":
          return row.participantCreatedAt ? new Date(row.participantCreatedAt).getTime() : 0;
        case "startedAt":
          return row.startedAt ? new Date(row.startedAt).getTime() : 0;
        case "completedAt":
          return row.completedAt ? new Date(row.completedAt).getTime() : 0;
        case "score":
          return row.score ?? -1;
        case "scoreBand":
          return row.scoreBand ?? "";
        case "status":
          return row.status;
        default:
          return 0;
      }
    };

    return [...filtered].sort((a, b) => {
      const av = getComparable(a);
      const bv = getComparable(b);
      const base = av > bv ? 1 : av < bv ? -1 : 0;
      return sortDirection === "asc" ? base : -base;
    });
  }, [fromDate, toDate, sessions, sortDirection, sortField]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortDirection("asc");
  };

  const loadDashboardData = async () => {
    setIsLoadingData(true);
    setDataError(null);
    try {
      const [metricsResponse, sessionsResponse] = await Promise.all([
        getAdminDashboardMetrics(),
        getAdminSessions(),
      ]);
      setMetrics(metricsResponse);
      setSessions(sessionsResponse);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setAuthStatus("logged_out");
        setAuthError("La sesión admin expiró. Ingresá nuevamente.");
        return;
      }
      setDataError("No se pudieron cargar los datos.");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    let active = true;
    void adminMe()
      .then(async () => {
        if (!active) return;
        setAuthStatus("logged_in");
        setAuthError(null);
        await loadDashboardData();
      })
      .catch(() => {
        if (!active) return;
        setAuthStatus("logged_out");
      });
    return () => {
      active = false;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmittingLogin(true);
    try {
      await adminLogin(usernameInput.trim(), passwordInput);
      setPasswordInput("");
      setAuthStatus("logged_in");
      await loadDashboardData();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setAuthError("Usuario o contraseña incorrectos.");
      } else {
        setAuthError("No se pudo iniciar sesión.");
      }
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setAuthStatus("logged_out");
    setSessions([]);
    setAnswersBySession({});
  };

  const handleExport = async () => {
    setIsExporting(true);
    setDataError(null);
    try {
      await exportAdminExcel();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setAuthStatus("logged_out");
        setAuthError("La sesión admin expiró. Ingresá nuevamente.");
      } else {
        setDataError("No se pudo exportar el Excel.");
      }
    } finally {
      setIsExporting(false);
    }
  };

  const openAnswers = async (session: AdminSessionRecord) => {
    if (session.sessionId == null) return;
    setSelectedSession(session);
    if (answersBySession[session.sessionId]) return;
    setAnswersLoadingId(session.sessionId);
    try {
      const answers = await getAdminSessionAnswers(session.sessionId);
      setAnswersBySession((prev) => ({ ...prev, [session.sessionId!]: answers }));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setAuthStatus("logged_out");
        setAuthError("La sesión admin expiró. Ingresá nuevamente.");
      } else {
        setDataError("No se pudieron cargar las respuestas.");
      }
    } finally {
      setAnswersLoadingId(null);
    }
  };

  if (authStatus === "checking") {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "100vh", bgcolor: "#0c0c0c" }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (authStatus === "logged_out") {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "100vh", bgcolor: "#0c0c0c", p: 2 }}>
        <Paper component="form" onSubmit={handleLogin} sx={{ width: "100%", maxWidth: 420, p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Panel admin
            </Typography>
            <Typography color="text.secondary">Ingresá tus credenciales para continuar.</Typography>
            {authError ? <Alert severity="error">{authError}</Alert> : null}
            <TextField
              label="Usuario"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              autoComplete="username"
              required
              fullWidth
            />
            <TextField
              label="Contraseña"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoComplete="current-password"
              type="password"
              required
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={isSubmittingLogin}>
              {isSubmittingLogin ? "Ingresando..." : "Ingresar"}
            </Button>
            <BackToTriviaButton />
          </Stack>
        </Paper>
      </Stack>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#000", py: 2, px: { xs: 1, md: 2 } }}>
      <Stack spacing={2} sx={{ minHeight: "calc(100vh - 16px)", width: "100%" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "common.white" }}>
              Panel admin
            </Typography>
            <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
              <BackToTriviaButton />
              <Button variant="contained" onClick={handleExport} disabled={isExporting}>
                {isExporting ? "Exportando..." : "Exportar Excel"}
              </Button>
              <Button variant="outlined" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </Stack>
          </Stack>

          {dataError ? <Alert severity="error">{dataError}</Alert> : null}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <TextField
              label="Desde"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={dateFieldSx}
            />
            <TextField
              label="Hasta"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={dateFieldSx}
            />
            <Button variant="outlined" onClick={() => { setFromDate(""); setToDate(""); }}>
              Limpiar filtros
            </Button>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={1.25}>
            <MetricCard label="Participantes" value={metrics.totalParticipants} />
            <MetricCard label="Sesiones completadas" value={metrics.totalCompletedSessions} />
            <MetricCard label="Promedio score" value={metrics.averageScore.toFixed(2)} />
            <MetricCard label="Compran carne uruguaya" value={metrics.buyersCount} />
          </Stack>

          <Paper sx={{ p: 0.5, flex: 1, minHeight: 0, bgcolor: "#0f0f0f", border: "1px solid rgba(205,153,65,0.25)" }}>
            {isLoadingData ? (
              <Stack alignItems="center" justifyContent="center" sx={{ p: 4, minHeight: "60vh" }}>
                <CircularProgress size={28} />
              </Stack>
            ) : filteredAndSortedSessions.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" sx={{ p: 4, minHeight: "60vh" }}>
                <Typography color="text.secondary">Todavía no hay registros.</Typography>
              </Stack>
            ) : (
              <TableContainer sx={{ height: "100%", minHeight: "60vh", maxHeight: "calc(100vh - 220px)" }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><TableSortLabel active={sortField === "name"} direction={sortDirection} onClick={() => handleSort("name")}>Nombre</TableSortLabel></TableCell>
                      <TableCell><TableSortLabel active={sortField === "email"} direction={sortDirection} onClick={() => handleSort("email")}>Email</TableSortLabel></TableCell>
                      <TableCell><TableSortLabel active={sortField === "country"} direction={sortDirection} onClick={() => handleSort("country")}>País</TableSortLabel></TableCell>
                      <TableCell><TableSortLabel active={sortField === "sectorId"} direction={sortDirection} onClick={() => handleSort("sectorId")}>Sector</TableSortLabel></TableCell>
                      <TableCell><TableSortLabel active={sortField === "buysUruguayMeat"} direction={sortDirection} onClick={() => handleSort("buysUruguayMeat")}>Compra carne uruguaya</TableSortLabel></TableCell>
                      <TableCell><TableSortLabel active={sortField === "language"} direction={sortDirection} onClick={() => handleSort("language")}>Idioma</TableSortLabel></TableCell>
                      <TableCell><TableSortLabel active={sortField === "participantCreatedAt"} direction={sortDirection} onClick={() => handleSort("participantCreatedAt")}>Registro</TableSortLabel></TableCell>
                      <TableCell><TableSortLabel active={sortField === "startedAt"} direction={sortDirection} onClick={() => handleSort("startedAt")}>Inicio quiz</TableSortLabel></TableCell>
                      <TableCell><TableSortLabel active={sortField === "completedAt"} direction={sortDirection} onClick={() => handleSort("completedAt")}>Fin quiz</TableSortLabel></TableCell>
                      <TableCell><TableSortLabel active={sortField === "score"} direction={sortDirection} onClick={() => handleSort("score")}>Score</TableSortLabel></TableCell>
                      <TableCell><TableSortLabel active={sortField === "scoreBand"} direction={sortDirection} onClick={() => handleSort("scoreBand")}>Banda</TableSortLabel></TableCell>
                      <TableCell><TableSortLabel active={sortField === "status"} direction={sortDirection} onClick={() => handleSort("status")}>Estado</TableSortLabel></TableCell>
                      <TableCell>Respuestas</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAndSortedSessions.map((row) => (
                      <TableRow key={`${row.participantId}-${row.sessionId ?? "none"}`} hover>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.country}</TableCell>
                        <TableCell>{row.sectorId}</TableCell>
                        <TableCell>{row.buysUruguayMeat ? "Sí" : "No"}</TableCell>
                        <TableCell>{row.language.toUpperCase()}</TableCell>
                        <TableCell>{formatDateTime(row.participantCreatedAt)}</TableCell>
                        <TableCell>{formatDateTime(row.startedAt)}</TableCell>
                        <TableCell>{formatDateTime(row.completedAt)}</TableCell>
                        <TableCell>{formatScore(row.score, row.totalQuestions)}</TableCell>
                        <TableCell>{row.scoreBand ?? "—"}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell>
                          {row.sessionId ? (
                            <Button size="small" onClick={() => void openAnswers(row)} disabled={answersLoadingId === row.sessionId}>
                              {answersLoadingId === row.sessionId ? "Cargando..." : "Ver respuestas"}
                            </Button>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Stack>

      <Dialog open={selectedSession != null} onClose={() => setSelectedSession(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          Respuestas de sesión {selectedSession?.sessionId ?? "—"} — {selectedSession?.name ?? ""}
        </DialogTitle>
        <DialogContent>
          {selectedSession?.sessionId == null ? null : answersLoadingId === selectedSession.sessionId ? (
            <Stack alignItems="center" justifyContent="center" sx={{ p: 3 }}>
              <CircularProgress size={24} />
            </Stack>
          ) : selectedAnswers.length === 0 ? (
            <Typography color="text.secondary">No hay respuestas registradas para esta sesión.</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>question_id</TableCell>
                  <TableCell>selected_option_id</TableCell>
                  <TableCell>is_correct</TableCell>
                  <TableCell>answered_at</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedAnswers.map((answer, idx) => (
                  <TableRow key={`${answer.sessionId}-${answer.questionId}-${idx}`}>
                    <TableCell>{answer.questionId}</TableCell>
                    <TableCell>{answer.selectedOptionId}</TableCell>
                    <TableCell>{answer.isCorrect ? "1" : "0"}</TableCell>
                    <TableCell>{formatDateTime(answer.answeredAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Paper sx={{ p: 2, flex: 1, minWidth: 0 }}>
      <Typography color="text.secondary" sx={{ fontSize: "0.9rem" }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        {value}
      </Typography>
    </Paper>
  );
}
