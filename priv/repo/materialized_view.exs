# CREATE OR REPLACE FUNCTION refresh_all_matviews() RETURNS void AS $$
# DECLARE
#     rec RECORD;
# BEGIN
#   FOR rec IN
#     SELECT matviewname from pg_matviews
#   LOOP
#     EXECUTE format('REFRESH MATERIALIZED VIEW %I;', rec.matviewname);
#     RAISE NOTICE 'Refreshed: %', rec.matviewname;
#   END LOOP;
# END;
# $$ LANGUAGE plpgsql;
# select * from total_payloads_last_7 2858860
# select * from total_payloads_last_30 13885637
# select * from total_payloads_all_time 19890399
