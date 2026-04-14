# Figma Blueprint (Web + Mobile) — Gestión Backend

This document is a **ready-to-build Figma specification** for your current backend scope.
It maps 1:1 with the modules in `src/` and Postman collections in `postman/`.

---

## 1) Product scope detected from backend

### Core modules
- Auth (`/auth/login`, `/auth/refresh`)
- Users (`/users`)
- Clients (`/client`)
- Employees (`/employee`)
- Products (`/product`)
- Bills (`/bill`)
- Bill Details (`/bill-details`)
- Sales Sheet (`/sales-sheet`)
- Details Sales Sheet (`/details-sales-sheet`)

### Common patterns
- JWT protected app (except login)
- CRUD in all modules
- Pagination in list views (`page`, `limit`)
- Mostly admin/backoffice behavior

---

## 2) Figma file structure

Create one Figma file with 4 pages:

1. `00_Foundations`
2. `01_Web`
3. `02_Mobile`
4. `03_Prototype`

### 00_Foundations
- Color styles (Primary, Success, Warning, Error, Neutral)
- Text styles (H1, H2, H3, Body, Caption)
- Spacing scale (4, 8, 12, 16, 24, 32)
- Components:
  - Buttons (primary, secondary, danger)
  - Input (text, email, password, number, date)
  - Select
  - Checkbox / switch
  - Table row
  - Status badge (active/inactive)
  - Pagination control
  - Toast/alert
  - Modal confirmation (delete)

---

## 3) Web views (Desktop)

Use frame width around 1440px. Layout: left sidebar + topbar + content area.

### Global navigation (sidebar)
1. Dashboard
2. Users
3. Clients
4. Employees
5. Products
6. Bills
7. Bill Details
8. Sales Sheets
9. Sales Details
10. Settings / Profile

### Web screen inventory

#### A. Authentication
1. `WEB-Auth-Login`
   - Fields: email, password
   - Actions: Sign in
   - Secondary: “Forgot password” placeholder

#### B. Dashboard
2. `WEB-Dashboard`
   - KPI cards: total clients, products, employees, sales sheets
   - Recent activity table
   - Quick actions: Create Client, Create Product, Create Sales Sheet

#### C. Generic CRUD module template (reuse component)
For each module (`Users`, `Clients`, `Employees`, `Products`, `Bills`, `Bill Details`, `Sales Sheets`, `Sales Details`) create these 4 views:

3. `WEB-[Module]-List`
   - Search input
   - Primary button: Create
   - Table with columns specific to module
   - Row actions: View, Edit, Delete
   - Pagination (`page`, `limit`)

4. `WEB-[Module]-Create`
   - Form fields by DTO (see section 5)
   - Actions: Cancel, Save

5. `WEB-[Module]-Detail`
   - Read-only summary cards
   - Metadata (`createdAt`, `updatedAt` when available)
   - Optional related records list

6. `WEB-[Module]-Edit`
   - Same as create, prefilled values
   - Actions: Cancel, Save changes

7. `WEB-Delete-Confirmation` (shared modal)
   - Message + record name/id
   - Actions: Cancel / Delete

> Total web frames (minimum): 1 login + 1 dashboard + (8 modules × 4 views) + shared modal = **35+ frames**.

---

## 4) Mobile views

Use frame size around 390x844 (iPhone-like). Pattern: bottom tabs + stack navigation.

### Bottom tab proposal
1. Home
2. Sales
3. Catalog
4. People
5. More

### Mobile screen inventory

#### A. Authentication
1. `MOB-Auth-Login`
   - Email, password, sign in

#### B. Home
2. `MOB-Home`
   - KPI mini cards
   - Quick actions shortcuts
   - Recent items list

#### C. Entity list/detail/edit patterns
For each entity, keep mobile-optimized flow:

3. `MOB-[Module]-List`
   - Search bar
   - Card list (instead of large table)
   - Floating action button (+)

4. `MOB-[Module]-Create`
   - Vertical form

