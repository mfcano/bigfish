# API Endpoints

This document outlines the planned API structure for the Big Fish application.

## Base URL

`http://localhost:3000/api`

## MVPs

| Method | Endpoint         | Description                       |
| :----- | :--------------- | :-------------------------------- |
| `GET`  | `/mvps`          | Get all MVP spawn times           |
| `POST` | `/mvps/:id/kill` | Report an MVP kill (starts timer) |
| `PUT`  | `/mvps/:id`      | Update MVP details                |

## Events

| Method | Endpoint             | Description          |
| :----- | :------------------- | :------------------- |
| `GET`  | `/events`            | Get upcoming events  |
| `POST` | `/events`            | Create a new event   |
| `POST` | `/events/:id/signup` | Sign up for an event |

## Guild Bank

| Method | Endpoint            | Description                 |
| :----- | :------------------ | :-------------------------- |
| `GET`  | `/bank`             | Get current bank status     |
| `POST` | `/bank/transaction` | Log a deposit or withdrawal |
