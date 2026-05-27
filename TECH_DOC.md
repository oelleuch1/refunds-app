# Technical Architecture Documentation

## 1. Purpose of This Document

This document describes the technical architecture of the `refunds-app` project.

It does not describe the product specification, business roadmap, or UI design choices.
Its goal is to explain:

- how the project is structured
- how the code is split by responsibility
- how the DDD-style layers are implemented
- how SOLID principles are applied
- how data flows from UI to domain to infrastructure
- how to rebuild a similar project with Vue or React

This document is intentionally framework-agnostic where possible. The current project uses a web component stack, but the architecture described here can be reproduced with React, Vue, or another frontend framework.

---

## 2. High-Level Architecture

This project is a frontend application built as a modular, feature-sliced, DDD-inspired client architecture.

The codebase is organized around:

- application bootstrap in `src/app`
- business features in `src/features`
- cross-cutting shared code in `src/shared`
- global styling in `src/styles`

The architecture follows a layered approach inside each feature:

1. Domain
2. Application
3. Infrastructure
4. Presentation

This is not backend DDD in the full tactical sense with aggregates, domain events, repositories backed by ORM units of work, and command handlers. It is instead a frontend adaptation of DDD principles:

- business concepts are modeled explicitly
- validation rules live in domain value objects and services
- use cases coordinate business actions
- infrastructure is isolated behind ports and interfaces
- UI does not call external services directly

The main objective is to keep the codebase:

- modular
- testable
- replaceable
- understandable
- portable across frameworks

---

## 3. Architectural Style

### 3.1 Main Style Used

The project combines several architectural ideas:

- DDD-inspired layered architecture
- feature-based modularization
- dependency inversion
- clean architecture concepts on the frontend

### 3.2 What This Means in Practice

Each feature owns its own:

- domain model
- use cases
- repository contracts
- infrastructure implementation
- presentation pages and routes

That prevents the application from becoming a flat collection of UI components and API calls.

Instead of structuring code like:

- `components/`
- `services/`
- `pages/`
- `utils/`

the project structures code around business capabilities such as:

- `auth`
- `customers`
- `dashboard`

This is closer to a bounded-context mindset.

---

## 4. Core Architectural Principles

### 4.1 DDD Principles Applied

The project applies the following DDD ideas:

- Ubiquitous language
  Terms like `AuthSession`, `User`, `Customer`, `CustomerRisk`, `CustomerStatus`, `UserRole`, and `Permission` are explicit domain concepts.

- Bounded contexts
  `auth`, `customers`, and `dashboard` are treated as separate functional areas.

- Entities
  Long-lived business objects are represented as classes such as `User`, `AuthSession`, and `Customer`.

- Value objects
  Small immutable validated concepts such as `Email`, `Password`, `UserRole`, `CustomerStatus`, and `CustomerRisk` are modeled separately from primitive strings.

- Domain services
  Validation logic that does not naturally belong to a single entity is extracted, for example `PasswordValidator`.

- Repositories as abstractions
  Use cases depend on repository interfaces, not on networking code.

- Application use cases
  Business actions are expressed as use cases such as `SignInUseCase`, `SignUpUseCase`, `RestoreSessionUseCase`, `SignOutUseCase`, and `GetCustomersUseCase`.

### 4.2 SOLID Principles Applied

#### Single Responsibility Principle

Classes generally have one job:

- value objects validate and encapsulate primitives
- use cases orchestrate a business action
- repositories translate between application and infrastructure
- mappers convert DTOs to domain objects
- datasources talk to Supabase
- pages handle UI state and user interactions

#### Open/Closed Principle

The architecture can be extended by adding:

- new use cases
- new repository methods
- new data sources
- new features

without rewriting the existing core structure.

#### Liskov Substitution Principle

Repository implementations can be swapped as long as they satisfy the application port contracts.

For example, a Supabase-based auth repository could be replaced by:

- a REST API repository
- a GraphQL repository
- a mock repository
- a local storage repository for demos

#### Interface Segregation Principle

Ports are focused:

- `IAuthRepository`
- `ICustomersRepository`

Consumers only depend on the methods they need.

#### Dependency Inversion Principle

High-level business logic depends on abstractions:

- use cases depend on repository interfaces
- repositories depend on datasource implementations
- UI depends on use cases rather than infrastructure

