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
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
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

const emptyMetrics: AdminDashboardMetrics = {
  totalParticipants: 0,
  totalCompletedSessions: 0,
  averageScore: 0,
  buyersCount: 0,
};

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

  const selectedAnswers = useMemo(() => {
    if (!selectedSession?.sessionId) return [];
    return answersBySession[selectedSession.sessionId] ?? [];
  }, [answersBySession, selectedSession]);

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
            <Stack direction="row" spacing={1.25}>
              <Button variant="contained" onClick={handleExport} disabled={isExporting}>
                {isExporting ? "Exportando..." : "Exportar Excel"}
              </Button>
              <Button variant="outlined" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </Stack>
          </Stack>

          {dataError ? <Alert severity="error">{dataError}</Alert> : null}

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
            ) : sessions.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" sx={{ p: 4, minHeight: "60vh" }}>
                <Typography color="text.secondary">Todavía no hay registros.</Typography>
              </Stack>
            ) : (
              <TableContainer sx={{ height: "100%", minHeight: "60vh", maxHeight: "calc(100vh - 220px)" }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>País</TableCell>
                      <TableCell>Sector</TableCell>
                      <TableCell>Compra carne uruguaya</TableCell>
                      <TableCell>Idioma</TableCell>
                      <TableCell>Registro</TableCell>
                      <TableCell>Inicio quiz</TableCell>
                      <TableCell>Fin quiz</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Banda</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Respuestas</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessions.map((row) => (
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
