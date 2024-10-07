# Eventure Project (Next Js 14)

A platform for handling university events, created with Next.js 14, Supabase, and Prisma.

https://github.com/user-attachments/assets/a8dbf190-f0e9-4190-b834-66386f36120a


> [!IMPORTANT]
> Create your [Supabase](https://supabase.com/) account before proceed to Development

> [!Note]
> If you want to alter/modify the db schema and then push changes later on, please run 
```
## Do not run this during first-time setup
npx prisma migrate dev 
```

# Getting Started (First-Time Set up)

1. Clone the project repository and navigate to the project directory:
```
git clone https://github.com/krekz/iium-invite.git
cd iium-invite
```
2. Install the dependencies:
```
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Make .env file
```
touch .env
```

4. Copy the content inside _.env.example_ and paste to _.env_ file you created
5. in your terminal execute this command to sync with the existed db schema:
```
npx prisma db push
```



Finally, run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```




