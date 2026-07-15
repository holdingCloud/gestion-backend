# Módulo RRHH — Documentación de API

> Sistema de gestión de recursos humanos para empresa chilena.
> Todos los endpoints requieren autenticación JWT (`Authorization: Bearer <token>`).

---

## Índice

1. [Arquitectura y flujo general](#arquitectura)
2. [Catálogos — Departamentos y Cargos](#departamentos-y-cargos)
3. [Catálogos — Previsión (AFP / Salud / Mutual)](#previsión)
4. [Empleados](#empleados)
5. [Contratos y Anexos](#contratos)
6. [Liquidaciones de Sueldo](#liquidaciones)
7. [Anticipos](#anticipos)
8. [Ausencias (Vacaciones / Licencias / Permisos)](#ausencias)
9. [Finiquitos](#finiquitos)
10. [Documentos, Cuentas Bancarias y Cargas Familiares](#documentos-empleado)
11. [Flujo completo de contratación a finiquito](#flujo-completo)
12. [Lógica de negocio — Cálculos](#lógica-de-negocio)

---

## Arquitectura

```
src/
├── departamentos/        → catálogos de estructura organizacional
├── prevision/            → catálogos AFP, sistemas de salud, mutuales
├── employee/             → datos maestros del empleado (extendido)
├── contratos/            → contratos laborales y anexos
├── liquidaciones/        → liquidaciones mensuales + libro remuneraciones
├── anticipos/            → anticipos de sueldo
├── ausencias/            → vacaciones, licencias médicas, permisos
├── finiquitos/           → finiquitos con cálculo automático
└── documentos-empleado/  → documentos, cuentas bancarias, cargas familiares
```

**Patrón por módulo:** `Controller → Service → Repository → Prisma`

**Dependencias entre módulos:**

```
Departamentos ←── Employees ──→ AFP
     ↓                ↓          ↓
   Cargos         Contratos ←── Liquidaciones
                      ↓              ↓
                  Finiquitos    LibroRemuneraciones
```

**Orden recomendado para poblar datos (seed):**

1. AFP, SistemasSalud, Mutuales
2. Departamentos → Cargos
3. Employees (con cargoId, afpId, etc.)
4. Contratos
5. TiposItemLiquidacion (seed de ítems legales)
6. Liquidaciones, Vacaciones, etc.

---

## Departamentos y Cargos

### `GET /departamentos`

Retorna todos los departamentos con sus cargos asociados.

**Response `200`:**
```json
[
  {
    "id": 1,
    "nombre": "Operaciones",
    "cargos": [
      { "id": 1, "nombre": "Supervisor de turno", "departamentoId": 1 }
    ],
    "createdAt": "2026-06-25T00:00:00.000Z",
    "updatedAt": "2026-06-25T00:00:00.000Z"
  }
]
```

### `POST /departamentos`

**Body:**
```json
{ "nombre": "Operaciones" }
```

**Response `201`:** objeto `Departamentos` creado.

### `GET /departamentos/:id` | `PATCH /departamentos/:id` | `DELETE /departamentos/:id`

CRUD estándar. `DELETE` elimina en duro (verificar que no tenga empleados asignados antes de borrar).

---

### `GET /cargos?departamentoId=1`

Lista cargos. El query param `departamentoId` es opcional para filtrar por departamento.

**Response `200`:**
```json
[
  {
    "id": 1,
    "nombre": "Supervisor de turno",
    "departamentoId": 1,
    "departamento": { "id": 1, "nombre": "Operaciones" }
  }
]
```

### `POST /cargos`

**Body:**
```json
{ "nombre": "Supervisor de turno", "departamentoId": 1 }
```

### `GET /cargos/:id` | `PATCH /cargos/:id` | `DELETE /cargos/:id`

CRUD estándar.

---

## Previsión

### AFP

#### `GET /prevision/afp`

Lista todas las AFP ordenadas alfabéticamente.

**Response `200`:**
```json
[
  { "id": 1, "nombre": "Habitat", "tasaCotizacion": "0.1057" },
  { "id": 2, "nombre": "PlanVital", "tasaCotizacion": "0.1127" },
  { "id": 3, "nombre": "ProVida", "tasaCotizacion": "0.1049" }
]
```

> `tasaCotizacion` es la tasa total que descuenta la AFP (varía según institución). El campo es `Decimal(5,4)` — ej. `0.1057` representa 10,57%.

#### `POST /prevision/afp`

**Body:**
```json
{ "nombre": "Habitat", "tasaCotizacion": 0.1057 }
```

#### `GET /prevision/afp/:id` | `PATCH /prevision/afp/:id` | `DELETE /prevision/afp/:id`

CRUD estándar.

---

### Sistemas de Salud

#### `GET /prevision/sistemas-salud`

**Response `200`:**
```json
[
  { "id": 1, "tipo": "FONASA", "nombre": "FONASA" },
  { "id": 2, "tipo": "ISAPRE", "nombre": "Banmédica" }
]
```

#### `POST /prevision/sistemas-salud`

**Body:**
```json
{ "tipo": "FONASA", "nombre": "FONASA" }
```

> `tipo` acepta solo `"FONASA"` o `"ISAPRE"`.

---

### Mutuales

#### `GET /prevision/mutuales`

**Response `200`:**
```json
[
  { "id": 1, "nombre": "ACHS" },
  { "id": 2, "nombre": "IST" },
  { "id": 3, "nombre": "Mutual de Seguridad" }
]
```

#### `POST /prevision/mutuales`

**Body:**
```json
{ "nombre": "ACHS" }
```

---

## Empleados

El modelo `Employees` fue extendido con los siguientes campos nuevos. El CRUD base sigue en `/employee`.

### Campos nuevos en `CreateEmployeeDto`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `hireDate` | `string (ISO date)` | Sí | Fecha de ingreso — ahora es `Date` en la BD |
| `fechaNacimiento` | `string (ISO date)` | No | Fecha de nacimiento |
| `estadoCivil` | `enum EstadoCivil` | No | `SOLTERO \| CASADO \| DIVORCIADO \| VIUDO \| CONVIVIENTE_CIVIL` |
| `cargoId` | `number` | No | FK a `Cargos` |
| `departamentoId` | `number` | No | FK a `Departamentos` |
| `afpId` | `number` | No | FK a `AFP` |
| `sistemasSaludId` | `number` | No | FK a `SistemasSalud` |
| `mutualId` | `number` | No | FK a `Mutuales` |
| `jefeId` | `number` | No | FK a otro `Employees` (auto-relación jefe/subordinado) |

### `POST /employee` — ejemplo completo

**Body:**
```json
{
  "rut": "12.345.678-9",
  "fullname": "Juan Pérez González",
  "email": "juan.perez@empresa.cl",
  "salary": 850000,
  "hireDate": "2024-03-01",
  "fechaNacimiento": "1990-05-15",
  "estadoCivil": "CASADO",
  "cargoId": 1,
  "departamentoId": 1,
  "afpId": 1,
  "sistemasSaludId": 1,
  "mutualId": 1,
  "direccionPrincipal": {
    "calle": "Av. Providencia",
    "numero": "1234",
    "communeId": 10
  }
}
```

### `GET /employee/:id` — response con relaciones

```json
{
  "id": 1,
  "rut": "12.345.678-9",
  "fullname": "Juan Pérez González",
  "hireDate": "2024-03-01T00:00:00.000Z",
  "cargo": { "id": 1, "nombre": "Supervisor de turno" },
  "departamento": { "id": 1, "nombre": "Operaciones" },
  "afp": { "id": 1, "nombre": "Habitat", "tasaCotizacion": "0.1057" },
  "sistemasSalud": { "id": 1, "tipo": "FONASA", "nombre": "FONASA" },
  "mutual": { "id": 1, "nombre": "ACHS" },
  "direccion": { "calle": "Av. Providencia", "numero": "1234" }
}
```

---

## Contratos

### `POST /contratos`

Crea un contrato laboral para un empleado.

**Body:**
```json
{
  "employeeId": 1,
  "tipoContrato": "INDEFINIDO",
  "sueldoBase": 850000,
  "gratificacion": "ART_50",
  "jornada": 40,
  "fechaInicio": "2024-03-01"
}
```

**Enums:**
- `tipoContrato`: `INDEFINIDO | PLAZO_FIJO | OBRA_O_FAENA`
- `gratificacion`: `ART_47 | ART_50`
  - `ART_50`: 25% mensual del sueldo base, tope 4,75 IMM ÷ 12 (se usa en liquidaciones)
  - `ART_47`: 30% de las utilidades anuales (se paga anualmente)
- `jornada`: horas semanales, máx 40 (Ley 21.561)

**Response `201`:**
```json
{
  "id": 1,
  "employeeId": 1,
  "tipoContrato": "INDEFINIDO",
  "sueldoBase": "850000.00",
  "gratificacion": "ART_50",
  "jornada": 40,
  "fechaInicio": "2024-03-01T00:00:00.000Z",
  "fechaTermino": null,
  "estado": "ACTIVO",
  "employee": { "id": 1, "fullname": "Juan Pérez González", "rut": "12.345.678-9" },
  "anexos": []
}
```

### `GET /contratos?employeeId=1`

Lista contratos. Filtrar por empleado con `?employeeId=N`.

### `PATCH /contratos/:id`

Actualiza un contrato (ej: cambiar estado a `TERMINADO` al generar un finiquito).

**Body (parcial):**
```json
{ "estado": "TERMINADO", "fechaTermino": "2026-06-30" }
```

**Estados:** `ACTIVO | TERMINADO | SUSPENDIDO`

### `POST /contratos/:id/anexos`

Agrega un anexo al contrato (modificación de condiciones).

**Body:**
```json
{
  "contratoId": 1,
  "descripcion": "Modificación de sueldo base a $950.000 a partir del 01/07/2026",
  "fechaVigencia": "2026-07-01",
  "urlDocumento": "https://storage.empresa.cl/anexos/anexo-001.pdf"
}
```

### `GET /contratos/:id/anexos`

Lista todos los anexos de un contrato, ordenados por fecha de vigencia descendente.

---

## Liquidaciones

El endpoint `POST /liquidaciones` calcula automáticamente la liquidación completa a partir del contrato activo del empleado.

### Seed requerido: Tipos de Ítem

Para que el cálculo registre los ítems correctamente, deben existir `TiposItemLiquidacion` con nombres que contengan las palabras clave `sueldo`, `afp`, `salud`, `afc`.

```bash
# Seed de tipos de ítem legales
POST /liquidaciones/tipos-item
{ "nombre": "Sueldo Base", "tipo": "HABER", "esLegal": true }
{ "nombre": "Descuento AFP", "tipo": "DESCUENTO", "esLegal": true }
{ "nombre": "Descuento Salud (7%)", "tipo": "DESCUENTO", "esLegal": true }
{ "nombre": "Descuento AFC", "tipo": "DESCUENTO", "esLegal": true }
```

### `POST /liquidaciones`

**Body:**
```json
{ "employeeId": 1, "periodo": "2026-06-01" }
```

> `periodo` debe ser el primer día del mes (ej. `2026-06-01` para junio 2026).

**Qué calcula internamente:**

| Concepto | Fórmula |
|---|---|
| Gratificación (Art.50) | `min(sueldoBase × 25%, 4.75 × IMM ÷ 12)` |
| Total Haberes | `sueldoBase + gratificacion` |
| Descuento AFP | `baseImponible × tasaCotizacion` (de la AFP asignada) |
| Descuento Salud | `baseImponible × 7%` |
| Descuento AFC | `baseImponible × 0.6%` (solo contrato `INDEFINIDO`) |
| Anticipos | suma de anticipos no descontados del mismo mes |
| Total Descuentos | `AFP + salud + AFC + anticipos` |
| Líquido a Pagar | `totalHaberes − totalDescuentos` |

Los anticipos del periodo se marcan automáticamente como `descontado: true` al crear la liquidación.

**Response `201`:**
```json
{
  "id": 1,
  "employeeId": 1,
  "periodo": "2026-06-01T00:00:00.000Z",
  "sueldoBase": "850000.00",
  "totalHaberes": "944375.00",
  "totalDescuentos": "163492.13",
  "liquidoAPagar": "780882.87",
  "estado": "BORRADOR",
  "employee": { "id": 1, "fullname": "Juan Pérez González" },
  "items": [
    { "tipoItem": { "nombre": "Sueldo Base", "tipo": "HABER" }, "monto": "850000.00" },
    { "tipoItem": { "nombre": "Descuento AFP", "tipo": "DESCUENTO" }, "monto": "89887.25" },
    { "tipoItem": { "nombre": "Descuento Salud (7%)", "tipo": "DESCUENTO" }, "monto": "66106.25" },
    { "tipoItem": { "nombre": "Descuento AFC", "tipo": "DESCUENTO" }, "monto": "5666.25" }
  ]
}
```

### `GET /liquidaciones?employeeId=1`

Historial de liquidaciones del empleado.

### `GET /liquidaciones/:id`

Detalle con ítems completos.

### `PATCH /liquidaciones/:id/estado`

Ciclo de vida: `BORRADOR → EMITIDA → PAGADA`

**Body:**
```json
{ "estado": "EMITIDA" }
```

### `GET /liquidaciones/libro/:periodo`

Libro de remuneraciones del mes. Retorna todos los empleados liquidados en ese periodo.

**Ejemplo:** `GET /liquidaciones/libro/2026-06-01`

**Response `200`:**
```json
[
  {
    "id": 1,
    "periodo": "2026-06-01T00:00:00.000Z",
    "totalImponible": "944375.00",
    "liquido": "780882.87",
    "employee": { "id": 1, "fullname": "Juan Pérez González", "rut": "12.345.678-9" },
    "liquidacion": { "id": 1, "estado": "PAGADA" }
  }
]
```

### `GET /liquidaciones/tipos-item` | `POST /liquidaciones/tipos-item`

Gestión del catálogo de tipos de ítem (haberes y descuentos).

---

## Anticipos

### `POST /anticipos`

**Body:**
```json
{
  "employeeId": 1,
  "monto": 150000,
  "fecha": "2026-06-15"
}
```

> Los anticipos del mes se descuentan automáticamente al generar la liquidación del mismo mes.

### `GET /anticipos?employeeId=1`

Lista todos los anticipos del empleado (descontados y pendientes).

### `GET /anticipos/pendientes/:employeeId`

Lista solo los anticipos aún no descontados del empleado.

**Response `200`:**
```json
[
  {
    "id": 1,
    "employeeId": 1,
    "monto": "150000.00",
    "fecha": "2026-06-15T00:00:00.000Z",
    "descontado": false
  }
]
```

### `DELETE /anticipos/:id`

Elimina un anticipo (solo si aún no fue descontado — verificar manualmente antes).

---

## Ausencias

Todos los recursos de ausencias siguen el mismo ciclo: `POST` para crear (estado inicial `PENDIENTE`) y `PATCH /:id/estado` para aprobar o rechazar.

### Vacaciones

#### `POST /ausencias/vacaciones`

**Body:**
```json
{
  "employeeId": 1,
  "tipo": "LEGAL",
  "fechaInicio": "2026-07-14",
  "fechaFin": "2026-08-01",
  "diasHabiles": 15
}
```

**Tipos:** `LEGAL | PROGRESIVA | ADICIONAL`

> `diasHabiles` debe calcularse en el frontend/cliente (excluir sábados, domingos y feriados).

#### `GET /ausencias/vacaciones?employeeId=1`

Lista solicitudes del empleado.

#### `PATCH /ausencias/vacaciones/:id/estado`

**Body:**
```json
{ "estado": "APROBADA" }
```

**Estados:** `PENDIENTE | APROBADA | RECHAZADA`

---

### Licencias Médicas

#### `POST /ausencias/licencias`

**Body:**
```json
{
  "employeeId": 1,
  "tipo": "ENFERMEDAD",
  "entidad": "COMPIN",
  "fechaInicio": "2026-06-20",
  "fechaFin": "2026-06-27",
  "dias": 7,
  "urlDocumento": "https://storage.empresa.cl/licencias/lic-001.pdf"
}
```

**Tipos licencia:** `ENFERMEDAD | MATERNIDAD | PATERNIDAD | ACCIDENTE_LABORAL | OTRO`
**Entidad:** `COMPIN | ISAPRE`

#### `GET /ausencias/licencias?employeeId=1`

#### `PATCH /ausencias/licencias/:id/estado`

---

### Permisos

#### `POST /ausencias/permisos`

**Body:**
```json
{
  "employeeId": 1,
  "tipo": "ADMINISTRATIVO",
  "conGoce": true,
  "fechaInicio": "2026-06-26",
  "fechaFin": "2026-06-26",
  "motivo": "Trámite notarial"
}
```

**Tipos:** `ADMINISTRATIVO | SINDICAL | OTRO`
**`conGoce`:** `true` = con goce de sueldo, `false` = sin goce.

#### `GET /ausencias/permisos?employeeId=1`

#### `PATCH /ausencias/permisos/:id/estado`

---

## Finiquitos

El endpoint `POST /finiquitos` calcula automáticamente el monto del finiquito según la causal y la antigüedad del empleado.

### `POST /finiquitos`

**Body:**
```json
{
  "employeeId": 1,
  "causal": "ART_161",
  "fechaTermino": "2026-06-30"
}
```

**Causales (Código del Trabajo):**

| Causal | Descripción | Genera indemnización |
|---|---|---|
| `ART_159_1` | Mutuo acuerdo de las partes | No |
| `ART_159_2` | Vencimiento del plazo convenido | No |
| `ART_159_4` | Conclusión del trabajo o servicio | No |
| `ART_160` | Causal imputable al trabajador | No |
| `ART_161` | Necesidades de la empresa | **Sí** |

**Cálculo automático:**

| Concepto | Fórmula |
|---|---|
| Feriado proporcional | `(días trabajados en el año / 365) × 15 × (sueldoBase / 30)` |
| Indemnización (solo Art.161) | `min(años de servicio, 11) × sueldoBase` |
| Total finiquito | `feriadoProporcional + indemnizacion` |

**Response `201`:**
```json
{
  "id": 1,
  "employeeId": 1,
  "causal": "ART_161",
  "fechaTermino": "2026-06-30T00:00:00.000Z",
  "feriadoProporcional": "340277.78",
  "indemnizacion": "2125000.00",
  "totalFiniquito": "2465277.78",
  "estado": "BORRADOR",
  "employee": { "id": 1, "fullname": "Juan Pérez González", "rut": "12.345.678-9" }
}
```

### `GET /finiquitos?employeeId=1`

### `GET /finiquitos/:id`

### `PATCH /finiquitos/:id/estado`

**Ciclo:** `BORRADOR → FIRMADO → PAGADO`

**Body:**
```json
{ "estado": "FIRMADO" }
```

---

## Documentos Empleado

Recursos anidados bajo `/empleados/:employeeId/...`

### Documentos

#### `POST /empleados/:employeeId/documentos`

**Body:**
```json
{
  "tipo": "CONTRATO",
  "url": "https://storage.empresa.cl/docs/contrato-001.pdf",
  "nombre": "Contrato Indefinido Juan Pérez"
}
```

**Tipos:** `CONTRATO | CEDULA_IDENTIDAD | CERTIFICADO_ESTUDIOS | CERTIFICADO_AFP | ANEXO | FINIQUITO | OTRO`

#### `GET /empleados/:employeeId/documentos`

#### `DELETE /empleados/:employeeId/documentos/:id`

---

### Cuentas Bancarias

#### `POST /empleados/:employeeId/cuentas-bancarias`

**Body:**
```json
{
  "banco": "Banco de Chile",
  "tipoCuenta": "CUENTA_CORRIENTE",
  "numeroCuenta": "00123456789",
  "esPrincipal": true
}
```

**Tipos de cuenta:** `CUENTA_CORRIENTE | CUENTA_VISTA | CUENTA_AHORRO`

#### `GET /empleados/:employeeId/cuentas-bancarias`

Retorna las cuentas ordenadas: la principal primero.

#### `DELETE /empleados/:employeeId/cuentas-bancarias/:id`

---

### Cargas Familiares

#### `POST /empleados/:employeeId/cargas-familiares`

**Body:**
```json
{
  "rut": "23.456.789-0",
  "nombre": "María Pérez González",
  "parentesco": "HIJO",
  "fechaNacimiento": "2015-08-20"
}
```

**Parentescos:** `CONYUGE | HIJO | PADRE | MADRE | OTRO`

#### `GET /empleados/:employeeId/cargas-familiares`

#### `DELETE /empleados/:employeeId/cargas-familiares/:id`

---

## Flujo Completo

### Alta de empleado (contratación)

```
1. POST /prevision/afp          → crear AFP (si no existe)
2. POST /prevision/sistemas-salud → crear sistema de salud
3. POST /prevision/mutuales     → crear mutual
4. POST /departamentos          → crear departamento
5. POST /cargos                 → crear cargo en ese departamento
6. POST /employee               → crear empleado con cargoId, afpId, etc.
7. POST /contratos              → crear contrato (tipo, sueldo, jornada)
8. POST /empleados/:id/cuentas-bancarias → registrar cuenta para pago
9. POST /empleados/:id/documentos → subir contrato firmado
```

### Ciclo mensual de remuneraciones

```
1. (Opcional) POST /anticipos   → registrar anticipos del mes
2. POST /liquidaciones          → generar liquidación (calcula todo automáticamente)
3. GET  /liquidaciones/:id      → revisar detalle
4. PATCH /liquidaciones/:id/estado { "estado": "EMITIDA" }
5. [Pago por Previred u otro medio]
6. PATCH /liquidaciones/:id/estado { "estado": "PAGADA" }
7. GET  /liquidaciones/libro/YYYY-MM-01 → descargar libro del mes
```

### Gestión de ausencias

```
1. POST /ausencias/vacaciones   → empleado solicita vacaciones
2. PATCH /ausencias/vacaciones/:id/estado { "estado": "APROBADA" }

1. POST /ausencias/licencias    → registrar licencia médica
2. PATCH /ausencias/licencias/:id/estado { "estado": "APROBADA" }
```

### Desvinculación (finiquito)

```
1. POST /finiquitos             → genera cálculo automático según causal
2. Revisar y ajustar si es necesario
3. PATCH /finiquitos/:id/estado { "estado": "FIRMADO" }
4. PATCH /contratos/:id        { "estado": "TERMINADO", "fechaTermino": "YYYY-MM-DD" }
5. PATCH /finiquitos/:id/estado { "estado": "PAGADO" }
6. POST /empleados/:id/documentos → subir finiquito firmado
7. PATCH /employee/:id         { "available": false }
```

---

## Lógica de Negocio

### Constantes (actualizar según DT/SII)

| Constante | Valor | Fuente |
|---|---|---|
| IMM (Ingreso Mínimo Mensual) | $500.000 | Decreto DT 2024 |
| Tasa salud | 7% | Art. 85 DFL-1 |
| Tasa AFC contrato indefinido | 0.6% | Ley 19.728 |
| Tope gratificación Art.50 | 4.75 × IMM | CT Art. 50 |
| Máximo jornada semanal | 40h | Ley 21.561 |
| Días hábiles vacaciones | 15 | CT Art. 67 |
| Tope indemnización | 11 meses | CT Art. 163 |

> La constante `IMM` está definida en [src/liquidaciones/liquidaciones.service.ts](../src/liquidaciones/liquidaciones.service.ts). Actualizar cuando cambie el valor legal.

### Tasa AFP

La `tasaCotizacion` se obtiene del registro `AFP` asignado al empleado. Si el empleado no tiene AFP asignada, se usa `10%` como fallback. Las tasas reales varían por institución (ver SII/previred para valores actualizados).

### Saldo de vacaciones

```
diasDisponibles = floor((meses_trabajados × 15) / 12)
saldo           = diasDisponibles − diasUsados(estado=APROBADA)
```

> El endpoint `GET /ausencias/vacaciones?employeeId=N` retorna el listado de solicitudes. El cálculo de saldo está disponible en el servicio como método interno — exponer como endpoint si es necesario.

---

## Enums de referencia

```typescript
// Contratos
TipoContrato:     INDEFINIDO | PLAZO_FIJO | OBRA_O_FAENA
TipoGratificacion: ART_47 | ART_50
ContratoEstado:   ACTIVO | TERMINADO | SUSPENDIDO

// Empleados
EstadoCivil: SOLTERO | CASADO | DIVORCIADO | VIUDO | CONVIVIENTE_CIVIL

// Liquidaciones
LiquidacionEstado:       BORRADOR | EMITIDA | PAGADA
TipoItemLiquidacionEnum: HABER | DESCUENTO

// Ausencias
TipoVacaciones:  LEGAL | PROGRESIVA | ADICIONAL
TipoLicencia:    ENFERMEDAD | MATERNIDAD | PATERNIDAD | ACCIDENTE_LABORAL | OTRO
EntidadLicencia: COMPIN | ISAPRE
TipoPermiso:     ADMINISTRATIVO | SINDICAL | OTRO
EstadoSolicitud: PENDIENTE | APROBADA | RECHAZADA

// Finiquitos
CausalFiniquito: ART_159_1 | ART_159_2 | ART_159_4 | ART_160 | ART_161
FiniquitoEstado: BORRADOR | FIRMADO | PAGADO

// Documentos
TipoDocEmpleado: CONTRATO | CEDULA_IDENTIDAD | CERTIFICADO_ESTUDIOS |
                 CERTIFICADO_AFP | ANEXO | FINIQUITO | OTRO

// Cuentas bancarias
TipoCuentaBancaria: CUENTA_CORRIENTE | CUENTA_VISTA | CUENTA_AHORRO

// Cargas familiares
Parentesco: CONYUGE | HIJO | PADRE | MADRE | OTRO
```
