# HF-Web Image Generator

A modern web application for generating images using various AI models. Built with React and Vite for optimal performance.

## Features

- Image generation from text prompts
- Multiple AI model support
- Customizable image dimensions
- Real-time generation status
- Image download functionality
- Rate limiting protection

## Tech Stack

- **Frontend**: React 18 with Vite
- **Build Tool**: Vite 6
- **Styling**: CSS Modules
- **State Management**: React Hooks
- **API Integration**: Fetch API with proxy support

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd hf-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Development

The project uses Vite for development and building. Key commands:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
  ├── components/
  │   └── ImageGenerator/
  │       ├── DimensionControls.jsx
  │       ├── ImageDisplay.jsx
  │       ├── ModelSelector.jsx
  │       ├── PromptInput.jsx
  │       ├── ImageGenerator.jsx
  │       ├── ImageGenerator.css
  │       └── ModelSelector.css
  ├── services/
  │   └── imageService.js
  ├── App.jsx
  ├── App.css
  ├── index.css
  └── main.jsx
```

## API Integration

The application communicates with a backend server running on port 5000. API endpoints:

- `/api/image/generate` - Generate new images
- `/api/image/cancel` - Cancel ongoing generation
- Download functionality handled client-side

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
