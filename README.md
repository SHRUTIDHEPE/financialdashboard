# financialdashboard
A robust backend system for a finance dashboard with role-based access control, built with Node.js, Express, and MongoDB.


## Features

- **User & Role Management**: Create users, assign roles (viewer, analyst, admin), and manage user status (active/inactive)
- **Financial Records Management**: Full CRUD operations for income/expense records with filtering and pagination
- **Dashboard Analytics**: Aggregated summaries including total income/expense, net balance, category-wise totals, and monthly/weekly trends
- **Role-Based Access Control**: Granular permissions for different user roles:
  - **Viewer**: Can only view dashboard summaries
  - **Analyst**: Can view records and dashboard summaries
  - **Admin**: Full access to manage records and users
- **Validation & Error Handling**: Comprehensive input validation and meaningful error responses
- **Security**: JWT authentication, password hashing, rate limiting, Helmet.js security headers

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, express-rate-limit, cors
- **Validation**: express-validator

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend.
2.install the dependencies:
npm install;
3.create .env file:
it should contain :
url for mongodb connection,port,jwt_secret,jwt_expire,node_env.
4.run seed database :npm run seed
5.start the server:npm start or npm run dev