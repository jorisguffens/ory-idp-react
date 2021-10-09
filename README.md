# Ory Identity Provider React

This is a self service user interface for [ORY Kratos](https://github.com/ory/kratos) written in [React](https://github.com/facebook/react).
It also has the UI elements and backend for oauth2 with [ORY Hydra](https://github.com/ory/hydra).

Following self service features are implemented:
* Login, Register, Logout
* OAuth2 Consent

More features will be implemented while ORY Kratos develops.

TODO List:
* Change user information
* Change security settings
* Password reset
* Email and SMS verification
* Multi-Factor Authentication
* Delete user

## How to run

### First setup

**1. Change the secret values in the following files:**
* kratos/.kratos.yml
* docker-compose.yml

**2. Make a copy of `.env.example`, rename it to `.env` and fill it in.**

### Start the application

**1. Start all docker containers.**

Windows
```
docker-compose up -d
```

Linux
```
docker-compose up -f docker-compose.yml -f docker-compose.linux.yml -d
```


**2. Start the React application.**
```
cd frontend
npm install
npm start
```

**3. Start the backend server for handling OAuth2 (optional).**
```
cd backend
npm install
npm start
```