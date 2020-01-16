# CREATE MATERIALIZED VIEW distinct_devices_all_time AS SELECT DISTINCT payloads.device_id FROM payloads WHERE (payloads.created_at <= CURRENT_DATE);
# CREATE MATERIALIZED VIEW distinct_devices_last_7 AS SELECT DISTINCT payloads.device_id FROM payloads WHERE ((payloads.created_at <= CURRENT_DATE) AND (payloads.created_at > (CURRENT_DATE - '7 days'::interval)));
# CREATE MATERIALIZED VIEW distinct_devices_last_30 AS SELECT DISTINCT payloads.device_id FROM payloads WHERE ((payloads.created_at <= CURRENT_DATE) AND (payloads.created_at > (CURRENT_DATE - '30 days'::interval)));
# CREATE MATERIALIZED VIEW total_payloads_all_time AS SELECT count(*) AS count FROM payloads WHERE (payloads.created_at <= CURRENT_DATE);
# CREATE MATERIALIZED VIEW total_payloads_last_30 AS SELECT count(*) AS count FROM payloads WHERE ((payloads.created_at <= CURRENT_DATE) AND (payloads.created_at > (CURRENT_DATE - '30 days'::interval)));
# CREATE MATERIALIZED VIEW distinct_hotspots_all_time AS SELECT DISTINCT payloads.hotspot_id FROM payloads WHERE (payloads.created_at <= CURRENT_DATE);
# CREATE MATERIALIZED VIEW total_payloads_last_7 AS SELECT count(*) AS count FROM payloads WHERE ((payloads.created_at <= CURRENT_DATE) AND (payloads.created_at > (CURRENT_DATE - '7 days'::interval)));
# CREATE MATERIALIZED VIEW distinct_hotspots_last_30 AS SELECT DISTINCT payloads.hotspot_id FROM payloads WHERE ((payloads.created_at <= CURRENT_DATE) AND (payloads.created_at > (CURRENT_DATE - '30 days'::interval)));
# CREATE MATERIALIZED VIEW distinct_hotspots_last_7 AS SELECT DISTINCT payloads.hotspot_id FROM payloads WHERE ((payloads.created_at <= CURRENT_DATE) AND (payloads.created_at > (CURRENT_DATE - '7 days'::interval)));

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