This is one of the strongest architectural characteristics in the project.

---

## 5. Folder Structure

### 5.1 Root Structure

```text
refunds-app/
+-- public/
+-- src/
|   +-- app/
|   +-- features/
|   |   +-- auth/
|   |   +-- customers/
|   |   \-- dashboard/
|   +-- shared/
|   |   +-- application/
|   |   +-- domain/
|   |   +-- infrastructure/
|   |   \-- presentation/
|   \-- styles/
+-- DOCUMENTATION.md
+-- TECH_DOC.md
+-- package.json
+-- tsconfig.json
+-- vite.config.ts
\-- vitest.config.ts
```

### 5.2 `src/app`

The `app` folder contains composition root and application bootstrap concerns.

- `app.ts`
  Root application shell. Initializes routing, restores session state, selects authenticated vs unauthenticated layout, and provides global state and use cases.

- `app.router.ts`
  Central route registration and navigation abstraction.

- `dependencies.ts`
  Manual dependency injection module. Instantiates datasources, repositories, and use cases.

This folder is the place where the whole system is wired together.

### 5.3 `src/features`

This folder contains business modules.

Each feature follows a layered split:

- `domain/`
- `application/`
- `infrastructure/`
- `presentation/`

#### `src/features/auth`

Authentication and session management bounded context.

Contains:

- user identity and roles
- permission model
- password rules
- session restoration
- sign in, sign up, and sign out flows

#### `src/features/customers`

Customer search and list bounded context.

Contains:

- customer domain entity
- customer status and risk types
- paginated customer retrieval
- mapping from remote records to domain entities

#### `src/features/dashboard`

Dashboard presentation bounded context.

At the moment this feature is mostly presentation-only. It does not yet expose its own domain, application, or infrastructure layers because its data is currently static in the page component.

This is an important architectural detail:

- `auth` and `customers` are layered features
- `dashboard` is currently a presentation-only feature

### 5.4 `src/shared`

This folder contains cross-cutting concerns reused across multiple features.

#### `shared/domain`

Contains domain concepts shared by multiple bounded contexts.

Current example:

- `value-objects/email.ts`

`Email` is shared because both authentication and customers use it.

#### `shared/application`

Contains application-level reusable primitives.

Current examples:

- `use-cases/base-use-case.ts`
- `models/pagination.ts`

#### `shared/infrastructure`

Contains infrastructure utilities shared across features.

Current examples:

- Supabase client creation
- paginated response DTOs
- generic pagination mapper

#### `shared/presentation`

Contains shared UI composition and cross-feature presentation state.

Current examples:

- global state context
- use case context
- authenticated layout
- unauthenticated layout
- sidebar
- icon adapter

### 5.5 `src/styles`

Contains styling system files:

- `index.css`
- `tailwind-styles.ts`

This is a delivery mechanism for global styles and design tokens, not a business layer.

---

## 6. Feature Layer Breakdown

Each non-trivial feature is split using the following layer model.

### 6.1 Domain Layer

The domain layer contains:

- entities
- value objects
- domain services
- domain rules

Characteristics:

- no UI logic
- no framework logic
- no remote API logic
- no direct dependency on Supabase

Examples:

- `User`
- `AuthSession`
- `Customer`
- `Email`
- `Password`
- `UserRole`
- `CustomerStatus`
- `CustomerRisk`
- `Permission`
- `PasswordValidator`

This layer should represent pure business meaning.

### 6.2 Application Layer

The application layer contains:

- use cases
- ports and interfaces
- request and response orchestration

Characteristics:

- coordinates domain objects
- invokes repository contracts
- contains no transport details
- contains no UI rendering details

Examples:

- `IAuthRepository`
- `ICustomersRepository`
- `SignInUseCase`
- `SignUpUseCase`
- `RestoreSessionUseCase`
- `SignOutUseCase`
- `GetCustomersUseCase`

The application layer is the main API that the UI should call.

### 6.3 Infrastructure Layer

The infrastructure layer contains:

- remote datasource implementations
- DTO definitions
- mappers
- repository implementations
- Supabase integration

Characteristics:

- knows about external service formats
- translates remote data into domain models
- isolates third-party SDK calls

Examples:

