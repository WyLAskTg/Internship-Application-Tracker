# Internship Application Tracker

A practical front-end web app built with React, TypeScript, and Vite to help track internship applications in one place.

This project allows users to add, view, delete, filter, and manage internship application records in a clean dashboard-style interface. Application data is stored locally in the browser, so records remain available after refreshing the page.

## Features

- Add internship application records with:
  - company name
  - role title
  - date applied
  - application status
- Delete existing application records
- Validate required form fields before submission
- Persist data locally with browser storage
- Filter records by status:
  - All
  - Applied
  - OA
  - Interview
  - Rejected
  - Offer
- Display summary statistics for:
  - total applications
  - applied
  - OA
  - interview
  - rejected
  - offer
- Visual status badges for clearer record tracking

## Tech Stack

- React
- TypeScript
- Vite
- CSS

## Project Structure

Example structure:

```text
src/
├── App.tsx
├── App.css
├── ApplicationItem.tsx
├── main.tsx
└── index.css