# 📄 PLAN DE IMPLEMENTACIÓN

## Trivia Kiosk – Uruguay Lamb / Uruguay Meats

---

# 0) Reglas base del proyecto (NUEVO – CRÍTICO)

## 0.1 Prioridad de fuentes (OBLIGATORIO)

Orden de verdad del sistema:

1. **Brief funcional (quiz + objetivos)** 
2. **Manual de marca Uruguay Meats** 
3. **Diseño en Stitch**

👉 Stitch es referencia visual, **no fuente de verdad funcional ni de marca**.

---

## 0.2 Tipo de producto

Esto NO es:

* una app
* una landing
* un sistema navegable

Esto ES:

> una **experiencia guiada, lineal, touch-first, de una sola sesión en entorno kiosk**

---

## 0.3 Restricciones globales

* Sin scroll
* Sin navegación libre
* Sin back libre
* Sin UI compleja
* Todo fullscreen
* Todo optimizado para touch

---

# 1) Resumen ejecutivo

Se va a construir una **web app kiosk interactiva**, diseñada para ferias, con objetivo de:

* capturar leads calificados
* educar sobre Uruguay Lamb
* reforzar marca premium

Flujo:

```
Attract → Idioma → Formulario → Quiz (6) → Resultado → Reset
```

Duración objetivo: **60–90 segundos**

---

# 2) Fase 0 — Cierre de contrato (REDEFINIDA)

## Objetivo

Eliminar TODAS las ambigüedades antes de programar.

---

## 2.1 Decisiones obligatorias (CERRADAS)

### Tipografía

* Se usa **PT Sans (OBLIGATORIO)**
* Stitch NO define tipografía final

---

### Logo (CRÍTICO)

* SIEMPRE visible
* SIEMPRE isologo oficial
* NUNCA texto plano

Ubicación:

* esquina superior izquierda (default)
* consistente en todas las pantallas

---

### Colores

* Azul: `#002F6C` (base)
* Amarillo: `#FFB81C` (solo CTA)
* Neutrales: blanco, negro, gris

👉 No se permite expandir la paleta de Stitch

---

### Scoring (CERRADO)

* 5–6 correctas → ALTO
* 3–4 correctas → MEDIO
* 0–2 correctas → BAJO

---

### Feedback inmediato (CERRADO)

* Inline dentro de la misma pantalla
* Duración: 1.5 – 2 segundos
* Luego avanza automáticamente

---

### Timeout kiosk (CERRADO)

* 20–30 segundos sin interacción → reset
* Reinicia a pantalla inicial

---

### Persistencia de datos (CERRADO)

* Lead se guarda:
  👉 AL FINAL (no al inicio)
* Respuestas:
  👉 se envían en batch al final

---

### Validaciones formulario

* Nombre: obligatorio
* Email: obligatorio + formato válido
* País: obligatorio
* Sector: obligatorio
* Compra carne: obligatorio

---

### Resolución target

* Desktop kiosk (pantalla grande)
* No mobile-first

---

# 3) Alcance funcional MVP

Incluye:

* pantalla attract
* selección idioma
* formulario completo
* 6 preguntas
* feedback inmediato
* resultado final
* reset automático
* bloqueo navegación
* tracking básico

NO incluye:

* admin panel
* analytics complejas
* features no definidas

---

# 4) Arquitectura frontend

## Stack

* React + TypeScript
* MUI
* React Router
* React Hook Form
* Zod
* i18next

---

## Estructura

```
src/
  app/
  pages/
  components/
  features/
    lead/
    quiz/
    session/
  hooks/
  services/
  theme/
  i18n/
  config/
  mocks/
  types/
```

---

## Principio clave

👉 Separar:

* UI (components)
* lógica (features)
* flujo (session)

---

# 5) Contrato de marca (NUEVO – CRÍTICO)

## Logo

* Isologo oficial únicamente
* No recrear
* No texto reemplazando logo

---

## Uso

* Siempre visible
* Nunca tapado
* Nunca deformado
* Siempre con margen de seguridad

---

## Estilo visual

* Premium
* Minimalista
* Gastronómico
* Profesional

---

## Prohibido

* UI tipo app
* iconografía lúdica
* estilos “gaming”
* saturación visual

---

# 6) Plan por fases (CORREGIDO)

---

## Fase 0 — Cierre de contrato

(ya definida arriba)

---

## Fase 1 — Setup + theme

* Configurar proyecto
* Definir theme MUI
* Aplicar:

  * colores marca
  * tipografía PT Sans
  * spacing system

---

## Fase 2 — Shell kiosk

* Layout fullscreen
* Header con logo
* Control navegación
* Guard de flujo

---

## Fase 3 — Pantallas estáticas

* Attract
* Idioma
* Formulario
* Quiz (estructura)
* Resultado

👉 QA obligatorio contra:

* Stitch
* Manual de marca

---

## Fase 4 — Formulario

* Implementar con RHF + Zod
* UX touch optimizada
* Validación clara

---

## Fase 5 — Motor de quiz

* 6 preguntas
* estado secuencial
* scoring acumulado

---

## Fase 6 — Feedback + resultado

* feedback inline
* transición automática
* resultado por banda

---

## Fase 7 — i18n

* Portugués default
* Inglés secundario
* sin desbordes UI

---

## Fase 8 — Comportamiento kiosk

* timeout
* reset
* bloqueo navegación
* control de errores de sesión

---

## Fase 9 — Integración API

* endpoints desacoplados
* mock inicial
* fallback sin red

---

## Fase 10 — QA final

* visual
* funcional
* accesibilidad
* performance
* test en dispositivo real

---

# 7) Estado y navegación

## Modelo

Estado central (session):

* paso actual
* idioma
* respuestas
* score
* timestamps
* estado sesión

---

## Reglas

* flujo lineal
* no saltos
* no back libre
* estado inválido → reset

---

# 8) Integración backend (definida)

## Endpoints

* POST /participants
* POST /answers
* POST /complete

---

## Política de red

* si falla → no bloquear experiencia
* guardar local temporal (opcional)
* retry silencioso

---

# 9) Riesgos (ACTUALIZADO)

## Alto impacto

* romper manual de marca
* depender demasiado de Stitch
* UX no optimizada para touch
* formulario lento
* mala gestión de timeout

## Medio

* i18n rompe layout
* scoring inconsistente
* mala jerarquía visual

---

# 10) Checklist final (MEJORADO)

* [ ] Fuente de verdad definida
* [ ] Tipografía validada
* [ ] Logo presente en todas las pantallas
* [ ] Colores correctos aplicados
* [ ] Flujo lineal sin escape
* [ ] Formulario validado
* [ ] 6 preguntas funcionando
* [ ] Feedback inmediato definido
* [ ] Scoring correcto
* [ ] i18n completo
* [ ] Timeout funcionando
* [ ] Reset estable
* [ ] API desacoplada
* [ ] QA visual completo
* [ ] Test en monitor real