- `AuthRemoteDatasource`
- `CustomersRemoteDatasource`
- `AuthRepository`
- `CustomersRepository`
- `AuthSessionMapper`
- `CustomersMapper`

### 6.4 Presentation Layer

The presentation layer contains:

- pages
- route configuration
- layouts
- local UI state
- event handling

Characteristics:

- reads state from app-level providers
- invokes use cases
- does not build domain objects manually except through use case inputs
- should not contain raw Supabase calls

Examples:

- login page
- register page
- forgot password page
- customers page
- dashboard page
- route definitions

---

## 7. Dependency Direction

The intended dependency flow is:

```text
Presentation -> Application -> Domain
Presentation -> Application -> Infrastructure (only through composed instances)
Infrastructure -> Domain
Infrastructure -> Shared Infrastructure
Application -> Domain
App Composition Root -> Everything
```

A clearer runtime view is:

```text
Page or UI
  -> Use Case
    -> Repository Interface
      -> Repository Implementation
        -> Remote Datasource
          -> Supabase SDK
        -> Mapper
          -> Domain Entity or Value Object
```

Important rules:

- presentation never talks directly to Supabase
- use cases never know about Supabase
- domain never knows about UI or transport

---

## 8. Composition Root and Dependency Injection

The system is wired manually in `src/app/dependencies.ts`.

This file creates concrete instances in this order:

1. remote datasource
2. repository implementation
3. use case

Current wiring:

- `AuthRemoteDatasource -> AuthRepository -> auth use cases`
- `CustomersRemoteDatasource -> CustomersRepository -> customers use case`

This is effectively a manual dependency injection container.

Advantages:

- simple
- explicit
- easy to trace
- no dependency injection framework required

Tradeoff:

- as the app grows, this file can become large
- module-based composition files may eventually be cleaner

For React or Vue, keep the same pattern:

- create a `dependencies.ts`
- instantiate services once
- expose them through context, inject and provide, or a composable wrapper

---

## 9. App Shell Responsibilities

The root application shell is responsible for global orchestration.

Its responsibilities are:

- initialize the router
- restore the auth session on startup
- store app-level session state
- expose use cases to presentation
- expose state mutation actions
- select authenticated or unauthenticated layout depending on route
- redirect unauthenticated users to login when required

This means the root shell is not a business module. It is the application coordinator.

### 9.1 Global App State

Global state shape:

- `session: AuthSession | null`
- `isRestoringSession: boolean`

This is intentionally minimal.

The app does not use:

- Redux
- Pinia
- Vuex
- Zustand
- MobX

Instead, it uses lightweight context-style dependency and state propagation.

For React or Vue, the equivalent could be:

- React Context plus hooks
- Vue `provide/inject`
- Pinia only if the app becomes more complex

### 9.2 Session Restore Flow

On startup:

1. root shell calls `restoreSessionUseCase.execute()`
2. use case asks `IAuthRepository`
3. repository calls `AuthRemoteDatasource.getCurrentSession()`
4. datasource calls Supabase auth session API
5. response DTO is mapped into `AuthSession`
6. app state is updated
7. if no session exists and the current route is protected, the app redirects to login

This is a good example of a clean vertical slice from UI shell to infrastructure.

---

## 10. Routing Architecture

Routing is centralized in `src/app/app.router.ts` and composed from feature route modules.

Each feature owns its route definitions:

- `auth.routes.ts`
- `dashboard.routes.ts`
- `customers.routes.ts`

The app router imports and merges them into a single route table.

This is a good modular routing pattern because:

- route declarations stay near the feature
- the app shell still controls the final router instance
- features remain independently extensible

### 10.1 Route Responsibilities

#### Auth routes

- `/login`
- `/register`
- `/forgot-password`

These are treated as unauthenticated routes.

#### Dashboard route

- `/dashboard`

#### Customers routes

- `/customers`
- `/customers/:id`

The detail route currently has placeholder rendering only.

### 10.2 Transferable Pattern for React or Vue

In React Router or Vue Router, use the same idea:

- each feature exports a route array
- the root router merges feature routes
- route guards and shell selection stay at app level

---

## 11. Authentication Bounded Context

The `auth` feature is the most complete example of the project's DDD structure.

### 11.1 Domain Model

#### `User`

Represents an authenticated business user.

Fields:

- `id`
- `email`
- `fullName`
- `role`

