# Brainly Frontend

This is the frontend for the Brainly project, built using React and TypeScript.

## Prerequisites
Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

Follow these steps to download and run the Brainly frontend:

1. **Clone the Repository**
   ```sh
   git clone <repository_url>
   cd brainly-frontend
   ```

2. **Configure Backend API**
   - Open the `config.ts` file inside the `src` folder.
   - Set the backend API URL:
   
     ```ts
     export const API_BASE_URL = "http://your-backend-url.com/api";
     ```

3. **Install Dependencies**
   ```sh
   npm install
   ```

4. **Run the Development Server**
   ```sh
   npm run dev
   ```

5. Open the browser and go to `http://localhost:5173/` (or the port specified in the output) to access the application.

## Project Structure
```
brainly-frontend/
│-- src/
│   │-- components/
│   │-- pages/
│   │-- assets/
│   │-- config.ts
│   └-- main.tsx
│-- public/
|   |__ vite.svg
|-- index.html
│-- package.json
|-- package-lock.json
|-- tsconfig.json
|-- tsconfig.app.json
|-- tsconfig.node.json
|-- eslint.config.js
│-- README.md
│-- vite.config.ts
```

## Contributing
Feel free to fork this repository and submit pull requests. Ensure to follow best coding practices and maintain code quality.

