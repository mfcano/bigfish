# API Endpoints

This document outlines the API structure for the Big Fish application.

## Base URL

- **Local Development**: `http://localhost:8000`
- **Production**: `https://api-big-fish-9dbec.uc.a.run.app` (or similar Cloud Run URL)

## MVPs

| Method | Endpoint    | Description                                     |
| :----- | :---------- | :---------------------------------------------- |
| `GET`  | `/mvps`     | Get all tracked MVPs                            |
| `POST` | `/mvps`     | Create a new MVP to track                       |
| `GET`  | `/mvps/:id` | Get details of a specific MVP                   |
| `PUT`  | `/mvps/:id` | Update an MVP (e.g. report kill, update status) |

## Events (Planned)

| Method | Endpoint             | Description          |
| :----- | :------------------- | :------------------- |
| `GET`  | `/events`            | Get upcoming events  |
| `POST` | `/events`            | Create a new event   |
| `POST` | `/events/:id/signup` | Sign up for an event |

## Guild Bank (Planned)

| Method | Endpoint            | Description                 |
| :----- | :------------------ | :-------------------------- |
| `GET`  | `/bank`             | Get current bank status     |
| `POST` | `/bank/transaction` | Log a deposit or withdrawal |
