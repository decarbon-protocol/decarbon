-- noinspection SqlNoDataSourceInspectionForFile

/*  Reporting
    - Daily transaction fee paid by address
    - Address profiler : 80/20 rule 
    - L7D data of top 80% address
*/

/* EXTRACTION */
/* Extraction Table Transactions */

CREATE TABLE IF NOT EXISTS rpt_daily_data (
  transact_date           TIMESTAMP,
    address               TEXT,
	  hash					        TEXT,	
    gas_used			        BIGINT,
    ghg_emission_as_from_address       	DECIMAL(18,4),
    ghg_emission_as_to_address          DECIMAL(18,4),
    ghg_emission       		              DECIMAL(18,4),
    ghg_emission_hourly                 DECIMAL(18,4)
  );
TRUNCATE TABLE rpt_daily_data;
INSERT INTO rpt_daily_data
  (
    transact_date 
    , address
    , gas_used
    , ghg_emission_as_from_address
    , ghg_emission_as_to_address 
    , ghg_emission
    , ghg_emission_hourly
  )
WITH t AS 

  	(   SELECT 
        DATE_TRUNC('day',block_timestamp) 	AS transact_date
        , from_address                                       	AS address 
      FROM transactions
      UNION
      SELECT 
        DATE_TRUNC('day',block_timestamp) 	AS transact_date
        , to_address                                       		AS address 
      FROM transactions
)
select
    t.transact_date
    , t.address   
    , SUM(COALESCE(ft.receipt_gas_used,0) + COALESCE(tt.receipt_gas_used,0))      					        AS gas_used
    , SUM(COALESCE(ft.emission_by_transaction,0))      		                                          AS ghg_emission_as_from_address
    , SUM(COALESCE(tt.emission_by_transaction,0))      		                                          AS ghg_emission_as_to_address
    , SUM(COALESCE(ft.emission_by_transaction,0) + COALESCE(tt.emission_by_balance,0))      		    AS ghg_emission
    , SUM(COALESCE(ft.emission_by_transaction,0) + COALESCE(tt.emission_by_balance,0)) / 24.0 	    AS ghg_emission_hourly
from  t  
LEFT JOIN transactions ft 
	ON t.address = ft.from_address
LEFT JOIN transactions tt 
  ON t.address = tt.to_address 
GROUP BY t.transact_date, t.address  ;
---------------------
--- Address Profiler 
DROP TABLE IF EXISTS rpt_address_profiler;
CREATE TABLE IF NOT EXISTS rpt_address_profiler (
    address                               TEXT,
    gas_used                              DECIMAL(18,4),
    ghg_emission_as_from_address          DECIMAL(18,4),
    ghg_emission_as_to_address            DECIMAL(18,4),
    ghg_emission                          DECIMAL(18,4),
    ghg_emission_hourly                   DECIMAL(18,4),
    ghg_emission_group                    TEXT
    
  );
TRUNCATE TABLE rpt_address_profiler;
INSERT INTO rpt_address_profiler 
  (
    address
    , gas_used
    , ghg_emission_as_from_address
    , ghg_emission_as_to_address
    , ghg_emission
    , ghg_emission_hourly
  	, ghg_emission_group
  )
WITH step_1 AS
	(-- get total fee and emission per address last 7 days
  SELECT 
      address                                   AS address   
      , SUM(gas_used)                           AS total_gas_used
      , SUM(ghg_emission_as_from_address)       AS total_ghg_emission_as_from_address
      , SUM(ghg_emission_as_to_address)         AS total_ghg_emission_as_to_address
      , SUM(ghg_emission)                       AS total_ghg_emission 
  FROM rpt_daily_data
  WHERE transact_date >= ( (SELECT MAX(transact_date) FROM rpt_daily_data) - INTERVAL '7 day') 
	GROUP BY address
	)
  , step_2 AS 
  (-- get percent rank of total fee and emission per address last 7 days
  SELECT 
    address
	  , total_gas_used
    , total_ghg_emission_as_from_address
    , total_ghg_emission_as_to_address
	  , total_ghg_emission
    , percent_rank() OVER (ORDER BY total_ghg_emission) AS ghg_emission_percent_rank
  FROM step_1
  )
SELECT 
  address
  , total_gas_used
  , total_ghg_emission_as_from_address
  , total_ghg_emission_as_to_address
  , total_ghg_emission
  , total_ghg_emission / (7*24.0) AS ghg_emission_hourly
  , CASE 
      WHEN ghg_emission_percent_rank >= 0.8 THEN 'Top_20' 
      ELSE 'The_rest' END AS ghg_emission_group
FROM step_2;
------


------
--- DIM Date 

