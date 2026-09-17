# SmartBus - multi-institute transport management

## Run locally

Use Node.js 24 or newer. In separate terminals:

~~~powershell
cd "D:\Bus Track\Bus-Backend"
npm install
npm start
~~~

~~~powershell
cd "D:\Bus Track\Bus-Frontend"
npm install
npm run dev
~~~

Open http://localhost:5173. The API runs on http://localhost:5001.
For another API host, set VITE_API_URL in the frontend environment (restart Vite).
Backend settings: PORT, DB_PATH, CLIENT_ORIGIN and optional JWT_SECRET.

## Existing local account

- Super admin: admin@smartbus.com / password123
- Student: student@smartbus.com / password123 (subject to its access status)

The one-time migration promotes existing unscoped admins to superadmins and assigns existing students, drivers, buses and routes to **Main Campus**. Existing records and passwords are preserved. Existing students keep their access until an administrator sets a duration. A backup of this workspace's pre-migration database is in Bus-Backend/backups/.

Sign in again after the upgrade: sessions now validate against the current account and a persisted server secret.

## Institute setup

1. Sign in as superadmin, then open **Institutes & admins**.
2. Create or rename institutes and create an administrator assigned to each institute. Administrators can also be edited, have their password reset, or be removed here.
3. Select an institute above the dashboard, fleet, drivers or routes pages before creating records. Superadmin can view all institutes; institute admins only access their own data.
4. Create routes, driver accounts and buses, then assign drivers to buses. Drivers and routes must belong to the bus's institute.

HTTP endpoints and live Socket.IO updates both enforce institute access. Students and drivers only see their own institute's transport data.

## Manual payments and student duration

In **Student management**, add a student or review a student's self-registration. New students are suspended pending activation.

- **Payment & duration**: enter amount received, currency, receipt/reference, and start/end dates. Choose 30, 90, 365 days or custom dates. Saving records the payment and replaces the student's current access period.
- **Manage access**: activate with dates or suspend manually without recording a payment.
- Dates use UTC. The end date is inclusive through 23:59:59 UTC; access is blocked starting the next day. Future periods allow access only from their start date.
- Expiry is checked on every protected request and login. A 30-second maintenance job updates persisted status and disconnects expired live sessions. Manual suspension disconnects live sessions immediately.
- Login displays the appropriate pending, admin-suspended, future-start or expired message.
- Historical payments remain after deleting a student, with the student shown as deleted.

Use institute, status and name/email filters, then **Clear filters** to reset them. Student PDF export follows the selected filters.

## PDF reports

Download PDFs directly from each management page: fleet, drivers (matching search), students (matching filters), routes, and the institute/administrator lists. Student management also includes a Payments PDF button for the selected institute. Overview provides Download all data. Institute admins can only export their own institute's data. Reports include repeated table headers, page numbers and generation time. Passwords and tokens are never exported.

## Layout and themes

Dark/light mode is saved locally and available at the top. Both modes use the same information and typography. Student and driver layouts use responsive cards, vertical stop timelines, maps that resize with the layout, and map controls outside the map canvas. Driver simulation is labelled separately from GPS sharing.

## Verification

~~~powershell
cd "D:\Bus Track\Bus-Backend"
npm test
cd "D:\Bus Track\Bus-Frontend"
npm run build
~~~

Integration tests use temporary databases, not the running application's data. They cover institute permissions, driver ownership, pending registration, manual payment validation, expiry, suspension, socket isolation, PDF generation/pagination and repeatable legacy migration. Install frontend dependencies before backend tests because the socket test uses its Socket.IO client.
