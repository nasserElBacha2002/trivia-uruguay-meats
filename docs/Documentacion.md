## 1. Objetivo del Proyecto

El presente proyecto consiste en el desarrollo de una **aplicación interactiva tipo trivia** para ser utilizada en un **monitor touch dentro de una feria en São Paulo**.

El objetivo principal de la solución es triple:

* **Generar una base de datos calificada** de potenciales clientes o contactos comerciales.
* **Educar al usuario** sobre el producto Uruguay Lamb y sus características diferenciales.
* **Posicionar la marca** como referente global bajo el concepto:

  > “Boutique de carnes do mundo”

La experiencia está diseñada para completarse en un tiempo estimado de **60 a 90 segundos**, optimizando la interacción en un entorno de alto flujo de personas.

---

## 2. Contexto de la Empresa y Marca

El proyecto se enmarca dentro de la estrategia de comunicación de la marca **Uruguay Meats**, impulsada por el Instituto Nacional de Carnes (INAC).

### 2.1 Posicionamiento

La marca se posiciona como:

* Premium
* Internacional
* Sostenible
* Confiable
* Innovadora
* Elegante

Su objetivo es representar la calidad de las carnes uruguayas en mercados globales exigentes.

### 2.2 Propuesta de Valor

* Producción natural (pasturas)
* Trazabilidad y calidad
* Tradición + tecnología
* Experiencia gastronómica

La comunicación busca transmitir no solo producto, sino **experiencia y estilo de vida**.

---

## 3. Identidad Visual y Paleta de Colores

La aplicación deberá respetar los lineamientos del manual de marca.

### 3.1 Colores Principales

* **Azul institucional**

  * HEX: `#002F6C`
  * Uso: color base, fondos, elementos principales

* **Amarillo institucional**

  * HEX: `#FFB81C`
  * Uso: llamados a la acción (CTA), acentos

### 3.2 Colores Secundarios

* Negro: `#000000`
* Gris: `#AEADB3`

### 3.3 Tipografía

* Digital: **PT Sans**
* Estilo:

  * Claro
  * Legible
  * Profesional
  * Sin ornamentación excesiva

### 3.4 Lineamientos Visuales

* Estética **premium y minimalista**
* Uso de imágenes gastronómicas de alta calidad
* Alto contraste para accesibilidad
* Elementos grandes para interacción touch
* Evitar sobrecarga visual

---

## 4. Experiencia de Usuario (UX)

La aplicación será diseñada para un entorno **kiosk / pantalla táctil**, con las siguientes características:

* Interacción rápida (60–90 segundos)
* Navegación lineal (sin menús complejos)
* Botones grandes (touch-friendly)
* Sin scroll
* Feedback inmediato
* Reset automático en caso de inactividad

### Flujo de usuario:

1. Pantalla inicial (atracción)
2. Selección de idioma (Portugués / Inglés)
3. Formulario de datos
4. Trivia (6 preguntas)
5. Resultado final
6. Reinicio automático

---

## 5. Datos a Recolectar

Se recolectarán los siguientes datos:

* Nombre
* Email
* País
* ¿Compra carne uruguaya?

  * Sí / No
* Sector:

  * Importador
  * Distribuidor
  * Varejo / Supermercado
  * Foodservice / Restaurante
  * Industria
  * Otro

### Datos adicionales (internos del sistema):

* Puntaje obtenido
* Respuestas seleccionadas
* Idioma elegido
* Tiempo de completitud
* Fecha y hora
* Estado (completado / abandonado)

---

## 6. Contenido de la Trivia

La trivia estará compuesta por **6 preguntas de opción múltiple**, con una única respuesta correcta y feedback inmediato.

---

### Pregunta 1

**¿Qué tipo de carnes exporta Uruguay a Brasil?**

* Carne bovina y ovina ✅
* Carne bovina, ovina y aves
* Carne bovina, ovina y porcina
* Solo carne bovina

---

### Pregunta 2

**¿Qué es Uruguay Lamb?**

* Una empresa exportadora
* Una marca de promoción del cordero uruguayo ✅
* Un tipo de corte de carne

---

### Pregunta 3

**Según la campaña, el cordero uruguayo forma parte de:**

* Una commodity global
* Producción masiva
* Boutique de carnes del mundo ✅
* Producto de bajo costo

---

### Pregunta 4

**¿Qué caracteriza su sistema productivo?**

* Producción intensiva
* Producción urbana
* Producción en pasturas naturales ✅

---

### Pregunta 5

**¿Por qué el cordero es más tierno que la oveja?**

* Por la edad del animal ✅
* Por la raza
* Por el corte

---

### Pregunta 6

**¿Cómo puede consumirse el cordero?**

* Solo en cocciones largas
* Solo a la parrilla
* En diversas preparaciones ✅

---

## 7. Pantalla Final (Resultados)

Se mostrarán distintos mensajes según el desempeño:

* **Alto**

  > “Você conhece bem o cordeiro uruguaio! Retire seu brinde.”

* **Medio**

  > “Você está no caminho certo.”

* **Bajo**

  > “Ainda falta conhecer mais sobre o cordeiro uruguaio.”

---

## 8. Stack Tecnológico

El sistema será desarrollado utilizando exclusivamente **JavaScript / TypeScript**.

### 8.1 Frontend

* React + TypeScript
* Librería de UI: **MUI (Material UI)**
* i18n: i18next
* Formularios: React Hook Form
* Validación: Zod
* Routing: React Router

### 8.2 Backend

* Node.js + TypeScript
* Framework sugerido: Express o NestJS

### 8.3 Estado y datos

* TanStack Query (opcional para sincronización)
* API REST

---

## 9. Persistencia de Datos

### 9.1 Base de Datos

Se recomienda:

* PostgreSQL (principal opción)
* Alternativa: servicios como Supabase

### 9.2 Estructura básica

**Tabla: participants**

* id
* name
* email
* country
* sector
* buys_uruguay_meat
* language
* score
* completed
* created_at

**Tabla: answers**

* id
* participant_id
* question_id
* selected_option
* is_correct

---

## 10. Panel Administrativo

Se desarrollará un panel interno con las siguientes funcionalidades:

* Visualización de registros
* Filtros por:

  * país
  * sector
  * compra carne uruguaya
* Visualización de puntajes
* Exportación a CSV / Excel
* Métricas básicas

---

## 11. Consideraciones Técnicas

* Aplicación en modo **fullscreen kiosk**
* Compatible con navegador en monitor touch
* Reset automático tras inactividad
* Validación de inputs simple
* Accesibilidad (contraste, tamaño, legibilidad)
* Manejo de errores de red

---

## 12. Conclusión

El proyecto propone una solución digital eficiente para eventos, combinando:

* Captura de datos comerciales
* Experiencia interactiva
* Comunicación de marca
* Tecnología web escalable

La elección del stack y arquitectura permite evolucionar el sistema más allá del evento, reutilizando la solución para futuras activaciones.

