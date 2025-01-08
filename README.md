# IIUM Event Management Platform 🎓 

 This platform is designed to help users discover, participate in and manage events.

https://github.com/user-attachments/assets/a8dbf190-f0e9-4190-b834-66386f36120a


## Features ✨

- **Event Discovery**: Browse through a wide range of events.
- **IIUM Login for Authentication**: Secure login using IIUM credentials.
- **AI Recommendations**: Personalized event recommendations based on user preferences.
-  [Markdown](https://markdownlivepreview.com/) **Support for Event Descriptions**: Rich text formatting for event details using Markdown.
- **Bookmarks**: Save events for later viewing.

## Tech Stack 🧑‍💻

### Frontend
- **[Next.js 15](https://nextjs.org/)**: A React framework for server-rendered applications, optimized for performance and SEO.
- **[shadcn/ui](https://ui.shadcn.com/)**: A collection of beautifully designed, accessible and customizable UI components.
- **[React Query](https://tanstack.com/query/v4)**: For efficient data fetching, caching and synchronization.
- **[Markdown](https://markdownlivepreview.com/)**: A Markdown parser for rich text descriptions.

### Backend
- **[Supabase](https://supabase.io/)**: An open-source Firebase alternative for database
- **[Prisma ORM](https://www.prisma.io/)**: A modern TypeScript ORM for database management and migrations.
- **IIUM Login**: Secure authentication using [I-Ma'luum](https://imaluum.iium.edu.my) credentials.
- **[OpenAI](https://platform.openai.com/docs/overview)**: Custom AI model for personalized event suggestions.

# FAQ

### What is this platform about?
This platform is designed to help users discover, participate in and manage events. It includes features like AI-powered recommendations, Markdown support for event descriptions and bookmarking for saving events.

### Is my data safe?
Authentication is handled securely through **IIUM Login**. Users log in using their IIUM credentials and no passwords are stored in our database. We only store minimal user information like `userID`, `name`, `matric number` and `email` for identification.
You may see our codebase implementation [here](https://github.com/krekz/iium-invite/blob/main/src/actions/authentication/login.ts)

### Why do you need to store my information in the database?
We store minimal user information like `userID`, `name`, `matric number` and `email` to ensure the platform functions properly. This information is necessary for features like creating events, managing bookmarks and personalizing your experience. Rest assured, we do not store sensitive data like passwords and all information is handled securely.

### Can I use Markdown for event descriptions?
Yes, event organizers can use [Markdown](https://markdownlivepreview.com) to format their event descriptions, allowing for rich text formatting like headings, lists and links.

### How do I update my profile information?
To update your profile information, such as your name or contact details, you will need to make the changes through your official IIUM account [i-Ma'luum](https://imaluum.iium.edu.my). The platform syncs with IIUM's system to ensure your information is accurate and up-to-date. Note that your matric number cannot be changed for security reasons.

### How do I report an issue or provide feedback?
Unfortunately, we currently only accept issue reports and feedback through our [GitHub Issues](https://github.com/krekz/iium-invite/issues) page. This helps us track and resolve problems more efficiently. We appreciate your understanding and input to help improve the platform!

# Contributing 🍝 

## Prerequisites
- NodeJs v22.11.0 [Install Nodejs](https://nodejs.org/en/download)
- Package Manager (bun)  [Install bun](https://bun.sh)
- Supabase acc [Create Supabase Acc](https://supabase.com)
- Prisma Console Acc (Required bcs this project is using prisma accelerate coz nextjs middleware require it [Create prisma acc](https://console.prisma.io)

## Let's Cook !!
> [!Note]
> This project already preinstalled [Biome](https://biomejs.dev) as code formatting and linting. Make sure you [install](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) the extension and set _Biome_ as your default format [here](https://andrekoenig.de/articles/biome-unified-linting-and-formatting-solution)

1. Clone the project repository and navigate to the project directory:
```
git clone https://github.com/krekz/iium-invite.git
cd iium-invite
```
2. Install the dependencies:
```
bun install
```

3. Make .env file
```
touch .env
```

4. Copy the content inside _.env.example_ and paste to _.env_ file you created
5. in your terminal execute this command to sync with the existed db schema:
```
bunx prisma db push
```

6. Finally, run the development server:
```
bun dev
```

## Development Workflow
1. Create your own branch 
```
git checkout -b feat/your-feature-name
```
2. Implement your feature or fix the bug.
3. Test your changes locally.
4. Stage and commit your changes:

## Commit Message Guidelines
> [!Note]
> We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

```
<type>(<scope>): <description>
```
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (white-space, formatting, etc.)
- refactor: Code restructuring without changing functionality
- test: Adding or updating tests

example: 
```
feat(auth): add Google login functionality
```
