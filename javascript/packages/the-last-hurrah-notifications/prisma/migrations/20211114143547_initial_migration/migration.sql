-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "short_name" TEXT,
    "user_id" TEXT,
    "application_id" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
