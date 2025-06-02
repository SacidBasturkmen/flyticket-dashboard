# FlyTicket Frontend

FlyTicket’s frontend is built with Next.js (React + TypeScript), Axios and CSS Modules. It interacts with the backend API for all functionality.

## Table of Contents

1. [Technologies](#technologies)
2. [Prerequisites](#prerequisites)
3. [Setup & Installation](#setup--installation)
4. [Project Structure](#project-structure)
5. [Key Pages & Components](#key-pages--components)
6. [Styling (CSS Modules)](#styling-css-modules)
7. [Environment Configuration](#environment-configuration)
8. [.gitignore](#gitignore)
9. [Contributing](#contributing)
10. [License](#license)

## Technologies

* Next.js (React + TypeScript)
* Axios
* CSS Modules
* React Hooks (`useState`, `useEffect`)

## Prerequisites

* Node.js (v16+)
* Git

## Setup & Installation

```bash
git clone <repository-url>
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
Frontend assumes backend is running at `http://localhost:5252`.

## Project Structure

```
frontend/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ globals.css
│  │  └─ page.tsx
│  ├─ components/
│  │  ├─ LayoutPublic.tsx
│  │  ├─ LayoutAdmin.tsx
│  │  ├─ LoadingSpinner.tsx
│  │  └─ ErrorMessage.tsx
│  ├─ lib/
│  │  └─ api.ts
│  ├─ pages/
│  │  ├─ flight/[id].tsx
│  │  ├─ confirmation.tsx
│  │  ├─ tickets.tsx
│  │  └─ admin/
│  │     ├─ login.tsx
│  │     ├─ register.tsx
│  │     ├─ dashboard.tsx
│  │     ├─ cities/
│  │     ├─ flights/
│  │     └─ tickets/
│  └─ styles/
│     ├─ public.module.css
│     ├─ admin.module.css
│     ├─ spinner.module.css
│     └─ page.module.css
└─ package.json
```

## Key Pages & Components

### Layouts

* `LayoutPublic.tsx`: Header, footer, and container for public pages
* `LayoutAdmin.tsx`: Sidebar with navigation for admin dashboard

### Shared Components

* `LoadingSpinner.tsx`: Spinner during async operations
* `ErrorMessage.tsx`: Box-styled error display

### API Client (`src/lib/api.ts`)

```ts
getAllCities()
getCityById(id)
createCity(payload)
updateCity(id, payload)
deleteCity(id)

getAllFlights()
getFlightById(id)
createFlight(payload)
updateFlight(id, payload)
deleteFlight(id)

getAllTickets()
getTicketsByEmail(email)
bookTicket(payload)

registerAdmin(payload)
loginAdmin(payload)
```

JWT token is included automatically in headers when required.

## Pages

* `/`: Home with city/flight selector and results
* `/flight/[id]`: Flight booking form
* `/confirmation`: Ticket list based on email
* `/tickets`: Ticket search by email
* `/admin/login`: Admin login
* `/admin/register`: Admin registration
* `/admin/dashboard`: Navigation hub
* `/admin/cities`: CRUD for cities
* `/admin/flights`: CRUD for flights
* `/admin/tickets`: Ticket list view

## Styling (CSS Modules)

| File                 | Used For             |
| -------------------- | -------------------- |
| `globals.css`        | Global resets        |
| `public.module.css`  | Home, booking, etc.  |
| `admin.module.css`   | Admin pages          |
| `spinner.module.css` | Loading component    |
| `page.module.css`    | Extra homepage style |

All button elements use `.btn` class convention.

## Environment Configuration

Default base URL for backend is:

```ts
const baseURL = 'http://localhost:5252/api';
```

To override, edit `src/lib/api.ts`.

## .gitignore

```gitignore
node_modules/
.next/
out/
.env
package-lock.json
yarn.lock
.vscode/
.idea/
.DS_Store
Thumbs.db
```

## Contributing

```bash
git checkout -b feature/your-feature-name
git commit -m "Add feature"
git push origin feature/your-feature-name
```

Then open a pull request.

## License

MIT
