ALTER TABLE public.products ADD COLUMN IF NOT EXISTS genre text;
CREATE INDEX IF NOT EXISTS idx_products_genre ON public.products (genre) WHERE genre IS NOT NULL;