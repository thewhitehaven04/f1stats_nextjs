-- CreateTable
CREATE TABLE "subscriptions" (
    "id" BIGSERIAL NOT NULL,
    "subscription" JSONB NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);
