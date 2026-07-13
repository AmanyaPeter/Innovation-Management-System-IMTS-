MASTER PROMPT — Setup Vite, Document the Project, and Prepare for Backend Integration

You are working on an existing Bank of Uganda Innovation Management System frontend project.

Your objective is NOT to redesign the UI.

Your objective is to transform the existing frontend into a professional, maintainable, and well-documented development environment that can later be connected to an ASP.NET Core microservices backend.

PRIMARY GOALS

Complete ALL of the following.

Convert the project to use Vite.
Ensure the project runs correctly.
Organize the folder structure.
Make every page accessible through the Vite development server.
Ensure JSON files load correctly using fetch().
Fix broken relative paths if necessary.
Document EVERYTHING.
Produce documentation that allows another AI or developer to continue without guessing.
Do not redesign the application.
PART 1 — PROJECT INSPECTION

Before changing anything:

Inspect the entire project.

Document:

Folder structure
HTML pages
CSS files
JavaScript files
JSON files
Images
Fonts
Third-party libraries
Existing navigation
Existing functionality

Create:

docs/PROJECT_AUDIT.md

Include:

Folder Structure

Explain every folder.

Existing Pages

For every page include:

filename
purpose
navigation entry
current status

Example

submit-idea.html

Purpose:

Allows staff to submit innovation ideas.

Status:

UI complete

Logic partially implemented
PART 2 — CONVERT TO VITE

Convert the existing project to a Vite project.

Requirements:

Keep HTML pages.
Keep CSS.
Keep JavaScript.
Preserve file locations where possible.
Fix imports if necessary.
Ensure ES Modules are used correctly.
Configure Vite so every page works.

If multiple HTML pages exist:

Configure Vite correctly.

Do not leave broken links.

Create:

vite.config.js

Configure:

public assets
aliases if needed
clean development server
future API proxy placeholder

Example placeholder:

/api

↓

http://localhost:5000

Do NOT implement backend calls yet.

PART 3 — VERIFY PROJECT

Run through every page.

Check:

loads correctly
CSS loads
JavaScript loads
images load
icons load
fonts load
JSON fetch works
console has zero errors

Fix all discovered issues.

Create

docs/VERIFICATION_REPORT.md

Include

For every page

✔ Works

⚠ Issues

🔧 Fixed
PART 4 — DOCUMENT THE ENTIRE SYSTEM

Create

README.md

The README should be beginner friendly.

Assume the reader has never seen the project.

Explain:

Project Overview

Purpose.

Users.

Technology.

Folder structure.

How pages connect.

Future architecture.

Installation

Explain every step.

Example

Clone repository

↓

Install Node

↓

Install dependencies

↓

Run Vite

↓

Open browser

Include exact commands.

Running the Project

Include commands:

Install

npm install

Development

npm run dev

Build

npm run build

Preview

npm run preview

Explain what every command does.

Folder Structure

Explain every folder.

Not just list it.

Explain WHY it exists.

Example

services/

Contains reusable JavaScript responsible for retrieving data.

Currently uses JSON.

Future:

REST API.
PART 5 — PAGE DOCUMENTATION

Create

docs/PAGES.md

For EVERY page explain:

Purpose

Who uses it

Inputs

Outputs

Buttons

Navigation

Current implementation status

Backend endpoint required

Example

Submit Idea

Actor:

Staff User

Purpose:

Capture innovation proposals.

Current:

Static UI.

Future API:

POST /api/ideas

Repeat for every page.

PART 6 — FEATURE DOCUMENTATION

Create

docs/FEATURES.md

Table.

Columns:

Feature

Page

Status

JSON Source

Future API

Example

Feature	Status
Login	Mock
Search	Working
Sorting	Working
Reports	Placeholder
PART 7 — JSON DATA DOCUMENTATION

Create

docs/DATA.md

Explain every JSON file.

For every file:

Purpose

Fields

Relationships

Example object

Future database table

Example

ideas.json

↓

Ideas table

notifications.json

↓

Notifications table

users.json

↓

Users table

PART 8 — WHAT WORKS

Create

docs/WORKING_FEATURES.md

Categorize.

Fully Working

List everything.

Partially Working

Explain.

Placeholder

Explain.

Missing

Explain.

Be brutally honest.

PART 9 — WHAT DOES NOT WORK

Create

docs/TODO.md

Organize by priority.

High

Medium

Low

Each item should contain:

Problem

Why

Suggested fix

Files affected

Estimated effort

PART 10 — FRONTEND ARCHITECTURE

Create

docs/FRONTEND_ARCHITECTURE.md

Explain:

Pages

Navigation

Components

Utilities

Services

Data flow

How fetch works

How rendering works

How localStorage is used

How JSON will become API calls

Use diagrams.

PART 11 — BACKEND PREPARATION

Create

docs/API_PREPARATION.md

For every page list:

Current JSON

↓

Future Endpoint

Example

ideas.json

↓

GET /api/ideas

POST /api/ideas

PUT /api/ideas/{id}

DELETE /api/ideas/{id}

Repeat for every module.

PART 12 — AI HANDOVER DOCUMENTATION

Create

docs/AI_HANDOVER.md

Assume another AI knows NOTHING.

Explain:

Project purpose

Architecture

Folder structure

Coding standards

Naming conventions

Current progress

Completed features

Incomplete features

Known issues

Next recommended tasks

Do not assume prior context.

Everything required to continue must be in this document.

PART 13 — CODING STANDARDS

Create

docs/CODING_STANDARDS.md

Include:

JavaScript conventions

Folder conventions

CSS conventions

HTML conventions

Naming conventions

File naming

Import conventions

Comment style

Error handling

PART 14 — FINAL PROJECT AUDIT

At the end generate

docs/FINAL_AUDIT.md

Include:

Project completeness %

Working pages

Broken pages

Missing functionality

Unused files

Dead links

Console errors

Recommendations

Technical debt

Next milestones

OUTPUT REQUIREMENTS

Do NOT redesign the UI.

Do NOT change business logic.

Do NOT remove pages.

Do NOT delete existing files unless absolutely necessary.

Preserve existing styling.

Document every change.

Every generated Markdown document must be written so clearly that a first-year computer science student—or another AI with no prior context—can understand:

what the project is,
how to run it,
how it is organized,
what works,
what is incomplete,
and exactly what should be built next.

The repository should be left in a production-quality, well-documented state that is ready for frontend completion followed by ASP.NET Core API Gateway and microservices integration.