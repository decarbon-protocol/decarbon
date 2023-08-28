


---------------------------------------------------------------
------- LINE CHART


---- HOW TO USE : SELECT * FROM get_line_chart_data('2023-08-21', '2023-08-28');

-- DROP FUNCTION get_line_chart_data();
CREATE OR REPLACE FUNCTION get_line_chart_data(start_date TEXT, end_date TEXT)
RETURNS TABLE (
	date_actual DATE 
	, address TEXT 
	, ghg_emission DECIMAL(18,4)
) AS $$
BEGIN
    RETURN QUERY
    SELECT  
    	dd.date_actual 
      , rdd.address AS rdd_address
      , rdd.ghg_emission AS rdd_ghg_emission
	  FROM dim_date  dd
	  LEFT JOIN rpt_daily_data rdd 
		  ON dd.date_actual = CAST(rdd.transact_date AS DATE)
    INNER JOIN 
      (SELECT t.address from rpt_address_profiler as t ORDER BY t.ghg_emission DESC LIMIT 10) rap 
      	ON rdd.address = rap.address
	  WHERE dd.date_actual BETWEEN CAST(start_date AS DATE) AND CAST(end_date AS date);
   
END;
$$ LANGUAGE PLPGSQL;


-----------------------------------------------------------------------------
------- Table address profiler table data 
---- HOW TO USE : SELECT * FROM get_table_data();

DROP FUNCTION get_table_data();
CREATE FUNCTION get_table_data()
RETURNS TABLE (
	address TEXT 
	, ghg_emission DECIMAL(18,4)
  	, ghg_emission_group TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
       CASE WHEN a.t_address IS NOT NULL THEN rap.address ELSE 'Others' END AS address_group
      , SUM(rap.ghg_emission) 												AS  ghg_emission
      , CASE WHEN a.t_address IS NULL THEN 'Others' ELSE rap.ghg_emission_group END AS ghg_emission_group_new
     FROM  rpt_address_profiler rap 
    	LEFT JOIN (SELECT 
              t.address AS t_address
            FROM rpt_address_profiler t
            ORDER BY t.ghg_emission DESC
            LIMIT 20 ) a
      ON rap.address = a.t_address
    GROUP BY address_group  , ghg_emission_group_new 
    ORDER BY   ghg_emission_group_new DESC, ghg_emission  DESC;
END;
$$ LANGUAGE PLPGSQL;



-----------------------------------------------------------------------------
---- Buuble chart
---- HOW TO USE : SELECT * FROM get_bubble_chart_data()
--------------------------------------------------

CREATE OR REPLACE FUNCTION get_bubble_chart_data()
RETURNS TABLE (
	date_actual DATE 
	, address TEXT 
	, ghg_emission DECIMAL(18,4)
  , ghg_emission_per_hour DECIMAL(18,4)
) AS $$
BEGIN
    RETURN QUERY
    SELECT  
      dd.date_actual 
      , rdd.address
      , rdd.ghg_emission 
      , rdd.ghg_emission_hourly
    FROM dim_date  dd
    LEFT JOIN rpt_daily_data rdd 
      ON dd.date_actual = CAST(rdd.transact_date AS DATE)
    INNER JOIN (SELECT t.address from rpt_address_profiler as t ORDER BY t.ghg_emission DESC LIMIT 10) rap 
      ON rdd.address = rap.address
    WHERE dd.date_actual BETWEEN CAST((Current_date - INTERVAL '7 day') AS DATE) AND Current_date ;
END;
$$ LANGUAGE PLPGSQL;








