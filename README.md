# Travlr Getaways

A full‑stack travel booking application built on the MEAN stack: **MongoDB**, **Express**, **Angular**, and **Node.js**.  
Customers can browse, search, and book trips via a responsive Angular SPA; administrators manage users, trips, and pricing through a secure admin portal.

---

## Table of Contents

1. [Architecture](#architecture)  
2. [Functionality](#functionality)  
3. [Testing](#testing)  
4. [Reflection](#reflection)  

---

## Architecture

### Frontend Approaches

- **Express + Handlebars**  
  - Traditional server‑rendered pages using HBS templates for public pages (e.g. the landing page, trip listings before login).  
  - Pros: SEO‑friendly, simpler initial load.  
  - Cons: Full page reloads on each navigation and less interactivity.

- **Angular SPA**  
  - Client‑side application for the admin portal (and post‑login customer flows).  
  - Uses standalone components, reactive forms, and client‑side routing (`RouterModule`).  
  - Pros: Rich interactivity, faster view transitions, reusable components.  
  - Cons: Initial bundle size and need for proper token management (JWT).

### Why MongoDB (NoSQL)?

- **Schema Flexibility**: Trip packages evolve (adding new fields like “activities” or “difficulty level”) without rigid migrations.  
- **Document Model**: Trips and Users naturally map to JSON documents, simplifying data exchange with the Angular client.  
- **Scalability**: Horizontal scaling across distributed clusters supports growing user and trip volume.

---

## Functionality

### JSON vs. JavaScript

- **JavaScript Objects**  
  - In‑memory data structures, can hold functions, circular references, etc.  
- **JSON (JavaScript Object Notation)**  
  - A text format for serializing data (no functions or prototypes).  
  - Ties frontend and backend: Express serializes Mongoose documents to JSON; Angular `HttpClient` parses JSON into objects.

### Refactoring & Reusability

- **Before**: Duplicate form markup for “Add Trip” and “Edit Trip.”  
- **After**: Created a shared `TripFormComponent` with `@Input()` for initial values and `@Output()` events for submit.  
- **Benefits**:  
  - **DRY** code: one template + logic for both add/edit.  
  - **Consistency**: Uniform validation and styling.  
  - **Maintainability**: Bug fixes or UI tweaks in one place.

---

## Testing

### API Testing & Security Layers

- **Supertest** (Node.js) for integration testing of endpoints:  
  - `POST /api/login` and `/api/register` with valid/invalid credentials.  
  - Protected routes (`/api/trips` POST/PUT/DELETE) with and without JWTs.

- **Postman / Insomnia** for ad hoc manual tests:  
  - Verifying CORS headers (`Access-Control-Allow-Origin`).  
  - Testing preflight (`OPTIONS`) requests and `Authorization` headers.

- **Angular Unit Tests** (Jasmine/Karma):  
  - Mocking `HttpClient` in `AuthenticationService` and `TripDataService`.  
  - Ensuring methods handle success and error cases correctly.

- **Security considerations**:  
  - All mutating endpoints guarded by `express-jwt` and Passport Local Strategy.  
  - Verified that missing or expired tokens yield **401 Unauthorized**.

---

## Reflection

This course and project have significantly advanced my full‑stack development skills:

- **Architectural Fluency**: Designing and implementing a hybrid server‑rendered + SPA architecture.  
- **Security Practices**: JWT authentication, secure cookie/CORS configuration, and best practices for storing tokens.  
- **Modern Angular**: Mastery of standalone components, reactive forms, and Angular CLI productivity.  
- **Backend & Database**: Building a robust Express API, modeling data with Mongoose, and handling asynchronous flows.  
- **Testing Discipline**: Combining unit, integration, and manual testing to ensure reliability across layers.

These competencies—particularly in MEAN‑stack development and security—make me a stronger candidate for roles involving end‑to‑end web applications.

---

## Repository & Deployment

- **GitHub**: [github.com/deni336/travlr-getaways](https://github.com/deni336/cs465-fullstack)  
- **Run Locally**:  
  1. `npm install` in both `/app_api` and `/app_admin`  
  2. Configure `.env` with `MONGODB_URI`, `JWT_SECRET`, and `PORT`  
  3. `npm run seed` to populate sample trips/users  
  4. `npm start` (API on 3000) and `ng serve` (Angular on 4200)

Feel free to explore and reach out with any questions!