Behavior:

- `hasPermission(permission)`

This is important because permission logic is kept in the domain instead of scattered across pages.

#### `AuthSession`

Represents a logged-in session.

Fields:

- `user`
- `accessToken`
- `refreshToken`

This models authentication state explicitly instead of keeping raw SDK session data throughout the UI.

#### `UserRole`

An enum modeling supported roles:

- `support_agent`
- `operations_reviewer`
- `operations_manager`

It also exposes `parseUserRole(value)` to validate external string input.

#### `Permission`

An enum modeling permission vocabulary:

- `customers:search`
- `orders:view`
- `returns:create`
- `inspections:update`
- `refunds:approve_low_risk`
- `refunds:approve_exception`
- `settings:manage`

#### Role-to-permission mapping

The domain defines a role-to-permission matrix directly in `User`. That means authorization semantics live near the user model rather than inside UI components.

#### `Password`

A value object that validates password input through `PasswordValidator`.

#### `PasswordValidator`

Current rules:

- password is required
- minimum length is 8

This is intentionally small but correctly separated from UI code.

### 11.2 Application Layer

#### `IAuthRepository`

Application contract for authentication operations:

- `signIn`
- `signUp`
- `signOut`
- `getCurrentSession`

This is the feature port that protects the application layer from infrastructure details.

#### Use cases

##### `SignInUseCase`

Responsibilities:

- validate email using `Email`
- validate password using `Password`
- delegate sign-in to repository

##### `SignUpUseCase`

Responsibilities:

- validate email
- validate password
- pass `fullName` and `role`
- delegate sign-up to repository

##### `RestoreSessionUseCase`

Responsibilities:

- retrieve current session through repository

##### `SignOutUseCase`

Responsibilities:

- delegate sign-out through repository

### 11.3 Infrastructure Layer

#### `AuthRemoteDatasource`

This class is the direct adapter around Supabase authentication APIs.

Responsibilities:

- sign in with password
- sign up with metadata
- sign out
- restore current session
- convert the Supabase session structure into a local DTO

Important details:

- full name is stored in user metadata under `full_name`
- role is stored in user metadata under `role`
- datasource returns DTOs, not domain entities

#### `AuthSessionDTO`

Transport structure:

- `userId`
- `email`
- `fullName`
- `role`
- `accessToken`
- `refreshToken`

#### `AuthSessionMapper`

Maps between DTO and domain:

- DTO to `AuthSession`
- `AuthSession` to DTO

Key transformations:

- string email to `Email.create(...)`
- string role to `parseUserRole(...)`
- nested `User` entity creation

#### `AuthRepository`

Implements `IAuthRepository`.

Responsibilities:

- call datasource
- map DTOs to domain objects
- return domain-friendly results to use cases

This is the anti-corruption layer between the application layer and the remote auth API.

### 11.4 Presentation Layer

#### Login page

Responsibilities:

- capture email and password input
- call `useCases.auth.signIn.execute(...)`
- update global session state
- redirect to dashboard on success
- display error feedback on failure

#### Register page

Responsibilities:

- capture user profile input
- allow role selection
- call `useCases.auth.signUp.execute(...)`
- update global session state if an immediate session is returned
- otherwise show a confirmation message when email confirmation is required

#### Forgot password page

Current state:

- presentation exists
- actual use case and infrastructure flow are not implemented

Architecturally this is useful because the route and UI boundary already exist. The missing business flow can be added later with minimal shell changes.

---

## 12. Customers Bounded Context

The `customers` feature is the main data-retrieval business module after authentication.

### 12.1 Domain Model

#### `Customer`

Fields:

- `id`
- `fullName`
- `email`
- `phone`
- `address`
- `createdAt`
- `status`
- `risk`

This entity is read-focused for now. It does not yet expose methods or behavior.

#### `CustomerStatus`

Enum values:

- `active`
- `blocked`

Includes `parseCustomerStatus(value)` for validation.

#### `CustomerRisk`

Enum values:

- `low`
- `medium`
- `high`

Includes `parseCustomerRisk(value)` for validation.

### 12.2 Application Layer

#### `ICustomersRepository`

Contract:

- `getCustomers(request: PaginatedRequest): Promise<PaginatedResponse<Customer>>`

