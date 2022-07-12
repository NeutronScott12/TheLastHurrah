-- CreateEnum
CREATE TYPE "OnlineStatus" AS ENUM ('ONLINE', 'OFFLINE', 'AWAY', 'INVISBLE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MODERATOR', 'ADMIN', 'OWNER', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "AvatarFile" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "encoding" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "ETag" TEXT NOT NULL,
    "default_avatar" BOOLEAN NOT NULL DEFAULT true,
    "url" TEXT NOT NULL DEFAULT E'https://res.cloudinary.com/dmxf3jh8t/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1551876589/qzlmu4vxyomehxuo3tat.jpg',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AvatarFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "old_password" TEXT[],
    "phone_number" TEXT,
    "user_ip" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "userId" TEXT,
    "applications_joined_ids" TEXT[],
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "two_factor_authentication" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_active" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_role" "UserRole" NOT NULL DEFAULT E'USER',
    "status" "OnlineStatus" NOT NULL DEFAULT E'OFFLINE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvatarFile_userId_key" ON "AvatarFile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "AvatarFile" ADD CONSTRAINT "AvatarFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
