-- CreateTable
CREATE TABLE "CardDetails" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "card_brand" TEXT NOT NULL,
    "last_4" TEXT NOT NULL,
    "exp_month" BIGINT NOT NULL,
    "exp_year" BIGINT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "card_type" TEXT NOT NULL,
    "prepaid_type" TEXT NOT NULL,
    "bin" TEXT NOT NULL,
    "entry_method" TEXT NOT NULL,
    "cvv_status" TEXT NOT NULL,
    "avs_status" TEXT NOT NULL,
    "statement_description" TEXT NOT NULL,
    "authorised_at" TEXT NOT NULL,
    "captured_at" TEXT NOT NULL,

    CONSTRAINT "CardDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "delay_duration" TEXT NOT NULL,
    "delay_action" TEXT NOT NULL,
    "delayed_until" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "risk_level" TEXT NOT NULL,
    "receipt_number" TEXT NOT NULL,
    "receipt_url" TEXT NOT NULL,
    "square_product" TEXT NOT NULL,
    "application_details" TEXT NOT NULL,
    "version_token" TEXT NOT NULL,
    "cardDetailsId" TEXT NOT NULL,
    "approved_mount" BIGINT NOT NULL,
    "total_mount" BIGINT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL,
    "total_price" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_cardDetailsId_fkey" FOREIGN KEY ("cardDetailsId") REFERENCES "CardDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
