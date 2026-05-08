-- SQL SCHEMA UNTUK SUPABASE
-- Silakan jalankan script ini di SQL Editor Supabase lo.

CREATE TABLE IF NOT EXISTS public.donasi_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    no_urut bigserial NOT NULL,
    no_kwitansi text NOT NULL UNIQUE,
    nama_donatur text NOT NULL,
    nominal bigint NOT NULL,
    keperluan text DEFAULT 'Sumbangan Donatur Mobsos'::text,
    tanggal_donasi timestamp with time zone DEFAULT now(),
    unique_hash text NOT NULL UNIQUE,
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid REFERENCES auth.users(id)
);

-- Indexing buat pencarian cepat
CREATE INDEX IF NOT EXISTS idx_donasi_hash ON public.donasi_logs(unique_hash);
CREATE INDEX IF NOT EXISTS idx_donasi_nama ON public.donasi_logs(nama_donatur);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.donasi_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admin (yang login) bisa baca/tulis semua
CREATE POLICY "Admin CRUD" ON public.donasi_logs
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Publik cuma bisa BACA berdasarkan unique_hash (buat verifikasi QR)
CREATE POLICY "Public Verification View" ON public.donasi_logs
    FOR SELECT
    USING (true);