#### `GetCustomersUseCase`

Responsibilities:

- accept a pagination request
- delegate to repository
- return paginated customer entities

At the moment, this use case is thin. That is acceptable because it still preserves the correct architectural boundary.

### 12.3 Infrastructure Layer

#### `CustomersRemoteDatasource`

Direct Supabase query adapter for the `customers` table.

Responsibilities:

- query the `customers` table
- request exact count
- apply page range using `range(start, end)`
- return paginated DTO response

Important implementation details:

- pagination uses `page` and `pageSize`
- Supabase range is zero-based and inclusive
- start index = `(page - 1) * pageSize`
- end index = `page * pageSize - 1`

#### `CustomerDTO`

Remote transport model:

- `id`
- `full_name`
- `email`
- `phone`
- `address`
- `created_at`
- `status`
- `risk`

This format matches the remote data naming convention rather than the frontend domain naming convention.

#### `CustomersMapper`

Maps:

- DTO to `Customer`
- `Customer` to DTO

Transformations include:

- `full_name` to `fullName`
- `created_at` to `Date`
- string `email` to `Email`
- string `status` to `CustomerStatus`
- string `risk` to `CustomerRisk`

#### `CustomersRepository`

Responsibilities:

- call remote datasource
- map paginated DTOs to paginated domain entities
- reuse the shared generic pagination mapper

This is a strong example of separation between transport and domain.

### 12.4 Presentation Layer

#### Customers page

Responsibilities:

- request paginated customers on first render
- store local paginated state
- render the table and grid layout
- control page changes and page size changes
- navigate to the customer detail route

Key architectural observations:

- the page depends on the use case, not on Supabase
- domain enums are used in rendering logic
- pagination state is represented as an application model, not a collection of loose primitives

#### Customer detail route

The `/customers/:id` route currently renders a placeholder only.

This means the route contract exists but the customer detail bounded context is not yet implemented.

---

## 13. Dashboard Bounded Context

The `dashboard` feature currently contains:

- route definition
- dashboard page

It does not yet contain:

- domain layer
- application layer
- infrastructure layer

Current dashboard content is static, with hardcoded metric cards and queue rows.

This is not a problem, but it is important to document it accurately:

- architecturally, dashboard is not yet a full DDD feature
- it is currently a presentation module living inside the same feature-oriented folder strategy

When dashboard becomes dynamic, it should likely be refactored into:

- `domain/entities/dashboard-metric.ts`
- `application/use-cases/get-dashboard-summary/...`
- `application/ports/dashboard-repository.ts`
- `infrastructure/datasources/dashboard-remote-datasource.ts`
- `infrastructure/repositories/dashboard-repository.ts`
- `presentation/pages/dashboard-page.ts`

---

## 14. Shared Cross-Cutting Building Blocks

### 14.1 Shared Value Object: `Email`

`Email` is a classic reusable value object.

Responsibilities:

- trim and lowercase the value
- validate format
- guarantee only valid emails enter the domain
- support equality through `equals(...)`

This avoids repeating string validation across features.

### 14.2 Shared Pagination Model

The pagination model in `shared/application/models/pagination.ts` is one of the most reusable architectural parts of the project.

It defines:

- page size constants
- page size parsing
- paginated request contract
- paginated response model
- pagination item generation for UI navigation

#### `PaginatedRequest`

Fields:

- `page`
- `pageSize`

#### `PaginatedResponse<T>`

Fields:

- `items`
- `page`
- `pageSize`
- `count`

Behavior:

- `hasNextPage()`
- `hasPreviousPage()`
- `updatePage(page)`
- `updatePageSize(pageSize)`

#### `getPaginationItems(...)`

Creates UI-friendly pagination controls:

- first
- previous
- numbered pages
- next
- last

This is application-level logic, not page-specific logic, which is a good reuse decision.

### 14.3 Shared Pagination DTO and Mapper

The shared pagination infrastructure provides:

- `PaginatedResponseDTO<T>`
- `PaginatedResponseMapper`

This prevents each feature from rebuilding the same DTO-to-domain pagination translation logic.

### 14.4 Shared Supabase Client

`shared/infrastructure/supabase/supabase.ts` creates the single Supabase client.

It depends on:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

If either value is missing, the app throws during startup.

Architecturally this is good because misconfiguration fails fast.

