# 📝 MK2PDF Pro

**A powerful, privacy-first online Markdown to PDF editor built with Next.js.**

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16+-black)
![React](https://img.shields.io/badge/React-19-61dafb)
![License](https://img.shields.io/badge/License-MIT-green)

MK2PDF is a modern web application that allows you to write Markdown and instantly convert it into beautiful, high-fidelity PDF documents. It runs entirely client-side, ensuring your data never leaves your browser.

---

## ✨ Features

- **Split-Pane Editing**: Write Markdown comfortably in a dedicated CodeMirror 6 editor with syntax highlighting, while viewing the styled output in real-time.
- **High-Fidelity PDF Generation**: Uses `html2pdf.js` to capture the exact layout, styling, and formatting of your document for pixel-perfect PDF exports.
- **Rich Markdown Support (GFM)**: Fully supports GitHub Flavored Markdown, including tables, task lists, strikethrough, blockquotes, and deep syntax highlighting for code blocks.
- **Formatting Toolbar**: One-click insertion for common Markdown syntax right at your cursor position.
- **Professional Templates**: Start fast with pre-built templates for READMEs, Resumes, Blog Posts, Meeting Notes, and API Documentation.
- **Configurable Exports**: Customize your PDF output with options for A4/Letter page sizes, margin adjustments, and image quality.
- **Privacy-First**: Zero server uploads. The entire parsing and rendering lifecycle happens securely inside your local browser.
- **Premium Design System**: Features a custom-built, responsive UI with glassmorphism effects, a polished dark theme (with light mode toggle), and optimized typography using Inter and JetBrains Mono.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Editor Core**: [CodeMirror 6](https://codemirror.net/) via `@uiw/react-codemirror`
- **Markdown Parsing**: `react-markdown` + `remark-gfm` + `rehype-highlight`
- **PDF Engine**: `html2pdf.js`
- **Styling**: Vanilla CSS Custom Properties (CSS Variables)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/mk2pdf.git
   cd mk2pdf
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open your browser and navigate to \`http://localhost:3000\`.

---

## ⌨️ Keyboard Shortcuts

| Shortcut         | Action                |
| :--------------- | :-------------------- |
| **Ctrl/Cmd + S** | Open PDF Export Modal |
| **Ctrl/Cmd + B** | Insert **Bold** text  |
| **Ctrl/Cmd + I** | Insert _Italic_ text  |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
