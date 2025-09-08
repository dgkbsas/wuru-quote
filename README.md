# 🏥 Wuru Med Quote

A modern medical quotation system for Hospital Ángeles network, built with React, TypeScript, and Supabase.

## ✨ Features

- 💰 **Smart Quotation Generation** - Generate accurate medical procedure quotes
- 🏥 **Multi-Hospital Support** - Supports all Hospital Ángeles locations
- 👨‍⚕️ **Doctor Database** - Comprehensive surgeon and specialist database
- 📊 **Analytics Dashboard** - Track quotations and generate reports
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔒 **Secure Data** - HIPAA-compliant data handling with Supabase

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd wuru-med-quote
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:8080](http://localhost:8080) to see the application.

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run type-check` - Run TypeScript checks
- `npm run db:setup` - Set up database tables
- `npm run db:seed` - Seed with sample data
- `npm run format` - Format code with Prettier

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: Radix UI, Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Query (TanStack Query)
- **Testing**: Vitest, React Testing Library
- **Linting**: ESLint, Prettier
- **Build**: Vite

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (buttons, inputs)
│   └── features/       # Feature-specific components
├── services/           # API and external service logic
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── data/               # Static data (procedures, doctors, hospitals)
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Create a feature branch: `git checkout -b feat/amazing-feature`
2. Make your changes and add tests
3. Run quality checks: `npm run lint && npm run test && npm run type-check`
4. Commit using conventional commits: `git commit -m "feat: add amazing feature"`
5. Push and create a Pull Request

## 📊 Database Schema

The application uses the following main tables:

- `quotations` - Medical procedure quotations
- `procedures` - Medical procedures database  
- `doctors` - Healthcare providers information
- `hospitals` - Hospital locations and details

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | ✅ |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID | ✅ |

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy with Lovable
Simply open [Lovable](https://lovable.dev/projects/7f31e09e-6f76-443f-9343-9059c7e9cf72) and click on Share → Publish.

### Custom Domain
To connect a custom domain, navigate to Project → Settings → Domains and click Connect Domain.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](docs/)
- 🐛 [Report Issues](https://github.com/your-username/wuru-med-quote/issues)
- 💬 [Discussions](https://github.com/your-username/wuru-med-quote/discussions)

## 🏥 About Hospital Ángeles

Hospital Ángeles is one of Mexico's leading private healthcare networks, providing high-quality medical services across multiple locations throughout the country.

---

**Lovable Project URL**: https://lovable.dev/projects/7f31e09e-6f76-443f-9343-9059c7e9cf72