5. `MOB-[Module]-Detail`
   - Sectioned cards
   - Edit / Delete buttons

6. `MOB-[Module]-Edit`
   - Prefilled form

7. `MOB-Delete-Confirmation`
   - Bottom sheet confirm

> Total mobile frames (minimum): same structure as web, with card-based list UIs.

---

## 5) Exact fields per form (from DTOs)

Use these fields exactly in Figma forms:

### Login
- `email`
- `password`

### Users
- `email` (email)
- `fullName` (text)
- `password` (password)
- `imagen` (text/url or upload helper)
- `rol` (number/select role)
- `isActive` (boolean switch)
- `isLoged` (boolean switch)

### Clients
- `fullname`
- `city`
- `address`
- `zone`
- `phone`
- `email`

### Employees
- `rut`
- `fullname`
- `email`
- `salary` (number)
- `hireDate` (date)
- `city`
- `address`
- `type` (enum: `ADMINISTRADOR`, `REPARTIDOR`, `COMUN`)

### Products
- `name`
- `description`
- `quantity` (number)
- `img`
- `code`
- `available` (boolean)

### Bills
- `name`

### Bill Details
- `amount` (number)
- `date` (date/time)
- `billsId` (relation select)

### Sales Sheet
- `employeeId` (relation select)
- `date` (date/time)
- `description` (textarea)
- `billId` (relation select)

### Details Sales Sheet
- `clientsId` (relation select)
- `productsId` (relation select)
- `quantity` (number)
- `discount` (number)
- `salesSheetId` (relation select)

---

## 6) Key interactions for prototype (03_Prototype)

Build at least these clickable flows:

1. Login → Dashboard
2. Dashboard → Products List → Create Product → Save → Products List
3. Dashboard → Clients List → Client Detail → Edit → Save
4. Sales Sheet List → Create Sales Sheet → Add Detail Sales Sheet
5. Bills List → Bill Detail → Create Bill Detail
6. Any list row → Delete → Confirm modal/sheet

---

## 7) Suggested data table columns (Web)

### Users
- id, fullName, email, rol, isActive, isLoged, updatedAt

### Clients
- id, fullname, city, phone, email, available

### Employees
- id, rut, fullname, email, salary, hireDate, type, available

### Products
- id, name, code, quantity, available

### Bills
- id, name, createdAt

### Bill Details
- id, amount, date, billsId

### Sales Sheets
- id, employeeId, date, billId

### Details Sales Sheet
- id, clientsId, productsId, quantity, discount, salesSheetId

---

## 8) Figma execution checklist

- [ ] Create page/frame naming exactly as above
- [ ] Create reusable CRUD components first
- [ ] Build web screens with table pattern
- [ ] Build mobile screens with card + FAB pattern
- [ ] Add prototype links for 6 key flows
- [ ] Add annotations with API endpoint per screen

---

## 9) Endpoint tags for annotations

Use these labels in small notes inside each screen:

- `POST /auth/login`
- `POST /auth/refresh`
- `GET|POST|PATCH|DELETE /users`
- `GET|POST|PATCH|DELETE /client`
- `GET|POST|PATCH|DELETE /employee`
- `GET|POST|PATCH|DELETE /product`
- `GET|POST|PATCH|DELETE /bill`
- `GET|POST|PATCH|DELETE /bill-details`
- `GET|POST|PATCH|DELETE /sales-sheet`
- `GET|POST|PATCH|DELETE /details-sales-sheet`

This gives you a full UI architecture to build directly in Figma for both web and mobile.

---

## 10) Ready-to-paste Figma AI prompt

Copy and paste the full block below into Figma AI:

