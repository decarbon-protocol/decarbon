-- CreateTable
CREATE TABLE "blocks" (
    "number" BIGINT,
    "hash" TEXT NOT NULL,
    "parent_hash" TEXT,
    "nonce" TEXT,
    "sha3_uncles" TEXT,
    "logs_bloom" TEXT,
    "transactions_root" TEXT,
    "state_root" TEXT,
    "receipts_root" TEXT,
    "miner" TEXT,
    "difficulty" DECIMAL(38,0),
    "total_difficulty" DECIMAL(38,0),
    "size" BIGINT,
    "extra_data" TEXT,
    "gas_limit" BIGINT,
    "gas_used" BIGINT,
    "timestamp" TIMESTAMP(6),
    "transaction_count" BIGINT,

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "d_account" (
    "account_id" BIGSERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "eth_sent" DECIMAL(38,0),
    "eth_received" DECIMAL(38,0),
    "account_balance" DECIMAL(38,0),

    CONSTRAINT "d_account_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "d_block" (
    "block_id" BIGSERIAL NOT NULL,
    "timestamp" TIMESTAMP(6),
    "number" BIGINT,
    "hash" TEXT,
    "parent_hash" TEXT,
    "sha3_uncles" TEXT,
    "logs_bloom" TEXT,
    "transactions_root" TEXT,
    "state_root" TEXT,
    "receipts_root" TEXT,
    "proposer_index" TEXT,
    "difficulty" DECIMAL(38,0),
    "total_difficulty" DECIMAL(38,0),
    "size" BIGINT,
    "extra_data" TEXT,
    "gas_limit" BIGINT,
    "gas_used" BIGINT,
    "transaction_count" BIGINT,

    CONSTRAINT "d_block_pkey" PRIMARY KEY ("block_id")
);

-- CreateTable
CREATE TABLE "d_date" (
    "date" DATE NOT NULL,
    "year" INTEGER,
    "month" INTEGER,
    "day" INTEGER,
    "weekday" INTEGER,
    "day_in_chars" TEXT,
    "week" INTEGER,

    CONSTRAINT "d_date_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "d_time" (
    "time" TIME(6) NOT NULL,
    "hours" INTEGER,
    "minutes" INTEGER,
    "seconds" INTEGER,

    CONSTRAINT "d_time_pkey" PRIMARY KEY ("time")
);

-- CreateTable
CREATE TABLE "d_transaction" (
    "transaction_id" BIGSERIAL NOT NULL,
    "hash" TEXT,
    "nonce" BIGINT,
    "transaction_index" BIGINT,
    "from_address" TEXT,
    "to_address" TEXT,
    "value" DECIMAL(38,0),
    "gas" BIGINT,
    "gas_price" BIGINT,
    "input" TEXT,
    "receipt_cumulative_gas_used" BIGINT,
    "receipt_gas_used" BIGINT,
    "receipt_contract_address" TEXT,
    "receipt_status" BIGINT,
    "block_timestamp" TIMESTAMP(6),
    "block_number" BIGINT,
    "block_hash" TEXT,
    "emissionByTransaction" BIGINT,
    "emissionByBalance" BIGINT,

    CONSTRAINT "d_transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "f_blockchain" (
    "block_id" BIGINT NOT NULL,
    "transaction_id" BIGINT NOT NULL,
    "account_from_address" TEXT NOT NULL,
    "account_to_address" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "time" TIME(6) NOT NULL
);

-- CreateTable
CREATE TABLE "token_transfers" (
    "token_address" TEXT,
    "from_address" TEXT,
    "to_address" TEXT,
    "value" DECIMAL(88,0),
    "transaction_hash" TEXT NOT NULL,
    "log_index" BIGINT NOT NULL,
    "block_timestamp" TIMESTAMP(6),
    "block_number" BIGINT,
    "block_hash" TEXT,

    CONSTRAINT "token_transfers_pkey" PRIMARY KEY ("transaction_hash","log_index")
);

-- CreateTable
CREATE TABLE "transactions" (
    "hash" TEXT NOT NULL,
    "nonce" BIGINT,
    "transaction_index" BIGINT,
    "from_address" TEXT,
    "to_address" TEXT,
    "value" DECIMAL(38,0),
    "gas" BIGINT,
    "gas_price" BIGINT,
    "input" TEXT,
    "receipt_cumulative_gas_used" BIGINT,
    "receipt_gas_used" BIGINT,
    "receipt_contract_address" TEXT,
    "receipt_root" TEXT,
    "receipt_status" BIGINT,
    "block_timestamp" TIMESTAMP(6),
    "block_number" BIGINT,
    "block_hash" TEXT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("hash")
);

-- AddForeignKey
ALTER TABLE "f_blockchain" ADD CONSTRAINT "fk_d_Transaction" FOREIGN KEY ("transaction_id") REFERENCES "d_transaction"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "f_blockchain" ADD CONSTRAINT "fk_d_account_from" FOREIGN KEY ("account_from_address") REFERENCES "d_account"("address") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "f_blockchain" ADD CONSTRAINT "fk_d_account_to" FOREIGN KEY ("account_to_address") REFERENCES "d_account"("address") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "f_blockchain" ADD CONSTRAINT "fk_d_block" FOREIGN KEY ("block_id") REFERENCES "d_block"("block_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "f_blockchain" ADD CONSTRAINT "fk_d_date" FOREIGN KEY ("date") REFERENCES "d_date"("date") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "f_blockchain" ADD CONSTRAINT "fk_d_time" FOREIGN KEY ("time") REFERENCES "d_time"("time") ON DELETE NO ACTION ON UPDATE NO ACTION;
