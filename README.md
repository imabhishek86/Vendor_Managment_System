# Vendor Cab & Driver Onboarding Management System

A professional, frontend-only Single Page Application (SPA) designed to manage complex, multi-level vendor hierarchies, fleet operations, driver onboarding, and compliance tracking. 

Built specifically to simulate an enterprise-grade SaaS dashboard, this application utilizes React Context for sophisticated local state management, enforcing strict business rules and hierarchical validations purely on the client side.

> **Note:** This is a frontend-only implementation using mock data and React Context for state management. It does not include a backend, real database, or server-side authentication.

---

## Features

1. **Dashboard**: High-level statistical overview of fleet operations and quick actions.
2. **Multi-level Vendor Hierarchy**: Visualize and manage complex parent-child vendor relationships down to infinite depth.
3. **Move User / Change Manager**: Securely re-assign vendors to different managers within the hierarchy while preventing invalid relationships (e.g., self-assignment or assigning to a descendant).
4. **Vendor Management**: Complete CRUD interface for managing vendor profiles, statuses, and contact details.
5. **Driver Management**: Onboard and track drivers, mapping them strictly to their employing vendors.
6. **Vehicle Management**: Register fleet vehicles and securely assign drivers, preventing duplicate active assignments.
7. **Document Management**: Centralized repository for tracking identity and registration documents across all entities.
8. **Compliance Tracking**: Dynamic expiry date calculation that automatically flags documents as `Expired` or `Expiring Soon`.
9. **Delegation & Permissions**: Allow Super Vendors to securely delegate specific operational permissions (e.g., Driver Management) down their vendor hierarchy tree.
10. **Search and Filtering**: Instant, case-insensitive search and multi-select filters across all major data tables.
11. **Form Validation**: Strict client-side validation for required fields, email/phone formats, and file upload parameters.
12. **Responsive Design**: Fluid UI that adapts from full desktop data tables to mobile-friendly cards.
13. **Frontend State Management**: A robust Context API architecture that cross-references IDs to maintain data integrity across the app.

---

## Tech Stack

- **React** (UI Library)
- **Vite** (Build Tool)
- **JavaScript** (Core Logic)
- **Tailwind CSS** (Utility-first Styling)
- **React Router** (Client-side Routing)
- **Lucide React** (Iconography)
- **React Context API** (Global State Management)
- **Mock Data** (Simulated Database)

---

## Architecture

The application follows a clean, feature-driven directory structure:

```text
src/
├── components/   # Reusable UI components (Modals, Tables, Badges, Modals)
├── pages/        # Top-level route components (Dashboard, Vendors, Vehicles, etc.)
├── context/      # Global React Context providers for state management
├── data/         # Mock data arrays acting as the initial database state
├── utils/        # Shared helper functions (e.g., date calculation logic)
├── App.jsx       # Root component and Router configuration
└── main.jsx      # React DOM entry point
```

## State Management

The application utilizes five distinct Context Providers wrapped around the root component to simulate relational database tables:

- **VendorProvider**: Manages the vendor hierarchy and core vendor profiles.
- **DriverProvider**: Manages driver onboarding and statuses.
- **VehicleProvider**: Manages fleet assets and assignments.
- **DocumentProvider**: Manages compliance attachments and their statuses.
- **DelegationProvider**: Manages security permissions and access control.

### Relational Entity Mapping
The system uses unique IDs as foreign keys to map relationships without duplicating data. If a Vendor's name is updated in the `VendorProvider`, the Driver and Vehicle tables will instantly reflect the new name because they resolve references dynamically on render:

```text
Vendor (ID)
  ↓
Driver (vendorId)
  ↓
Vehicle (vendorId, driverId)
  ↓
Documents (entityType, entityId, vendorId)
```

---

## Core Workflows

### Vendor Move Workflow
Select Vendor → Move User → Select New Manager → Validate hierarchy (prevents self/descendant mapping) → Update `parentId` → Re-render tree.

### Driver Assignment
Select Vendor → Select Driver → Validate vehicle availability (prevent active drivers from being assigned to multiple active vehicles) → Assign vehicle.

### Document Verification
Upload (Validate File Type & Size) → Status enters `Pending` → Admin Views Document → Verify / Reject (Requires formalized rejection reason).

### Delegation
Select Target Vendor → Select Specific Permissions → Validate Hierarchy (Target must be a descendant) → Create Delegation → Edit / Revoke as needed.

---

## Complexity Analysis

Because this is a frontend-only application using arrays for mock data, the Big-O complexity represents the current array manipulation logic:

- **Hierarchy Traversal (Search/Lookup):** `O(n)` - Linear scan to find parents/children.
- **Tree Traversal/Descendant Validation:** `O(n)` - Recursive traversal bounded by the total number of vendors.
- **Filtering & Searching:** `O(n)` - Linear scan over `n` records for string matching.
- **Adding a Record:** `O(1)` - Typical state append `[...prev, newRecord]`.
- **Finding Related Entities (Foreign Keys):** `O(n)` - Utilizing `Array.prototype.find()` on render.

---

## Validation & Error Handling

The application features extensive client-side guards to simulate enterprise business rules:
- **Form Data:** Enforces required fields, and validates standard email and phone structures.
- **Hierarchy Guards:** Prevents a vendor from delegating permissions to itself, a parent, or a peer.
- **Duplicate Prevention:** Prevents creating identical active delegations for the same vendor pairing.
- **Vehicle Assignment:** Physically blocks the assignment of an Active Driver to a Vehicle if they are already assigned elsewhere.
- **File Uploads:** JavaScript HTML5 `File` validation restricts uploads to PDF/JPG/PNG and strictly under 5MB.
- **Compliance Automation:** A document manually marked as "Verified" is forcefully overridden to "Expired" if its calendar expiry date has passed.

---

## Responsive Design

The UI utilizes Tailwind CSS breakpoints to adapt seamlessly:
- **Desktop:** Full-width data tables, expanded sidebars, and grid layouts.
- **Tablet:** Adaptive/scrollable tables and collapsing sidebars.
- **Mobile:** Data tables transform into stacked summary cards. Modals and forms occupy full width to prevent horizontal overflow.

---

## Installation

To run this project locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Production Build

To generate an optimized production bundle:

```bash
npm run build
```
*(Note: The current build completes successfully with 0 errors and 0 warnings).*

---

## Known Limitations

This project was built explicitly to showcase frontend architecture and UI/UX capabilities. Therefore:
1. **Data Volatility:** Because state is held in React Memory (`useState`), refreshing the browser tab will reset all data back to the original `mockData.js` arrays.
2. **Security Controls:** All authorization and hierarchy guards are simulated on the frontend UI level.
3. **File Uploads:** Document uploads are simulated. Files are validated but discarded rather than being sent to an S3 bucket.
4. **Mock Data:** There is no real database connection.

---

## Future Improvements

To take this application to production, the following architecture would be required:
- **Backend Infrastructure:** Implementing REST or GraphQL APIs (Node.js/Python).
- **Database:** Migrating state arrays to PostgreSQL or MongoDB.
- **Authentication:** Integrating JWTs, OAuth, and server-side RBAC (Role-Based Access Control).
- **Cloud Storage:** Wiring the document upload modal directly to AWS S3.
- **Performance:** Migrating `O(n)` client-side filters to server-side search algorithms with pagination.

---

## Screenshots

*(Placeholder for future application screenshots)*

## Demo

*(Placeholder for future demo video link)*

## GitHub

*(Placeholder for repository URL)*

---

## License

This project is licensed under the MIT License.
