# Functional Requirements Specification
## Project: Customer Portal v2.0

<!-- Page 1 -->

## 1. User Authentication

### 1.1 Login Requirements

The system shall provide a secure login mechanism for all registered users.

- REQ-AUTH-001: The system shall support email and password based authentication.
- REQ-AUTH-002: The system shall implement OAuth 2.0 integration with Google and Microsoft.
- REQ-AUTH-003: The system shall enforce multi-factor authentication (MFA) for admin users.
- REQ-AUTH-004: The system shall lock user accounts after 5 consecutive failed login attempts.

### 1.2 Session Management

The system shall manage user sessions securely.

- REQ-SESSION-001: User sessions shall expire after 30 minutes of inactivity.
- REQ-SESSION-002: The system shall support concurrent sessions from different devices.
- REQ-SESSION-003: The system shall provide a "remember me" option that extends session to 7 days.

<!-- Page 3 -->

## 2. Customer Dashboard

### 2.1 Dashboard Overview

The customer dashboard shall display a summary of key account information.

- REQ-DASH-001: The dashboard shall display account balance, recent transactions, and notifications.
- REQ-DASH-002: The dashboard shall refresh data every 60 seconds without page reload.
- REQ-DASH-003: The system shall support customizable dashboard widgets.

<!-- Page 5 -->

## 3. Test Cases

### 3.1 Authentication Tests

#### TC-AUTH-001: Verify Successful Login

**Preconditions:**
- User account exists with valid credentials
- Account is not locked

**Steps:**
1. Navigate to the login page
2. Enter valid email address
3. Enter valid password
4. Click the "Login" button

**Expected Results:**
- User is redirected to the dashboard
- Welcome message displays user's name
- Session token is generated

#### TC-AUTH-002: Verify Account Lockout

**Preconditions:**
- User account exists with valid credentials
- Account lockout threshold is set to 5

**Steps:**
1. Navigate to the login page
2. Enter valid email address
3. Enter incorrect password
4. Repeat steps 2-3 five times

**Expected Results:**
- After 5th attempt, account is locked
- Error message: "Account locked. Contact support."
- Locked status is recorded in audit log

<!-- Page 7 -->

### 3.2 Dashboard Tests

#### TC-DASH-001: Verify Dashboard Data Refresh

**Preconditions:**
- User is logged in
- Dashboard is loaded

**Steps:**
1. Note the current data displayed
2. Wait 60 seconds
3. Observe the dashboard

**Expected Results:**
- Data refreshes without page reload
- Loading indicator appears during refresh
- Updated timestamp is shown

## 4. Meeting Notes

### Sprint Planning - Week 12

Attendees: John, Sarah, Mike, Lisa

Discussion Points:
- Reviewed backlog priorities for Q3
- Agreed to defer payment module to next sprint
- Lisa raised concern about test coverage on auth module
- Mike to investigate performance bottleneck on dashboard API

Action Items:
- [ ] John: Finalize API contracts by Friday
- [ ] Sarah: Set up load testing environment
- [ ] Mike: Profile dashboard API response times
- [ ] Lisa: Write additional edge case tests for MFA

## 5. Non-Functional Requirements

### 5.1 Performance

- REQ-PERF-001: The system shall respond to API requests within 200ms under normal load (< 1000 concurrent users).
- REQ-PERF-002: The dashboard shall load completely within 3 seconds on a standard broadband connection.
- REQ-PERF-003: The system shall support up to 10,000 concurrent users without degradation.

### 5.2 Security

- REQ-SEC-001: All data in transit shall be encrypted using TLS 1.3.
- REQ-SEC-002: Passwords shall be hashed using bcrypt with a minimum cost factor of 12.
- REQ-SEC-003: The system shall maintain an audit log of all authentication events for 90 days.