### 14.5 Shared Presentation State

The app exposes two shared presentation contexts:

- app state context
- app use cases context

These provide:

- current session state
- session mutation actions
- access to composed use cases

This pattern is framework-portable:

- React: Context plus custom hooks
- Vue: provide and inject or a Pinia wrapper

### 14.6 Shared Layouts

Two main app shells exist:

- authenticated layout
- unauthenticated layout

This is an architectural decision, not just a styling choice.

It separates:

- protected workspace navigation and chrome
- public and authentication experience

This pattern should be kept when rebuilding in Vue or React.

---

## 15. Data Mapping Strategy

The codebase consistently separates:

- remote DTOs
- domain entities and value objects
- UI rendering models

The main mapping rules are:

1. external data enters through infrastructure DTOs
2. mappers convert DTOs into domain entities and value objects
3. pages render domain objects

Benefits:

- validation occurs at boundaries
- external naming conventions do not leak everywhere
- changes in the API schema are localized
- domain rules remain protected

Examples:

- auth metadata strings to `UserRole`, `Email`, and `User`
- customer rows to `Customer`, `CustomerStatus`, and `CustomerRisk`

This is one of the most important transferable patterns if rebuilding the project.

---

## 16. State Management Strategy

The app uses a minimal hybrid state approach:

- global app and session state at shell level
- local page state inside presentation components

### Global state

Used for:

- auth session
- startup restore loading state

### Local state

Used for:

- form inputs
- loading flags
- error messages
- customers table pagination instance

This avoids introducing a large state framework too early.

For a similar React or Vue project, use the same rule:

- globalize only cross-feature state
- keep screen-local state inside the page or component

Good candidates for global state:

- authenticated user and session
- permissions
- theme if needed
- global notifications if added later

Good candidates for local state:

- form fields
- pagination selection
- tab selection
- local loading and error states

---

## 17. Error Handling Strategy

Current error handling is simple and mostly imperative.

### Current behavior

- datasources throw `Error` objects when Supabase fails
- use cases do not wrap or classify errors
- pages catch errors and display `error.message`
- session restore redirects to login on failure or absence of session

### Strengths

- simple
- easy to trace
- low boilerplate

### Limitations

- no typed error hierarchy
- no distinction between validation, authorization, and infrastructure failures
- no centralized error translation policy

For a larger app, consider introducing:

- `DomainError`
- `ApplicationError`
- `InfrastructureError`
- a user-facing message mapping layer

But for the current size, the simple approach is acceptable.

---

## 18. Testing Architecture

The project includes test files for important non-UI logic.

Observed test coverage targets:

- shared email value object
- password value object
- password validator
- auth session mapper
- auth datasource
- auth repository
- auth use cases

This reveals the testing strategy:

- prioritize domain and application logic
- test infrastructure adapters
- keep business rules testable without UI

This aligns well with the architecture.

If rebuilding in React or Vue, keep the same testing pyramid:

- unit tests for value objects and services
- unit tests for use cases
- adapter and repository tests with mocked datasource behavior
- UI tests only where interaction logic is important

---

## 19. Build and Runtime Stack

Even though this document avoids framework-specific explanation, the technical environment matters.

Current toolchain:

- Vite for dev server and bundling
- TypeScript for static typing
- Vitest for testing
- Tailwind CSS v4 for styling
- Supabase JS client for backend services
- Lucide for icons

### Runtime shape

This is a client-side SPA.

Main characteristics:

- browser-rendered
- client-side routing
- frontend directly communicates with Supabase
- no custom backend layer is present in this repository

This is critical to understand. The project is not a fullstack monolith. It is a frontend that delegates auth and data access directly to Supabase.

---

## 20. Environment and External Dependencies

The app requires the following environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These are consumed at build and runtime through `import.meta.env`.

### Architectural impact

Because the frontend talks directly to Supabase:

- auth rules partially rely on Supabase Auth
- table access relies on Supabase configuration
- row-level security and database permissions are external to this repository

That means some security and business enforcement may live outside the codebase.

When documenting or rebuilding this architecture, always separate:

- frontend domain rules in code
- backend and database authorization rules in Supabase

---

## 21. How to Rebuild the Same Architecture in React or Vue

This is the most important portability section.

