


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."badge_tone" AS ENUM (
    'teal',
    'warm',
    'dark'
);


ALTER TYPE "public"."badge_tone" OWNER TO "postgres";


CREATE TYPE "public"."option_group" AS ENUM (
    'Top',
    'Legs',
    'Base',
    'Color',
    'Size'
);


ALTER TYPE "public"."option_group" OWNER TO "postgres";


CREATE TYPE "public"."product_category" AS ENUM (
    'Chairs',
    'Tables',
    'Collections'
);


ALTER TYPE "public"."product_category" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."option_incompatibilities" (
    "option_id" "text" NOT NULL,
    "incompatible_with_id" "text" NOT NULL
);


ALTER TABLE "public"."option_incompatibilities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."page_content" (
    "id" "text" NOT NULL,
    "page" "text" NOT NULL,
    "section" "text" NOT NULL,
    "field_key" "text" NOT NULL,
    "field_value" "text" DEFAULT ''::"text" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."page_content" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_tag_assignments" (
    "product_id" "text" NOT NULL,
    "tag_id" "text" NOT NULL
);


ALTER TABLE "public"."product_tag_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "category" "public"."product_category" NOT NULL,
    "base_price" numeric DEFAULT 0 NOT NULL,
    "image" "text" NOT NULL,
    "description" "text",
    "dimensions" "text",
    "badge" "text",
    "badge_tone" "public"."badge_tone",
    "is_customizable" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "features" "text"[],
    "colorways_count" integer,
    "cta_label" "text",
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "featured_on_collection" boolean DEFAULT false,
    "is_homepage_featured" boolean DEFAULT false
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."table_options" (
    "id" "text" NOT NULL,
    "product_id" "text" NOT NULL,
    "option_group" "public"."option_group" NOT NULL,
    "name" "text" NOT NULL,
    "price_modifier" numeric DEFAULT 0 NOT NULL,
    "layer_url" "text" NOT NULL,
    "available" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."table_options" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tags" OWNER TO "postgres";


ALTER TABLE ONLY "public"."option_incompatibilities"
    ADD CONSTRAINT "option_incompatibilities_pkey" PRIMARY KEY ("option_id", "incompatible_with_id");



ALTER TABLE ONLY "public"."page_content"
    ADD CONSTRAINT "page_content_page_section_field_key_key" UNIQUE ("page", "section", "field_key");



ALTER TABLE ONLY "public"."page_content"
    ADD CONSTRAINT "page_content_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_tag_assignments"
    ADD CONSTRAINT "product_tag_assignments_pkey" PRIMARY KEY ("product_id", "tag_id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."table_options"
    ADD CONSTRAINT "table_options_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."option_incompatibilities"
    ADD CONSTRAINT "option_incompatibilities_incompatible_with_id_fkey" FOREIGN KEY ("incompatible_with_id") REFERENCES "public"."table_options"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."option_incompatibilities"
    ADD CONSTRAINT "option_incompatibilities_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "public"."table_options"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_tag_assignments"
    ADD CONSTRAINT "product_tag_assignments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_tag_assignments"
    ADD CONSTRAINT "product_tag_assignments_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."table_options"
    ADD CONSTRAINT "table_options_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can update page content" ON "public"."page_content" USING (true);



CREATE POLICY "Allow public inserts" ON "public"."products" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public delete page_content" ON "public"."page_content" FOR DELETE USING (true);



CREATE POLICY "Public delete products" ON "public"."products" FOR DELETE USING (true);



CREATE POLICY "Public delete table options" ON "public"."table_options" FOR DELETE USING (true);



CREATE POLICY "Public incompatibilities are viewable by everyone." ON "public"."option_incompatibilities" FOR SELECT USING (true);



CREATE POLICY "Public insert page_content" ON "public"."page_content" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public insert table options" ON "public"."table_options" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public options are viewable by everyone." ON "public"."table_options" FOR SELECT USING (true);



CREATE POLICY "Public page content viewable" ON "public"."page_content" FOR SELECT USING (true);



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."products" FOR SELECT USING (true);



CREATE POLICY "Public select page_content" ON "public"."page_content" FOR SELECT USING (true);



CREATE POLICY "Public update page_content" ON "public"."page_content" FOR UPDATE USING (true) WITH CHECK (true);



CREATE POLICY "Public update products" ON "public"."products" FOR UPDATE USING (true) WITH CHECK (true);



CREATE POLICY "Public update table options" ON "public"."table_options" FOR UPDATE USING (true) WITH CHECK (true);



CREATE POLICY "Tag assignments deletable by everyone" ON "public"."product_tag_assignments" FOR DELETE USING (true);



CREATE POLICY "Tag assignments manageable by everyone" ON "public"."product_tag_assignments" FOR INSERT WITH CHECK (true);



CREATE POLICY "Tag assignments viewable by everyone" ON "public"."product_tag_assignments" FOR SELECT USING (true);



CREATE POLICY "Tags deletable by everyone" ON "public"."tags" FOR DELETE USING (true);



CREATE POLICY "Tags manageable by everyone" ON "public"."tags" FOR INSERT WITH CHECK (true);



CREATE POLICY "Tags viewable by everyone" ON "public"."tags" FOR SELECT USING (true);



ALTER TABLE "public"."option_incompatibilities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."page_content" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_tag_assignments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."table_options" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";





































































































































































GRANT ALL ON TABLE "public"."option_incompatibilities" TO "anon";
GRANT ALL ON TABLE "public"."option_incompatibilities" TO "authenticated";
GRANT ALL ON TABLE "public"."option_incompatibilities" TO "service_role";



GRANT ALL ON TABLE "public"."page_content" TO "anon";
GRANT ALL ON TABLE "public"."page_content" TO "authenticated";
GRANT ALL ON TABLE "public"."page_content" TO "service_role";



GRANT ALL ON TABLE "public"."product_tag_assignments" TO "anon";
GRANT ALL ON TABLE "public"."product_tag_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."product_tag_assignments" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."table_options" TO "anon";
GRANT ALL ON TABLE "public"."table_options" TO "authenticated";
GRANT ALL ON TABLE "public"."table_options" TO "service_role";



GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


  create policy "Public Access"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'product-images'::text));



  create policy "Public Insert"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'product-images'::text));



