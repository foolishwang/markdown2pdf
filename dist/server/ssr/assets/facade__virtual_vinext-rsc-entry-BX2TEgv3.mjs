import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React__default, { createElement, useState, useEffect, useRef, lazy, Suspense, useMemo, forwardRef, useCallback } from "react";
import { u as usePathname, g as getLayoutSegmentContext } from "../index.mjs";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { unreachable } from "devlop";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { urlAttributes } from "html-url-attributes";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";
import "../__vite_rsc_assets_manifest.js";
import "react-dom";
import "react-dom/server.edge";
import "node:async_hooks";
class ErrorBoundary extends React__default.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    if (error && typeof error === "object" && "digest" in error) {
      const digest = String(error.digest);
      if (digest === "NEXT_NOT_FOUND" || // legacy compat
      digest.startsWith("NEXT_HTTP_ERROR_FALLBACK;") || digest.startsWith("NEXT_REDIRECT;")) {
        throw error;
      }
    }
    return { error };
  }
  reset = () => {
    this.setState({ error: null });
  };
  render() {
    if (this.state.error) {
      const FallbackComponent = this.props.fallback;
      return jsx(FallbackComponent, { error: this.state.error, reset: this.reset });
    }
    return this.props.children;
  }
}
class NotFoundBoundaryInner extends React__default.Component {
  constructor(props) {
    super(props);
    this.state = { notFound: false, previousPathname: props.pathname };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.pathname !== state.previousPathname && state.notFound) {
      return { notFound: false, previousPathname: props.pathname };
    }
    return { notFound: state.notFound, previousPathname: props.pathname };
  }
  static getDerivedStateFromError(error) {
    if (error && typeof error === "object" && "digest" in error) {
      const digest = String(error.digest);
      if (digest === "NEXT_NOT_FOUND" || digest.startsWith("NEXT_HTTP_ERROR_FALLBACK;404")) {
        return { notFound: true };
      }
    }
    throw error;
  }
  render() {
    if (this.state.notFound) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
function NotFoundBoundary({ fallback, children }) {
  const pathname = usePathname();
  return jsx(NotFoundBoundaryInner, { pathname, fallback, children });
}
function LayoutSegmentProvider({ depth, children }) {
  const ctx = getLayoutSegmentContext();
  if (!ctx) {
    return children;
  }
  return createElement(ctx.Provider, { value: depth }, children);
}
function Header({ theme, onToggleTheme }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return /* @__PURE__ */ jsxs("header", { className: "header", children: [
    /* @__PURE__ */ jsx("div", { className: "header-left", children: /* @__PURE__ */ jsxs("div", { className: "logo", children: [
      /* @__PURE__ */ jsx("div", { className: "logo-icon", children: "📝" }),
      /* @__PURE__ */ jsx("span", { className: "logo-text", children: "MK2PDF" }),
      /* @__PURE__ */ jsx("span", { className: "logo-badge", children: "Pro" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "header-right", children: [
      mounted && /* @__PURE__ */ jsx(
        "button",
        {
          className: "theme-toggle",
          onClick: onToggleTheme,
          "aria-label": "Toggle theme",
          id: "theme-toggle-btn",
          children: theme === "dark" ? "☀️" : "🌙"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          className: "github-link",
          href: "https://github.com",
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": "GitHub",
          id: "github-link",
          children: "⭐"
        }
      )
    ] })
  ] });
}
const templates = [
  {
    name: "README",
    icon: "📦",
    description: "Project documentation",
    content: `# Project Name

![Version](https://img.shields.io/badge/version-1.0.0-blue)

## Overview

A brief description of what this project does and who it's for.

## Features

- ✅ Feature one with detailed description
- ✅ Feature two with detailed description
- ✅ Feature three with detailed description

## Installation

\`\`\`bash
npm install my-project
\`\`\`

## Usage

\`\`\`javascript
import { myFunction } from 'my-project';

const result = myFunction({
  option1: true,
  option2: 'value'
});

console.log(result);
\`\`\`

## API Reference

### \`myFunction(options)\`

| Parameter | Type     | Default | Description                |
| :-------- | :------- | :------ | :------------------------- |
| option1   | boolean  | false   | Enable feature one         |
| option2   | string   | ''      | Configuration value        |

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing\`)
5. Open a Pull Request

## License

[MIT](https://choosealicense.com/licenses/mit/)
`
  },
  {
    name: "Resume",
    icon: "👤",
    description: "Professional CV",
    content: `# John Doe

**Senior Software Engineer** | San Francisco, CA  
📧 john@example.com | 🔗 [linkedin.com/in/johndoe](https://linkedin.com) | 💻 [github.com/johndoe](https://github.com)

---

## Summary

Experienced software engineer with 8+ years building scalable web applications. Passionate about clean code, performance optimization, and mentoring junior developers.

---

## Experience

### Senior Software Engineer — **TechCorp Inc.**
*Jan 2022 – Present*

- Led migration of monolithic app to microservices, reducing deploy time by **60%**
- Designed and implemented real-time notification system serving **2M+ users**
- Mentored team of 5 junior engineers through code reviews and pair programming

### Software Engineer — **StartupXYZ**
*Mar 2018 – Dec 2021*

- Built customer-facing dashboard with React and TypeScript
- Implemented CI/CD pipeline reducing release cycle from 2 weeks to **2 days**
- Optimized database queries resulting in **40% faster** page loads

---

## Education

### B.S. Computer Science — **University of California, Berkeley**
*2014 – 2018* | GPA: 3.8

---

## Skills

| Category       | Technologies                                    |
| :------------- | :---------------------------------------------- |
| Languages      | TypeScript, Python, Go, Rust                    |
| Frontend       | React, Next.js, Vue.js, CSS/Sass               |
| Backend        | Node.js, Express, FastAPI, GraphQL              |
| Infrastructure | AWS, Docker, Kubernetes, Terraform              |
| Databases      | PostgreSQL, MongoDB, Redis, DynamoDB            |
`
  },
  {
    name: "Blog Post",
    icon: "✍️",
    description: "Article template",
    content: `# The Future of Web Development in 2026

*Published on March 5, 2026 • 8 min read*

---

## Introduction

The web development landscape is evolving at an unprecedented pace. In this article, we'll explore the trends that are reshaping how we build for the web.

## The Rise of AI-Assisted Development

Artificial intelligence has fundamentally changed the developer experience. From code generation to automated testing, AI tools are becoming an integral part of the development workflow.

> "The best developers won't be replaced by AI — they'll be amplified by it."

### Key Benefits

1. **Faster prototyping** — Generate boilerplate in seconds
2. **Better code quality** — AI-powered code review catches subtle bugs
3. **Accessible development** — Lower barrier to entry for new developers

## Server Components & Edge Computing

The shift towards server-side rendering with frameworks like Next.js and Remix has matured:

\`\`\`tsx
// Modern server component pattern
async function ProductPage({ id }: { id: string }) {
  const product = await db.products.findUnique({ where: { id } });

  return (
    <article>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <AddToCartButton productId={id} />
    </article>
  );
}
\`\`\`

## Performance Metrics That Matter

| Metric | Target     | Impact                          |
| :----- | :--------- | :------------------------------ |
| LCP    | < 2.5s     | User perception of load speed   |
| FID    | < 100ms    | Interactivity responsiveness    |
| CLS    | < 0.1      | Visual stability                |
| INP    | < 200ms    | Overall responsiveness          |

## Conclusion

The future of web development is **faster**, **smarter**, and more **accessible** than ever. Embrace these changes, and you'll be well-positioned for what's next.

---

*What trends are you most excited about? Share your thoughts in the comments below.*
`
  },
  {
    name: "Meeting Notes",
    icon: "📋",
    description: "Meeting summary",
    content: `# Sprint Planning — Week 10

**Date:** March 5, 2026  
**Attendees:** Alice, Bob, Charlie, Diana  
**Facilitator:** Alice

---

## Agenda

- [x] Review previous sprint outcomes
- [x] Discuss blockers and dependencies
- [ ] Plan upcoming sprint tasks
- [ ] Assign story points and owners

---

## Previous Sprint Review

### Completed ✅
- User authentication module (Bob)
- Dashboard redesign Phase 1 (Diana)
- API rate limiting implementation (Charlie)

### Carried Over ⏭️
- Payment integration — blocked by vendor API access
- Performance monitoring setup — 80% complete

---

## Discussion Points

### 1. Payment Integration Blocker

> **Action Item:** Alice to escalate API access request to vendor by EOD Friday.

### 2. New Feature Request: Export to CSV

- Priority: **Medium**
- Estimated effort: **5 story points**
- Dependencies: Data pipeline refactor (in progress)

### 3. Technical Debt

| Item                    | Priority | Owner   |
| :---------------------- | :------- | :------ |
| Upgrade React to v19    | High     | Bob     |
| Remove deprecated APIs  | Medium   | Charlie |
| Add integration tests   | Medium   | Diana   |

---

## Action Items

- [ ] **Alice:** Escalate payment vendor API access
- [ ] **Bob:** Start React 19 upgrade spike
- [ ] **Charlie:** Draft CSV export RFC
- [ ] **Diana:** Complete monitoring setup

---

*Next meeting: March 12, 2026 at 10:00 AM*
`
  },
  {
    name: "API Docs",
    icon: "🔌",
    description: "API documentation",
    content: `# API Documentation

**Base URL:** \`https://api.example.com/v1\`  
**Authentication:** Bearer token in \`Authorization\` header

---

## Authentication

All endpoints require a valid API key:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.example.com/v1/users
\`\`\`

---

## Endpoints

### Users

#### List Users

\`\`\`
GET /users
\`\`\`

**Query Parameters:**

| Parameter | Type    | Required | Description               |
| :-------- | :------ | :------- | :------------------------ |
| page      | integer | No       | Page number (default: 1)  |
| limit     | integer | No       | Items per page (max: 100) |
| search    | string  | No       | Filter by name or email   |

**Response:**

\`\`\`json
{
  "data": [
    {
      "id": "usr_abc123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
\`\`\`

#### Create User

\`\`\`
POST /users
\`\`\`

**Request Body:**

\`\`\`json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "member"
}
\`\`\`

**Response:** \`201 Created\`

---

## Error Codes

| Code | Status | Description            |
| :--- | :----- | :--------------------- |
| 400  | Bad Request | Invalid parameters  |
| 401  | Unauthorized | Missing/invalid key |
| 404  | Not Found | Resource not found    |
| 429  | Too Many Requests | Rate limited     |
| 500  | Server Error | Internal error       |

---

## Rate Limits

- **Free tier:** 100 requests/minute
- **Pro tier:** 1,000 requests/minute
- **Enterprise:** Unlimited

Rate limit headers are included in every response:

\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1709639400
\`\`\`
`
  }
];
function Toolbar({
  onInsert,
  onLoadTemplate,
  onExport,
  isExporting
}) {
  const [showTemplates, setShowTemplates] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowTemplates(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const formatActions = [
    { icon: "𝐁", title: "Bold (Ctrl+B)", insert: "**bold**" },
    { icon: "𝐼", title: "Italic (Ctrl+I)", insert: "*italic*" },
    { icon: "S̶", title: "Strikethrough", insert: "~~strikethrough~~" },
    { icon: "</>", title: "Inline Code", insert: "`code`" }
  ];
  const blockActions = [
    { icon: "H1", title: "Heading 1", insert: "# " },
    { icon: "H2", title: "Heading 2", insert: "## " },
    { icon: "H3", title: "Heading 3", insert: "### " }
  ];
  const insertActions = [
    { icon: "•", title: "Bullet List", insert: "- Item\n- Item\n- Item\n" },
    { icon: "1.", title: "Numbered List", insert: "1. First\n2. Second\n3. Third\n" },
    { icon: "☑", title: "Task List", insert: "- [ ] Task 1\n- [ ] Task 2\n- [x] Done\n" },
    { icon: "│", title: "Blockquote", insert: "> " },
    { icon: "─", title: "Horizontal Rule", insert: "\n---\n" },
    { icon: "🔗", title: "Link", insert: "[Link text](https://example.com)" },
    { icon: "🖼", title: "Image", insert: "![Alt text](https://example.com/image.png)" },
    {
      icon: "⊞",
      title: "Table",
      insert: "| Header 1 | Header 2 | Header 3 |\n| :------- | :------- | :------- |\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n"
    },
    {
      icon: "{ }",
      title: "Code Block",
      insert: '```javascript\nconst hello = "world";\nconsole.log(hello);\n```\n'
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "toolbar", children: [
    /* @__PURE__ */ jsx("div", { className: "toolbar-group", children: formatActions.map((action, i) => /* @__PURE__ */ jsx(
      "button",
      {
        className: "toolbar-btn",
        title: action.title,
        onClick: () => onInsert(action.insert),
        id: `toolbar-format-${i}`,
        children: action.icon
      },
      i
    )) }),
    /* @__PURE__ */ jsx("div", { className: "toolbar-divider" }),
    /* @__PURE__ */ jsx("div", { className: "toolbar-group", children: blockActions.map((action, i) => /* @__PURE__ */ jsx(
      "button",
      {
        className: "toolbar-btn",
        title: action.title,
        onClick: () => onInsert(action.insert),
        id: `toolbar-block-${i}`,
        children: action.icon
      },
      i
    )) }),
    /* @__PURE__ */ jsx("div", { className: "toolbar-divider" }),
    /* @__PURE__ */ jsx("div", { className: "toolbar-group", children: insertActions.map((action, i) => /* @__PURE__ */ jsx(
      "button",
      {
        className: "toolbar-btn",
        title: action.title,
        onClick: () => onInsert(action.insert),
        id: `toolbar-insert-${i}`,
        children: action.icon
      },
      i
    )) }),
    /* @__PURE__ */ jsx("div", { className: "toolbar-spacer" }),
    /* @__PURE__ */ jsxs("div", { className: "template-selector", ref: dropdownRef, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "template-btn",
          onClick: () => setShowTemplates(!showTemplates),
          id: "template-selector-btn",
          children: "📄 Templates"
        }
      ),
      showTemplates && /* @__PURE__ */ jsx("div", { className: "template-dropdown", children: templates.map((t, i) => /* @__PURE__ */ jsxs(
        "button",
        {
          className: "template-item",
          onClick: () => {
            onLoadTemplate(t.content);
            setShowTemplates(false);
          },
          id: `template-item-${i}`,
          children: [
            /* @__PURE__ */ jsx("span", { className: "template-item-icon", children: t.icon }),
            /* @__PURE__ */ jsxs("span", { className: "template-item-info", children: [
              /* @__PURE__ */ jsx("span", { className: "template-item-name", children: t.name }),
              /* @__PURE__ */ jsx("span", { className: "template-item-desc", children: t.description })
            ] })
          ]
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "export-btn",
        onClick: onExport,
        disabled: isExporting,
        id: "export-pdf-btn",
        children: isExporting ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "spinner" }),
          "Generating..."
        ] }) : /* @__PURE__ */ jsx(Fragment, { children: "📥 Download PDF" })
      }
    )
  ] });
}
let DynamicErrorBoundary;
function getDynamicErrorBoundary() {
  if (DynamicErrorBoundary)
    return DynamicErrorBoundary;
  if (!React__default.Component)
    return null;
  DynamicErrorBoundary = class extends React__default.Component {
    constructor(props) {
      super(props);
      this.state = { error: null };
    }
    static getDerivedStateFromError(error) {
      return { error: error instanceof Error ? error : new Error(String(error)) };
    }
    render() {
      if (this.state.error) {
        return React__default.createElement(this.props.fallback, {
          isLoading: false,
          pastDelay: true,
          error: this.state.error
        });
      }
      return this.props.children;
    }
  };
  return DynamicErrorBoundary;
}
const isServer = typeof window === "undefined";
function dynamic(loader, options) {
  const { loading: LoadingComponent, ssr = true } = options ?? {};
  if (!ssr) {
    if (isServer) {
      const SSRFalse = (_props) => {
        return LoadingComponent ? React__default.createElement(LoadingComponent, { isLoading: true, pastDelay: true, error: null }) : null;
      };
      SSRFalse.displayName = "DynamicSSRFalse";
      return SSRFalse;
    }
    const LazyComponent2 = lazy(async () => {
      const mod = await loader();
      if ("default" in mod)
        return mod;
      return { default: mod };
    });
    const ClientSSRFalse = (props) => {
      const [mounted, setMounted] = useState(false);
      useEffect(() => setMounted(true), []);
      if (!mounted) {
        return LoadingComponent ? React__default.createElement(LoadingComponent, { isLoading: true, pastDelay: true, error: null }) : null;
      }
      const fallback = LoadingComponent ? React__default.createElement(LoadingComponent, { isLoading: true, pastDelay: true, error: null }) : null;
      return React__default.createElement(Suspense, { fallback }, React__default.createElement(LazyComponent2, props));
    };
    ClientSSRFalse.displayName = "DynamicClientSSRFalse";
    return ClientSSRFalse;
  }
  if (isServer) {
    const LazyServer = lazy(async () => {
      const mod = await loader();
      if ("default" in mod)
        return mod;
      return { default: mod };
    });
    const ServerDynamic = (props) => {
      const fallback = LoadingComponent ? React__default.createElement(LoadingComponent, { isLoading: true, pastDelay: true, error: null }) : null;
      const lazyElement = React__default.createElement(LazyServer, props);
      const ErrorBoundary2 = LoadingComponent ? getDynamicErrorBoundary() : null;
      const content = ErrorBoundary2 ? React__default.createElement(ErrorBoundary2, { fallback: LoadingComponent }, lazyElement) : lazyElement;
      return React__default.createElement(Suspense, { fallback }, content);
    };
    ServerDynamic.displayName = "DynamicServer";
    return ServerDynamic;
  }
  const LazyComponent = lazy(async () => {
    const mod = await loader();
    if ("default" in mod)
      return mod;
    return { default: mod };
  });
  const ClientDynamic = (props) => {
    const fallback = LoadingComponent ? React__default.createElement(LoadingComponent, { isLoading: true, pastDelay: true, error: null }) : null;
    return React__default.createElement(Suspense, { fallback }, React__default.createElement(LazyComponent, props));
  };
  ClientDynamic.displayName = "DynamicClient";
  return ClientDynamic;
}
dynamic(() => import("./index-Bw0K8qWC.mjs"), {
  ssr: false,
  loading: () => /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "var(--text-muted)",
        fontSize: "14px"
      },
      children: "Loading editor..."
    }
  )
});
function Editor({ value, onChange, theme }) {
  useMemo(() => {
    const mods = import("@codemirror/lang-markdown");
    return mods;
  }, []);
  return /* @__PURE__ */ jsx(EditorInner, { value, onChange, theme });
}
function EditorInner({
  value,
  onChange,
  theme
}) {
  return /* @__PURE__ */ jsx(ClientEditor, { value, onChange, theme });
}
const ClientEditor = dynamic(
  () => import("./EditorClient-BYXpZUKq.mjs"),
  {
    ssr: false,
    loading: () => /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "var(--text-muted)",
          fontSize: "14px"
        },
        children: "Loading editor..."
      }
    )
  }
);
const changelog = "https://github.com/remarkjs/react-markdown/blob/main/changelog.md";
const emptyPlugins = [];
const emptyRemarkRehypeOptions = { allowDangerousHtml: true };
const safeProtocol = /^(https?|ircs?|mailto|xmpp)$/i;
const deprecations = [
  { from: "astPlugins", id: "remove-buggy-html-in-markdown-parser" },
  { from: "allowDangerousHtml", id: "remove-buggy-html-in-markdown-parser" },
  {
    from: "allowNode",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowElement"
  },
  {
    from: "allowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "allowedElements"
  },
  { from: "className", id: "remove-classname" },
  {
    from: "disallowedTypes",
    id: "replace-allownode-allowedtypes-and-disallowedtypes",
    to: "disallowedElements"
  },
  { from: "escapeHtml", id: "remove-buggy-html-in-markdown-parser" },
  { from: "includeElementIndex", id: "#remove-includeelementindex" },
  {
    from: "includeNodeIndex",
    id: "change-includenodeindex-to-includeelementindex"
  },
  { from: "linkTarget", id: "remove-linktarget" },
  { from: "plugins", id: "change-plugins-to-remarkplugins", to: "remarkPlugins" },
  { from: "rawSourcePos", id: "#remove-rawsourcepos" },
  { from: "renderers", id: "change-renderers-to-components", to: "components" },
  { from: "source", id: "change-source-to-children", to: "children" },
  { from: "sourcePos", id: "#remove-sourcepos" },
  { from: "transformImageUri", id: "#add-urltransform", to: "urlTransform" },
  { from: "transformLinkUri", id: "#add-urltransform", to: "urlTransform" }
];
function Markdown(options) {
  const processor = createProcessor(options);
  const file = createFile(options);
  return post(processor.runSync(processor.parse(file), file), options);
}
function createProcessor(options) {
  const rehypePlugins = options.rehypePlugins || emptyPlugins;
  const remarkPlugins = options.remarkPlugins || emptyPlugins;
  const remarkRehypeOptions = options.remarkRehypeOptions ? { ...options.remarkRehypeOptions, ...emptyRemarkRehypeOptions } : emptyRemarkRehypeOptions;
  const processor = unified().use(remarkParse).use(remarkPlugins).use(remarkRehype, remarkRehypeOptions).use(rehypePlugins);
  return processor;
}
function createFile(options) {
  const children = options.children || "";
  const file = new VFile();
  if (typeof children === "string") {
    file.value = children;
  } else {
    unreachable(
      "Unexpected value `" + children + "` for `children` prop, expected `string`"
    );
  }
  return file;
}
function post(tree, options) {
  const allowedElements = options.allowedElements;
  const allowElement = options.allowElement;
  const components = options.components;
  const disallowedElements = options.disallowedElements;
  const skipHtml = options.skipHtml;
  const unwrapDisallowed = options.unwrapDisallowed;
  const urlTransform = options.urlTransform || defaultUrlTransform;
  for (const deprecation of deprecations) {
    if (Object.hasOwn(options, deprecation.from)) {
      unreachable(
        "Unexpected `" + deprecation.from + "` prop, " + (deprecation.to ? "use `" + deprecation.to + "` instead" : "remove it") + " (see <" + changelog + "#" + deprecation.id + "> for more info)"
      );
    }
  }
  if (allowedElements && disallowedElements) {
    unreachable(
      "Unexpected combined `allowedElements` and `disallowedElements`, expected one or the other"
    );
  }
  visit(tree, transform);
  return toJsxRuntime(tree, {
    Fragment,
    components,
    ignoreInvalidStyle: true,
    jsx,
    jsxs,
    passKeys: true,
    passNode: true
  });
  function transform(node, index, parent) {
    if (node.type === "raw" && parent && typeof index === "number") {
      if (skipHtml) {
        parent.children.splice(index, 1);
      } else {
        parent.children[index] = { type: "text", value: node.value };
      }
      return index;
    }
    if (node.type === "element") {
      let key;
      for (key in urlAttributes) {
        if (Object.hasOwn(urlAttributes, key) && Object.hasOwn(node.properties, key)) {
          const value = node.properties[key];
          const test = urlAttributes[key];
          if (test === null || test.includes(node.tagName)) {
            node.properties[key] = urlTransform(String(value || ""), key, node);
          }
        }
      }
    }
    if (node.type === "element") {
      let remove = allowedElements ? !allowedElements.includes(node.tagName) : disallowedElements ? disallowedElements.includes(node.tagName) : false;
      if (!remove && allowElement && typeof index === "number") {
        remove = !allowElement(node, index, parent);
      }
      if (remove && parent && typeof index === "number") {
        if (unwrapDisallowed && node.children) {
          parent.children.splice(index, 1, ...node.children);
        } else {
          parent.children.splice(index, 1);
        }
        return index;
      }
    }
  }
}
function defaultUrlTransform(value) {
  const colon = value.indexOf(":");
  const questionMark = value.indexOf("?");
  const numberSign = value.indexOf("#");
  const slash = value.indexOf("/");
  if (
    // If there is no protocol, it’s relative.
    colon === -1 || // If the first colon is after a `?`, `#`, or `/`, it’s not a protocol.
    slash !== -1 && colon > slash || questionMark !== -1 && colon > questionMark || numberSign !== -1 && colon > numberSign || // It is a protocol, it should be allowed.
    safeProtocol.test(value.slice(0, colon))
  ) {
    return value;
  }
  return "";
}
const Preview = forwardRef(
  ({ markdown: markdownContent }, ref) => {
    return /* @__PURE__ */ jsx("div", { className: "preview-content", ref, children: /* @__PURE__ */ jsx(
      Markdown,
      {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
        children: markdownContent
      }
    ) });
  }
);
Preview.displayName = "Preview";
function ExportModal({
  isOpen,
  onClose,
  onExport,
  isExporting
}) {
  const [settings, setSettings] = useState({
    filename: "document",
    pageSize: "a4",
    margin: 10,
    quality: 0.95
  });
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "modal-overlay", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs("div", { className: "modal-header", children: [
      /* @__PURE__ */ jsx("h2", { className: "modal-title", children: "Export to PDF" }),
      /* @__PURE__ */ jsx("button", { className: "modal-close", onClick: onClose, id: "modal-close-btn", children: "✕" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "modal-body", children: [
      /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label", htmlFor: "filename-input", children: "Filename" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "filename-input",
            type: "text",
            className: "form-input",
            value: settings.filename,
            onChange: (e) => setSettings({ ...settings, filename: e.target.value }),
            placeholder: "document"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label", htmlFor: "pagesize-select", children: "Page Size" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "pagesize-select",
              className: "form-select",
              value: settings.pageSize,
              onChange: (e) => setSettings({
                ...settings,
                pageSize: e.target.value
              }),
              children: [
                /* @__PURE__ */ jsx("option", { value: "a4", children: "A4 (210 × 297 mm)" }),
                /* @__PURE__ */ jsx("option", { value: "letter", children: "Letter (8.5 × 11 in)" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label", htmlFor: "margin-input", children: "Margin (mm)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "margin-input",
              type: "number",
              className: "form-input",
              value: settings.margin,
              onChange: (e) => setSettings({
                ...settings,
                margin: parseInt(e.target.value) || 0
              }),
              min: "0",
              max: "50"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ jsx("label", { className: "form-label", htmlFor: "quality-select", children: "Image Quality" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "quality-select",
            className: "form-select",
            value: settings.quality,
            onChange: (e) => setSettings({
              ...settings,
              quality: parseFloat(e.target.value)
            }),
            children: [
              /* @__PURE__ */ jsx("option", { value: "0.8", children: "Standard (80%)" }),
              /* @__PURE__ */ jsx("option", { value: "0.95", children: "High (95%)" }),
              /* @__PURE__ */ jsx("option", { value: "1", children: "Maximum (100%)" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "modal-footer", children: [
      /* @__PURE__ */ jsx("button", { className: "btn-secondary", onClick: onClose, id: "modal-cancel-btn", children: "Cancel" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "btn-primary",
          onClick: () => onExport(settings),
          disabled: isExporting,
          id: "modal-export-btn",
          children: isExporting ? "Generating..." : "Download PDF"
        }
      )
    ] })
  ] }) });
}
const PAGE_SIZES = {
  a4: [210, 297],
  letter: [215.9, 279.4]
};
async function generatePdf(sourceElement, options) {
  const html2pdf = (await import("html2pdf.js")).default;
  const [width, height] = PAGE_SIZES[options.pageSize];
  const originalBackground = sourceElement.style.background;
  sourceElement.classList.add("pdf-render-target");
  sourceElement.style.background = "white";
  const opt = {
    margin: options.margin,
    filename: options.filename.endsWith(".pdf") ? options.filename : `${options.filename}.pdf`,
    image: { type: "jpeg", quality: options.quality },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
      windowWidth: sourceElement.scrollWidth
    },
    jsPDF: {
      unit: "mm",
      format: [width, height],
      orientation: "portrait"
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] }
  };
  try {
    await html2pdf().set(opt).from(sourceElement).save();
  } finally {
    sourceElement.classList.remove("pdf-render-target");
    sourceElement.style.background = originalBackground;
  }
}
const DEFAULT_MARKDOWN = `# Welcome to MK2PDF ✨

A powerful, privacy-first **Markdown to PDF** editor built with Next.js.

---

## Features

- ✅ **Live Preview** — See your changes in real-time
- ✅ **Rich Formatting** — Full GitHub Flavored Markdown support
- ✅ **PDF Export** — Download high-quality PDFs instantly
- ✅ **Templates** — Start with professional templates
- ✅ **Dark/Light Mode** — Choose your preferred theme
- ✅ **Privacy First** — Everything runs in your browser

## Quick Start

Try editing this text on the left panel! The preview will update instantly.

### Code Blocks

\`\`\`typescript
interface Document {
  title: string;
  content: string;
  createdAt: Date;
}

function createPdf(doc: Document): Promise<Blob> {
  // Your PDF generation logic here
  return generatePdf(doc);
}
\`\`\`

### Tables

| Feature       | Status | Priority |
| :------------ | :----: | :------: |
| Live Preview  |   ✅   |   High   |
| PDF Export    |   ✅   |   High   |
| Templates     |   ✅   |  Medium  |
| Dark Mode     |   ✅   |  Medium  |

### Blockquotes

> "The best way to predict the future is to create it."
> — Peter Drucker

### Task Lists

- [x] Install MK2PDF
- [x] Write your document
- [ ] Export to PDF
- [ ] Share with the world

---

*Made with ❤️ using Next.js, CodeMirror, and React Markdown*
`;
function Home() {
  const [markdownContent, setMarkdownContent] = useState(DEFAULT_MARKDOWN);
  const [theme, setTheme] = useState("dark");
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState(null);
  const previewRef = useRef(null);
  useEffect(() => {
    const savedTheme = localStorage.getItem("mk2pdf-theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("mk2pdf-theme", next);
      return next;
    });
  }, []);
  const showToast = useCallback(
    (message, type) => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3e3);
    },
    []
  );
  const handleInsert = useCallback(
    (text) => {
      const view = window.currentEditorView;
      if (view) {
        const selection = view.state.selection.main;
        view.dispatch({
          changes: { from: selection.from, to: selection.to, insert: text },
          selection: { anchor: selection.from + text.length }
        });
        view.focus();
      } else {
        setMarkdownContent((prev) => prev + text);
      }
    },
    []
  );
  const handleLoadTemplate = useCallback((content) => {
    setMarkdownContent(content);
  }, []);
  const handleExport = useCallback(
    async (settings) => {
      if (!previewRef.current) {
        showToast("Preview not ready. Please try again.", "error");
        return;
      }
      setIsExporting(true);
      try {
        await generatePdf(previewRef.current, {
          filename: settings.filename,
          pageSize: settings.pageSize,
          margin: settings.margin,
          quality: settings.quality
        });
        showToast("PDF downloaded successfully!", "success");
        setShowExportModal(false);
      } catch (error) {
        console.error("PDF generation failed:", error);
        showToast("Failed to generate PDF. Please try again.", "error");
      } finally {
        setIsExporting(false);
      }
    },
    [showToast]
  );
  const stats = useMemo(() => {
    const chars = markdownContent.length;
    const words = markdownContent.trim().split(/\s+/).filter((w) => w.length > 0).length;
    const lines = markdownContent.split("\n").length;
    return { chars, words, lines };
  }, [markdownContent]);
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        setShowExportModal(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        handleInsert("**bold**");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "i") {
        e.preventDefault();
        handleInsert("*italic*");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInsert]);
  return /* @__PURE__ */ jsxs("div", { className: "app-container", children: [
    /* @__PURE__ */ jsx(Header, { theme, onToggleTheme: toggleTheme }),
    /* @__PURE__ */ jsx(
      Toolbar,
      {
        onInsert: handleInsert,
        onLoadTemplate: handleLoadTemplate,
        onExport: () => setShowExportModal(true),
        isExporting
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "editor-area", children: [
      /* @__PURE__ */ jsxs("div", { className: "editor-panel", children: [
        /* @__PURE__ */ jsxs("div", { className: "panel-header", children: [
          /* @__PURE__ */ jsx("span", { children: "✏️ Editor" }),
          /* @__PURE__ */ jsx("div", { className: "panel-header-right", children: /* @__PURE__ */ jsxs("span", { className: "word-count", children: [
            stats.words,
            " words · ",
            stats.chars,
            " chars · ",
            stats.lines,
            " lines"
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "editor-wrapper", children: /* @__PURE__ */ jsx(
          Editor,
          {
            value: markdownContent,
            onChange: setMarkdownContent,
            theme
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "preview-panel", children: [
        /* @__PURE__ */ jsx("div", { className: "panel-header", children: /* @__PURE__ */ jsx("span", { children: "👁️ Preview" }) }),
        /* @__PURE__ */ jsx("div", { className: "preview-wrapper", children: /* @__PURE__ */ jsx(Preview, { ref: previewRef, markdown: markdownContent }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "status-bar", children: [
      /* @__PURE__ */ jsx("div", { className: "status-bar-left", children: /* @__PURE__ */ jsxs("div", { className: "status-indicator", children: [
        /* @__PURE__ */ jsx("span", { className: "status-dot" }),
        /* @__PURE__ */ jsx("span", { children: "Ready" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "status-bar-right", children: [
        /* @__PURE__ */ jsx("span", { children: "Markdown" }),
        /* @__PURE__ */ jsx("span", { children: "UTF-8" }),
        /* @__PURE__ */ jsx("span", { children: "Ctrl+S to export" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ExportModal,
      {
        isOpen: showExportModal,
        onClose: () => setShowExportModal(false),
        onExport: handleExport,
        isExporting
      }
    ),
    toast && /* @__PURE__ */ jsxs("div", { className: `toast toast-${toast.type}`, children: [
      toast.type === "success" ? "✅" : "❌",
      " ",
      toast.message
    ] })
  ] });
}
const export_f29e6e234fea = {
  ErrorBoundary,
  NotFoundBoundary
};
const export_0deffcb8ffd7 = {
  LayoutSegmentProvider
};
const export_73d7a23e5015 = {
  default: Home
};
export {
  export_0deffcb8ffd7,
  export_73d7a23e5015,
  export_f29e6e234fea
};