The architecture should be copied as structure and dependency rules, not as framework syntax.

### 21.1 Keep the Same Folder Strategy

Recommended structure:

```text
src/
+-- app/
|   +-- router/
|   +-- providers/
|   +-- dependencies.ts
|   \-- app-shell.tsx or App.vue
+-- features/
|   +-- auth/
|   |   +-- domain/
|   |   +-- application/
|   |   +-- infrastructure/
|   |   \-- presentation/
|   +-- customers/
|   |   +-- domain/
|   |   +-- application/
|   |   +-- infrastructure/
|   |   \-- presentation/
|   \-- dashboard/
+-- shared/
|   +-- domain/
|   +-- application/
|   +-- infrastructure/
|   \-- presentation/
\-- styles/
```

Do not collapse everything into `components`, `services`, and `hooks`. That loses the domain boundaries that make this project maintainable.

### 21.2 React Mapping

Equivalent concepts:

- app state context to React Context
- app use cases context to React Context
- page components to React page components
- route modules to React Router route arrays
- layouts to layout components
- local state to `useState`
- startup session restore to `useEffect` in the app shell or route guard bootstrap

Suggested React patterns:

- `useAppState()`
- `useUseCases()`
- `ProtectedLayout`
- `PublicLayout`
- `features/<feature>/presentation/pages/*.tsx`

### 21.3 Vue Mapping

Equivalent concepts:

- app state context to `provide/inject` or a Pinia store
- use case context to an app-level provider or composable
- route modules to Vue Router route arrays
- layouts to layout components
- local page state to `ref()` or `reactive()`
- startup session restore to `onMounted()` or route bootstrap

Suggested Vue patterns:

- `useAppState()`
- `useUseCases()`
- `AuthenticatedLayout.vue`
- `UnauthenticatedLayout.vue`
- feature route exports per module

### 21.4 Rules That Must Stay the Same

If rebuilding in React or Vue, preserve these rules:

1. pages call use cases, not APIs directly
2. use cases depend on repository interfaces
3. repositories hide transport and SDK details
4. DTOs never leak as the main UI model
5. domain validation remains inside value objects and services
6. each feature owns its domain, application, infrastructure, and presentation split
7. shared code stays in `shared`, not copied across features
8. dependency wiring happens centrally in `app/dependencies.ts`

---

## 22. Strengths of the Current Architecture

The current architecture has several strong qualities:

- clear feature modularization
- good dependency inversion
- explicit domain vocabulary
- strong separation between UI and data access
- reusable shared pagination model
- manual dependency injection that is easy to understand
- framework-portable business structure
- testing focus on non-UI logic

For a small-to-medium frontend app, this is a strong architectural foundation.

---

## 23. Current Limitations and Gaps

The architecture is good, but the implementation is not fully mature yet.

Important current gaps:

- dashboard is not yet a fully layered feature
- forgot password flow is only a UI placeholder
- customer detail route is only a placeholder
- no typed error hierarchy
- no explicit authorization guard layer beyond session presence
- no formal query caching layer
- no backend abstraction beyond direct Supabase access
- no domain events, aggregates, or richer transactional modeling

These are not defects for the current size, but they matter if the app grows.

---

## 24. Recommended Evolution Path

If this project expands, the next architectural improvements should be:

1. add route guards based on both session and permissions
2. implement customer detail as a full layered feature slice
3. convert dashboard to a real data-driven feature with its own use cases
4. introduce typed error classes
5. separate authorization policy helpers from pure UI checks
6. consider a query caching layer if reads become more complex
7. add feature-level service factories if `dependencies.ts` grows too large

These changes can be added without replacing the current structure.

---

## 25. Practical Summary

This project is best understood as a DDD-inspired frontend architecture built around feature modules and clean dependency boundaries.

The most important ideas to preserve are:

- organize by business feature
- split features into domain, application, infrastructure, and presentation
- use value objects to protect business inputs
- keep use cases as the entry point for UI actions
- isolate Supabase or any API and SDK behind repositories and datasources
- centralize dependency wiring
- keep app-level state minimal and explicit

If you want to build something similar with React or Vue, do not copy the current framework syntax. Copy the architecture:

- feature boundaries
- layer responsibilities
- dependency rules
- mapping strategy
- state ownership rules
- composition root pattern

That is the real design of this project.
