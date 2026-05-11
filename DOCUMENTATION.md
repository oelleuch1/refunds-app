# Returns And Refunds Operations Portal

## Project Goal

Build a Lit / LitElement frontend application for internal support and operations teams who manage customer return and refund requests.

The backend should be provided through a ready backend service such as Supabase. Students focus on frontend architecture, Web Components, forms, validation, workflow states, permissions, approval logic, backend integration, testing, accessibility, and technical documentation.

Employees should be able to:

- search customers
- view customer orders
- inspect purchased products
- create return requests
- validate refund eligibility
- upload or review evidence
- submit requests for approval
- approve or reject refund requests
- track workflow states
- view audit history
- handle role-based actions safely

## Recommended Backend

Supabase is the recommended backend for this project.

Recommended Supabase features:

- Auth for login
- PostgreSQL tables for business data
- Row Level Security for permissions
- Storage for evidence uploads
- Edge Functions for simulated backend processes, optional
- Realtime for approval queue updates, optional

## User Roles

This project uses a maximum of three user roles so the permission model stays realistic but manageable for students.

### Support Agent

- Search customers.
- View orders and products.
- Create return requests.
- Submit refund requests.
- Cannot approve refunds.
- Cannot process final refunds.

### Operations Reviewer

- Review returned item condition.
- Mark item as received.
- Add inspection result.
- Upload inspection notes or photos.
- Review normal refund requests.
- Approve or reject low-risk refunds.
- Request more information.
- Cannot approve exceptional or high-value refunds.

### Operations Manager

- Approve exceptional cases.
- Approve expired return windows.
- Approve high-value refunds.
- Approve requests for blocked or high-risk customers.
- Override selected validation rules with justification.
- Provide a reason when rejecting a request.
- Configure return reasons, thresholds, and workflow rules.

## Main Screens

### 1. Login

Students implement Supabase authentication.

Requirements:

- login form
- validation
- error handling
- loading state
- redirect after login
- role-based navigation

### 2. Dashboard

Shows an operational overview.

Example content:

- pending return requests
- pending item inspections
- pending manager approvals
- rejected requests
- completed refunds
- high-risk requests

Technical requirements:

- fetch dashboard metrics from backend
- loading, error, and empty states
- accessible summary cards
- permission-based dashboard content

### 3. Customer Search

Employees can search for a customer.

Search fields:

- customer ID
- email
- name
- order number

Requirements:

- debounce search input
- loading state
- no-results state
- keyboard accessible results
- clear error display
- prevent search with invalid or empty input

### 4. Customer Profile

Shows customer information and linked orders.

Customer data:

- name
- email
- phone
- address
- account status
- risk flag
- previous return history

Requirements:

- sensitive fields hidden based on role
- account status affects allowed actions
- clear display of blocked or flagged customers
- audit-safe UI where important actions are explicit

### 5. Order Detail

Shows order and product information.

Order data:

- order number
- date
- payment method
- delivery status
- total amount
- purchased items
- return eligibility per item

Product data:

- product name
- SKU
- quantity
- price
- category
- return window
- warranty status

Rules:

- delivered orders can be returned
- cancelled orders cannot be returned
- expired return windows require operations manager approval
- digital products are non-returnable unless configured
- already refunded items cannot be refunded again

### 6. Create Return Request

This is the main multi-step workflow.

Example steps:

1. Select order item.
2. Choose return reason.
3. Enter customer explanation.
4. Add evidence if required.
5. Review refund calculation.
6. Submit request.

Validation examples:

- return reason is required
- quantity must be valid
- explanation is required for damaged or defective items
- evidence is required for damaged items
- refund amount cannot exceed paid amount
- item cannot already have an active return request
- expired return window requires exception reason
- blocked customer requires operations manager review

### 7. Warehouse Inspection

Used after the item is physically returned.

Fields:

- received date
- package condition
- item condition
- inspection notes
- photos or evidence
- restockable yes/no
- mismatch reason if the returned item does not match the order

Workflow outcomes:

- item received and accepted
- item received but damaged
- wrong item received
- item missing
- inspection failed

Rules:

- operations reviewers can update inspection results.
- approval is blocked until inspection is complete for physical returns.
- non-restockable items may reduce the refund amount.
- inspection failure requires escalation.

### 8. Approval Queue

Reviewers see pending work based on role.

Filters:

- request type
- status
- risk level
- amount
- assigned role
- date submitted

Actions:

- open request
- approve
- reject
- request more information
- escalate
- assign to self

Requirements:

- only permitted actions are visible
- approval buttons have confirmation states
- rejection requires a reason
- requesting more information requires a message
- all actions create audit log entries

### 9. Refund Approval Detail

Shows the full request.

Sections:

- customer summary
- order summary
- item details
- return reason
- validation warnings
- evidence
- warehouse inspection result
- refund calculation
- approval history
- audit log

Operations reviewer can:

- approve low-risk refund
- reject low-risk refund
- request more information

