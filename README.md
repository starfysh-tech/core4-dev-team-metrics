# Core4

A modern web application for measuring and improving engineering team effectiveness using the Core4 framework. This tool helps engineering teams assess their performance across 10 key dimensions that are proven to impact team productivity and happiness.

The Core4 framework measures:

- Speed - PR Throughput
- Quality - Change Failure Rate
- Impact - % of time on new capabilities
- Effectiveness - Developer Experience Index (DXI)

Each dimension is evaluated through specific metrics and survey questions, providing actionable insights for improvement.

[![Deployed on fly.io](https://img.shields.io/badge/deployed%20on-fly.io-blue)](https://core4.starfysh.net)

## 📚 References

This application is inspired by:

- [Introducing Core4: The Best Way to Measure Engineering Team Effectiveness](https://www.lennysnewsletter.com/p/introducing-core-4-the-best-way-to) by Lenny Rachitsky
- [Core4 Survey Template](https://docs.google.com/spreadsheets/d/1brKPLRJ9DDQAAFr1GM4hcFZg9zGUAGplQw2OkVx52Ls/edit?gid=0#gid=0)

## 🚀 Live

Visit [https://core4.starfysh.net](https://core4.starfysh.net)

## 🎮 Demo Data

The application comes pre-loaded with demo data to help you explore its features. 

No login is required - just use the team name `demo` to see the demo data.

## 🔧 Technologies

This project leverages modern web technologies for optimal performance and developer experience:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn-ui
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Deployment**: fly.io
- **Error Monitoring**: Sentry
- **State Management**: React Query
- **Form Handling**: React Hook Form
- **Data Visualization**: Recharts

## 🚦 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or later)
- npm (v9 or later)
- A Supabase account and project
- Git

We recommend using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage Node.js versions.

## 🛠️ Local Development

1. Clone the repository

    ```bash
    git clone <repository-url>
    cd core4
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Set up environment variables

    ```bash
    cp .env.example .env
    ```

    Edit `.env` with your Supabase and Sentry credentials:

    ```bash
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_SENTRY_DSN=your_sentry_dsn
    ```

4. Start the development server

    ```bash
    npm run dev
    ```

## 🏗️ Architecture

The application follows a modern React architecture with:

- Route-based code splitting
- Component-driven development using shadcn-ui
- Type-safe API calls with Supabase
- Real-time updates for collaborative features
- Error boundary implementation with Sentry integration

## 🔐 Authentication

None! This is a public tool.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your fork
5. Submit a pull request

## 🐛 Bug Reports

If you encounter any issues, please report them in the project's issue tracker with:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable

## 📝 License

[LICENSE](./LICENSE)
