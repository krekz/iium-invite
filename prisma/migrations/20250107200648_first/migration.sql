-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "matricNo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "iiumEmail" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "poster_url" TEXT[],
    "date" TIMESTAMP(3) NOT NULL,
    "registrationEndDate" TIMESTAMP(3),
    "campus" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "fee" TEXT,
    "registration_link" TEXT,
    "categories" TEXT[],
    "has_starpoints" BOOLEAN NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isRecruiting" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_matricNo_key" ON "User"("matricNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_iiumEmail_key" ON "User"("iiumEmail");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Event_id_key" ON "Event"("id");

-- CreateIndex
CREATE INDEX "Event_registrationEndDate_isActive_idx" ON "Event"("registrationEndDate", "isActive");

-- CreateIndex
CREATE INDEX "Event_date_isActive_idx" ON "Event"("date", "isActive");

-- CreateIndex
CREATE INDEX "Event_isActive_idx" ON "Event"("isActive");

-- CreateIndex
CREATE INDEX "Event_authorId_idx" ON "Event"("authorId");

-- CreateIndex
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");

-- CreateIndex
CREATE INDEX "Bookmark_eventId_idx" ON "Bookmark"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_eventId_key" ON "Bookmark"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("matricNo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("matricNo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
