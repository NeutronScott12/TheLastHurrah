-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'STANDARD', 'PREMIUM');

-- CreateEnum
CREATE TYPE "PRE_COMMENT_MODERATION" AS ENUM ('NONE', 'NEW_COMMENTS', 'ALL');

-- CreateEnum
CREATE TYPE "LANGUAGE" AS ENUM ('ENGLISH');

-- CreateEnum
CREATE TYPE "CATEGORY" AS ENUM ('TECH');

-- CreateEnum
CREATE TYPE "THEME" AS ENUM ('AUTO', 'DARK', 'LIGHT');

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "optionId" TEXT,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "option" TEXT NOT NULL,
    "pollId" TEXT,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "voted" TEXT[],
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "website_url" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "pinned_comment_id" TEXT,
    "commenters_ids" TEXT[],
    "subscribed_users_ids" TEXT[],
    "active_users" TEXT[],
    "thread_closed" BOOLEAN NOT NULL DEFAULT false,
    "pollId" TEXT,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "auth_secret" TEXT NOT NULL,
    "application_name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "application_owner_id" TEXT NOT NULL,
    "website_url" TEXT,
    "description" TEXT,
    "default_avatar_url" TEXT,
    "comment_policy_url" TEXT,
    "comment_policy_summary" TEXT,
    "admin_ids" TEXT[],
    "moderators_ids" TEXT[],
    "commenters_users_ids" TEXT[],
    "banned_users_by_id" TEXT[],
    "authenticated_users_ids" TEXT[],
    "adult_content" BOOLEAN NOT NULL DEFAULT false,
    "links_in_comments" BOOLEAN NOT NULL DEFAULT true,
    "email_mods_when_comments_flagged" BOOLEAN NOT NULL DEFAULT false,
    "display_comments_when_flagged" BOOLEAN NOT NULL DEFAULT false,
    "allow_images_and_videos_on_comments" BOOLEAN NOT NULL DEFAULT true,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "renewal" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT E'FREE',
    "pre_comment_moderation" "PRE_COMMENT_MODERATION" NOT NULL DEFAULT E'NONE',
    "theme" "THEME" NOT NULL DEFAULT E'AUTO',
    "category" "CATEGORY" NOT NULL DEFAULT E'TECH',
    "language" "LANGUAGE" NOT NULL DEFAULT E'ENGLISH',

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_application_name_key" ON "Application"("application_name");

-- CreateIndex
CREATE UNIQUE INDEX "Application_short_name_key" ON "Application"("short_name");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
