export interface Template {
  name: string;
  icon: string;
  description: string;
  content: string;
}

export const templates: Template[] = [
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
`,
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
`,
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
`,
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
`,
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
`,
  },
];
