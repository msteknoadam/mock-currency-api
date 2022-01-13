CREATE TABLE IF NOT EXISTS public.rates
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    date timestamp with time zone NOT NULL DEFAULT now(),
    "from" text COLLATE pg_catalog."default" NOT NULL,
    "to" text COLLATE pg_catalog."default" NOT NULL,
    rate numeric NOT NULL,
    CONSTRAINT rates_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.rates
    OWNER to rates;