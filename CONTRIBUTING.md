# Contributing to Wuru Med Quote

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

## 🚀 Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wuru-med-quote
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📏 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Prefer interfaces over types when possible
- Use strict TypeScript configuration

### Code Style
- Use Prettier for code formatting: `npm run format`
- Follow ESLint rules: `npm run lint`
- Use meaningful variable and function names
- Write self-documenting code

### Component Structure
```typescript
// ✅ Good
interface ComponentProps {
  title: string;
  isLoading?: boolean;
}

const Component: React.FC<ComponentProps> = ({ title, isLoading = false }) => {
  // Component logic
  return <div>{title}</div>;
};

export default Component;
```

### File Organization
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (buttons, inputs)
│   └── features/       # Feature-specific components
├── services/           # API and external service logic
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── constants/          # Application constants
```

## 📝 Commit Convention

We use [Conventional Commits](https://conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(auth): add user authentication system
fix(ui): resolve mobile navigation issue
docs(readme): update installation instructions
```

## 🔄 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Follow coding standards
   - Add tests for new features
   - Update documentation as needed

3. **Run quality checks**
   ```bash
   npm run type-check
   npm run lint
   npm run test
   npm run format:check
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(component): add new feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feat/your-feature-name
   ```

## 🧪 Testing

- Write tests for all new features
- Use Vitest for unit testing
- Test components with React Testing Library
- Aim for >80% code coverage

### Running Tests
```bash
npm run test          # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

### Test Structure
```typescript
// ComponentName.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

## 🐛 Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (browser, OS, etc.)

## 💡 Suggesting Features

For feature requests:
- Check existing issues first
- Provide clear use case and benefits
- Include mockups or examples if helpful
- Be open to discussion and feedback

Thank you for contributing to make this project better! 🚀