CREATE TABLE IF NOT EXISTS dim_date
(
  date_dim_id              INT NOT NULL,
  date_actual              DATE NOT NULL,
  epoch                    BIGINT NOT NULL,
  day_suffix               VARCHAR(4) NOT NULL,
  day_name                 VARCHAR(9) NOT NULL,
  day_of_week              INT NOT NULL,
  day_of_month             INT NOT NULL,
  day_of_quarter           INT NOT NULL,
  day_of_year              INT NOT NULL,
  week_of_month            INT NOT NULL,
  week_of_year             INT NOT NULL,
  week_of_year_iso         CHAR(10) NOT NULL,
  month_actual             INT NOT NULL,
  month_name               VARCHAR(9) NOT NULL,
  month_name_abbreviated   CHAR(3) NOT NULL,
  quarter_actual           INT NOT NULL,
  quarter_name             VARCHAR(9) NOT NULL,
  year_actual              INT NOT NULL,
  first_day_of_week        DATE NOT NULL,
  last_day_of_week         DATE NOT NULL,
  first_day_of_month       DATE NOT NULL,
  last_day_of_month        DATE NOT NULL,
  first_day_of_quarter     DATE NOT NULL,
  last_day_of_quarter      DATE NOT NULL,
  first_day_of_year        DATE NOT NULL,
  last_day_of_year         DATE NOT NULL,
  mmyyyy                   CHAR(6) NOT NULL,
  mmddyyyy                 CHAR(10) NOT NULL,
  weekend_indr             BOOLEAN NOT NULL
);

ALTER TABLE public.dim_date ADD CONSTRAINT dim_date_date_dim_id_pk PRIMARY KEY (date_dim_id);

CREATE INDEX dim_date_date_actual_idx
  ON dim_date(date_actual);

COMMIT;

INSERT INTO dim_date
SELECT TO_CHAR(datum, 'yyyymmdd')::INT AS date_dim_id,
       datum AS date_actual,
       EXTRACT(EPOCH FROM datum) AS epoch,
       TO_CHAR(datum, 'fmDDth') AS day_suffix,
       TO_CHAR(datum, 'TMDay') AS day_name,
       EXTRACT(ISODOW FROM datum) AS day_of_week,
       EXTRACT(DAY FROM datum) AS day_of_month,
       datum - DATE_TRUNC('quarter', datum)::DATE + 1 AS day_of_quarter,
       EXTRACT(DOY FROM datum) AS day_of_year,
       TO_CHAR(datum, 'W')::INT AS week_of_month,
       EXTRACT(WEEK FROM datum) AS week_of_year,
       EXTRACT(ISOYEAR FROM datum) || TO_CHAR(datum, '"-W"IW-') || EXTRACT(ISODOW FROM datum) AS week_of_year_iso,
       EXTRACT(MONTH FROM datum) AS month_actual,
       TO_CHAR(datum, 'TMMonth') AS month_name,
       TO_CHAR(datum, 'Mon') AS month_name_abbreviated,
       EXTRACT(QUARTER FROM datum) AS quarter_actual,
       CASE
           WHEN EXTRACT(QUARTER FROM datum) = 1 THEN 'First'
           WHEN EXTRACT(QUARTER FROM datum) = 2 THEN 'Second'
           WHEN EXTRACT(QUARTER FROM datum) = 3 THEN 'Third'
           WHEN EXTRACT(QUARTER FROM datum) = 4 THEN 'Fourth'
           END AS quarter_name,
       EXTRACT(YEAR FROM datum) AS year_actual,
       datum + (1 - EXTRACT(ISODOW FROM datum))::INT AS first_day_of_week,
       datum + (7 - EXTRACT(ISODOW FROM datum))::INT AS last_day_of_week,
       datum + (1 - EXTRACT(DAY FROM datum))::INT AS first_day_of_month,
       (DATE_TRUNC('MONTH', datum) + INTERVAL '1 MONTH - 1 day')::DATE AS last_day_of_month,
       DATE_TRUNC('quarter', datum)::DATE AS first_day_of_quarter,
       (DATE_TRUNC('quarter', datum) + INTERVAL '3 MONTH - 1 day')::DATE AS last_day_of_quarter,
       TO_DATE(EXTRACT(YEAR FROM datum) || '-01-01', 'YYYY-MM-DD') AS first_day_of_year,
       TO_DATE(EXTRACT(YEAR FROM datum) || '-12-31', 'YYYY-MM-DD') AS last_day_of_year,
       TO_CHAR(datum, 'mmyyyy') AS mmyyyy,
       TO_CHAR(datum, 'mmddyyyy') AS mmddyyyy,
       CASE
           WHEN EXTRACT(ISODOW FROM datum) IN (6, 7) THEN TRUE
           ELSE FALSE
           END AS weekend_indr
FROM (SELECT '2020-01-01'::DATE + SEQUENCE.DAY AS datum
      FROM GENERATE_SERIES(0, 3000) AS SEQUENCE (DAY)
      GROUP BY SEQUENCE.DAY) DQ
ORDER BY 1;

