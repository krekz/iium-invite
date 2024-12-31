# Eventure Project (Next Js 15) 🎓 

A platform for handling university events. 

https://github.com/user-attachments/assets/a8dbf190-f0e9-4190-b834-66386f36120a

## **Tech Stacks**
> ### Nextjs 15
> ### Shadcn Ui
> ### Supabase
> ### Prisma accelerate
> ### Resend (email)
> ### Next Auth


# Contributing 🍝 

## Prerequisites
- NodeJs v22.11.0 [Install Nodejs](https://nodejs.org/en/download)
- Package Manager (bun)  [Install bun](https://bun.sh)
- Supabase acc [Create Supabase Acc](https://supabase.com)
- Resend (sending email library) [Create Resend Acc](https://resend.com)
- Prisma Console Acc (Required bcs this project is using prisma accelerate [Create prisma acc](https://console.prisma.io)
- Google Console (oAuth api key) [Google Console](https://console.cloud.google.com/apis/credentials)

> [!Note]
> Remember to set up Authorized redirect URIs in [Google Console Auth](https://console.cloud.google.com/apis/credentials)
<img width="516" alt="Screenshot 2024-12-31 at 4 55 32 PM" src="https://github.com/user-attachments/assets/0facdae5-c561-4e34-9484-287b43929b36" />


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
