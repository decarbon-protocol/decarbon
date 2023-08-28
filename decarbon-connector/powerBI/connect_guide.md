# DEMO: Database & Power BI sample
---------------
### Database :
* Data produced by deCarbon protocol is stored in a Postgres cloud database 
* Core table: **transactions** (contain data of all transactions and estimated KgC02 produced by each address in each transcation)

| Column Name             | Meaning                                                         |
| ----------------------- | --------------------------------------------------------------- |
| from_address            | smart contract address                                          |
| to_address              | smart contract address                                          |
| gas_used                | network gas used in the transcation address                     |
| emission_by_balance     | estimated KgC02 produced by         sender of the transaction   |
| emission_by_transcation | estimated KgC02 produced by         receiver of the transaction |


### Defining table for visualization: 
We aggregated blockchain data in to smaller tables to enable fast data retrieveing for visualization

**Table** : **rpt_daily_data**
Purpose : Store aggreated transaction data at address level, daily frequency
| Column Name                  | Meaning                                     |
| ---------------------------- | ------------------------------------------- |
| transact_date                | smart contract address                      |
| address                      | smart contract address                      |
| hash                         | network gas used in the transcation address |
| gas_used                     | estimated KgC02                             |
| ghg_emission_as_from_address | estimated KgC02                             |
| ghg_emission_as_to_address   | estimated KgC02                             |
| ghg_emission                 | estimated KgC02                             |
| ghg_emission_hourly          | estimated KgC02 per hour                    |


**TABLE** : **rpt_address_profiler**
Purpose : Profiling address base on estimated amount of C02 emission produces, using data of last 7 day
| Column Name                  | Meaning                                                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| address                      | smart contract address                                                                                                                                  |
| gas_used                     | gas used in the transaction                                                                                                                             |
| ghg_emission_as_from_address | estimated KgC02 when address is the sender in the transaction                                                                                           |
| ghg_emission_as_to_address   | estimated KgC02 when address is the receiver in the transaction                                                                                         |
| ghg_emission                 | estimated total KgC02 emission                                                                                                                          |
| ghg_emission_hourly          | estimated total KgC02 emission per hour                                                                                                                 |
| ghg_emission_group           | classification of each address based on total KgC02 emission (Top_20: 20% addresses with highest amount of emission; The_rest: the remaining addresses) |


### Power BI connection and sample dashboard
* We use Postgres ODBC to connect Postgres databas. 
* Power BI use ODBC to get data for visualization from table 
rpt_daily_data and rpt_address_profiler.