```text
Design a complete admin product UI for a business management system called “Gestión”.

GOAL
- Generate a first-pass high-fidelity UI for Web and Mobile.
- Use modern SaaS backoffice style, clean and professional.
- Keep components reusable and consistent.

FILE STRUCTURE
Create these pages:
1) 00_Foundations
2) 01_Web
3) 02_Mobile
4) 03_Prototype

FOUNDATIONS (00_Foundations)
- Define color styles: Primary, Success, Warning, Error, Neutral.
- Define text styles: H1, H2, H3, Body, Caption.
- Define spacing scale: 4, 8, 12, 16, 24, 32.
- Create reusable components:
   - Buttons (Primary, Secondary, Danger)
   - Inputs (text, email, password, number, date)
   - Select, Checkbox/Switch
   - Table row, Status badge, Pagination
   - Toast/Alert
   - Delete confirmation modal

WEB APP (01_Web)
- Desktop frame width around 1440.
- Main layout: left sidebar + topbar + content area.
- Sidebar nav order:
   1. Dashboard
   2. Users
   3. Clients
   4. Employees
   5. Products
   6. Bills
   7. Bill Details
   8. Sales Sheets
   9. Sales Details
   10. Settings/Profile

Create these web frames:
1) WEB-Auth-Login
2) WEB-Dashboard
3) For each module [Users, Clients, Employees, Products, Bills, Bill Details, Sales Sheets, Sales Details], create:
    - WEB-[Module]-List
    - WEB-[Module]-Create
    - WEB-[Module]-Detail
    - WEB-[Module]-Edit
4) Shared frame: WEB-Delete-Confirmation

WEB LIST RULES
- Include search input, primary “Create” button, table, row actions (View/Edit/Delete), pagination.
- Use realistic sample data in rows.

MOBILE APP (02_Mobile)
- Mobile frame size around 390x844.
- Navigation pattern: bottom tabs + stack navigation.
- Bottom tabs:
   1. Home
   2. Sales
   3. Catalog
   4. People
   5. More

Create these mobile frames:
1) MOB-Auth-Login
2) MOB-Home
3) For each module [Users, Clients, Employees, Products, Bills, Bill Details, Sales Sheets, Sales Details], create:
    - MOB-[Module]-List (card list + search + floating + button)
    - MOB-[Module]-Create
    - MOB-[Module]-Detail
    - MOB-[Module]-Edit
4) Shared frame: MOB-Delete-Confirmation (bottom sheet style)

FORMS (USE EXACT FIELDS)
Login:
- email, password

Users:
- email, fullName, password, imagen, rol, isActive, isLoged

Clients:
- fullname, city, address, zone, phone, email

Employees:
- rut, fullname, email, salary, hireDate, city, address, type (ADMINISTRADOR | REPARTIDOR | COMUN)

Products:
- name, description, quantity, img, code, available

Bills:
- name

Bill Details:
- amount, date, billsId

Sales Sheet:
- employeeId, date, description, billId

Details Sales Sheet:
- clientsId, productsId, quantity, discount, salesSheetId

PROTOTYPE FLOWS (03_Prototype)
Create clickable interactions for:
1. Login -> Dashboard
2. Dashboard -> Products List -> Create Product -> Save -> Products List
3. Dashboard -> Clients List -> Client Detail -> Edit -> Save
4. Sales Sheet List -> Create Sales Sheet -> Add Detail Sales Sheet
5. Bills List -> Bill Detail -> Create Bill Detail
6. Any list row -> Delete -> Confirm

LABELS / ANNOTATIONS
- Add small endpoint notes in each relevant screen:
   - POST /auth/login
   - POST /auth/refresh
   - GET|POST|PATCH|DELETE /users
   - GET|POST|PATCH|DELETE /client
   - GET|POST|PATCH|DELETE /employee
   - GET|POST|PATCH|DELETE /product
   - GET|POST|PATCH|DELETE /bill
   - GET|POST|PATCH|DELETE /bill-details
   - GET|POST|PATCH|DELETE /sales-sheet
   - GET|POST|PATCH|DELETE /details-sales-sheet

VISUAL DIRECTION
- Professional backoffice, clean spacing, clear hierarchy.
- Emphasize readability and data density for web tables.
- Emphasize thumb-friendly controls and card readability for mobile.
- Keep consistency across modules by reusing component variants.
```