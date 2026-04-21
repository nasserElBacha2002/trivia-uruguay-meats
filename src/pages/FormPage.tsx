import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ScreenCard } from "../components/ScreenCard";
import { ROUTES } from "../config/routes";

export function FormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <ScreenCard title={t("formTitle")} subtitle="Fase estática: estructura visual del formulario">
      <Stack gap={3} height="100%" justifyContent="space-between">
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          <Box>
            <TextField fullWidth label="Nome" />
          </Box>
          <Box>
            <TextField fullWidth label="Email" />
          </Box>
          <Box>
            <TextField fullWidth label="País" />
          </Box>
          <Box>
            <TextField fullWidth label="Setor" select defaultValue="">
              <MenuItem value="">Selecione</MenuItem>
              <MenuItem value="importador">Importador</MenuItem>
              <MenuItem value="distribuidor">Distribuidor</MenuItem>
              <MenuItem value="varejo_supermercado">Varejo / Supermercado</MenuItem>
              <MenuItem value="foodservice_restaurante">Foodservice / Restaurante</MenuItem>
              <MenuItem value="industria">Industria</MenuItem>
              <MenuItem value="otro">Outro</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ gridColumn: { xs: "auto", md: "1 / span 2" } }}>
            <TextField fullWidth label="Compra carne uruguaia?" select defaultValue="">
              <MenuItem value="">Selecione</MenuItem>
              <MenuItem value="yes">Sim</MenuItem>
              <MenuItem value="no">Não</MenuItem>
            </TextField>
          </Box>
        </Box>

        <Stack direction="row" justifyContent="flex-end">
          <Button onClick={() => navigate(ROUTES.quiz)}>Continuar</Button>
        </Stack>
      </Stack>
    </ScreenCard>
  );
}