Operations manager can:

- approve exception
- reject exception
- override expired return window
- approve high-value refund
- escalate compliance issue

### 10. Audit Log

Every important action is logged.

Examples:

- return request created
- evidence uploaded
- inspection completed
- approval submitted
- request rejected
- refund approved
- refund marked as processed
- validation override used

Audit log fields:

- timestamp
- actor
- role
- action
- previous status
- new status
- comment
- related entity

## Workflow States

Suggested return request states:

- `draft`
- `submitted`
- `awaiting_customer_info`
- `awaiting_item_return`
- `warehouse_inspection`
- `inspection_failed`
- `pending_manager_approval`
- `pending_reviewer_approval`
- `approved`
- `rejected`
- `refund_processing`
- `refund_completed`
- `cancelled`

Standard flow:

```text
draft
-> submitted
-> awaiting_item_return
-> warehouse_inspection
-> pending_reviewer_approval
-> approved
-> refund_processing
-> refund_completed
```

Exception flow:

```text
draft
-> submitted
-> pending_manager_approval
-> rejected
```

More-information flow:

```text
submitted
-> awaiting_customer_info
-> submitted
```

## Approval Logic

Example business rules:

- Refunds under 50 EUR do not require approval if the item is unopened and inside the return window.
- Refunds from 50 to 250 EUR require operations reviewer approval.
- Refunds over 250 EUR require operations manager approval.
- Expired return windows require operations manager approval.
- Damaged items require evidence.
- Damaged physical items require warehouse inspection.
- Blocked customers require operations manager approval.
- High-risk customers always require operations manager approval.
- Digital products cannot be returned unless configuration allows an exception.

## Suggested Supabase Tables

- `profiles`
- `roles`
- `customers`
- `customer_addresses`
- `orders`
- `order_items`
- `products`
- `return_requests`
- `return_request_items`
- `refund_calculations`
- `approval_steps`
- `inspection_reports`
- `evidence_files`
- `audit_logs`
- `workflow_comments`
- `app_settings`

## Frontend Architecture

The app should be built with:

- Lit
- LitElement
- TypeScript
- Web Components
- Supabase JavaScript client
- Vitest for unit and integration tests
- Playwright for end-to-end tests
- axe-core or Playwright accessibility checks

Possible routing options:

- Vaadin Router
- a lightweight custom router

## Testing Requirements

### Unit Tests

Students should test:

- validation functions
- permission checks
- refund calculation
- workflow state transitions
- role-based action visibility

## Suggested MVP

The minimum viable version should include:

1. Supabase login
2. Customer search
3. Order detail view
4. Create return request form
5. Refund calculation
6. Approval queue
7. Reviewer and manager approval or rejection
8. Warehouse inspection form
9. Audit log display
10. Unit and integration tests
11. Accessibility checks
12. Technical documentation


Architecture: 

 Recommended structure:

  src/
    app/
      app-root.ts
      app.routes.ts
      app.styles.ts

    shared/
      assets/
        images/
        icons/
      styles/
        index.css
        tokens.css
      ui/
        app-button.ts
        app-card.ts
        app-input.ts
      lib/
        supabase.ts
      utils/
        currency.ts
        dates.ts
      types/
        common.ts

    domains/
      auth/
        domain/
          user.ts
          role.ts
          permissions.ts
        application/
          auth-service.ts
        infrastructure/
          supabase-auth-repository.ts
        presentation/
          login-page.ts

      customers/
        domain/
          customer.ts
          customer-status.ts
        application/
          search-customers.ts
        infrastructure/
          supabase-customer-repository.ts
        presentation/
          customer-search-page.ts
          customer-profile-page.ts

      orders/
        domain/
          order.ts
          order-item.ts
          return-eligibility.ts
        application/
          get-order-detail.ts
        infrastructure/
          supabase-order-repository.ts
        presentation/
          order-detail-page.ts

      returns/
        domain/
          return-request.ts
          return-reason.ts
          return-rules.ts
          workflow-state.ts
        application/
          create-return-request.ts
          calculate-refund.ts
          submit-return-request.ts
        infrastructure/
          supabase-return-repository.ts
        presentation/
          create-return-request-page.ts

      approvals/
        domain/
          approval-step.ts
          approval-policy.ts
          approval-decision.ts
        application/
          approve-refund.ts
          reject-refund.ts
          get-approval-queue.ts
        infrastructure/
          supabase-approval-repository.ts
        presentation/
          approval-queue-page.ts
          refund-approval-detail-page.ts

      inspections/
        domain/
          inspection-report.ts
          inspection-result.ts
        application/
          complete-inspection.ts
        infrastructure/
          supabase-inspection-repository.ts
        presentation/
          warehouse-inspection-page.ts

      audit/
        domain/
          audit-log.ts
          audit-action.ts
        application/
          get-audit-log.ts
        infrastructure/
          supabase-audit-repository.ts
        presentation/
          audit-log-page.ts

