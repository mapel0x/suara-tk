-- ==============================================================================
-- SUARA TK (Suara Teknik Komputer) - Initial Database Schema & RLS Policies
-- Slogan: Dengar, Catat, Tindaklanjuti.
-- Penyelenggara: Humas HIMTEK
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM TYPES / ENUMS
DO $$ BEGIN
    CREATE TYPE aspiration_status AS ENUM (
        'diterima',
        'ditinjau',
        'diteruskan',
        'dalam_proses',
        'selesai',
        'tidak_dapat_ditindaklanjuti',
        'ditutup'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE aspiration_priority AS ENUM (
        'rendah',
        'sedang',
        'tinggi'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE admin_role AS ENUM (
        'admin',
        'lead'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Categories
INSERT INTO categories (name, description, is_active) VALUES
('Akademik', 'Jadwal kuliah, kurikulum, dosen, praktikum, dan materi perkuliahan.', true),
('Fasilitas & Lab', 'Laboratorium komputer, AC, proyektor, Wi-Fi kampus, kebersihan, dan sarana belajar.', true),
('Kegiatan & Program', 'Workshop, perlombaan, seminar, pengabdian masyarakat, dan event himpunan.', true),
('Internal HIMTEK', 'Kritik, saran, masukan kepengurusan, divisi, dan kinerja pengurus HIMTEK.', true),
('Kemahasiswaan & Advokasi', 'UKT, beasiswa, birokrasi fakultas/universitas, dan kesejahteraan mahasiswa.', true),
('Ide & Inovasi', 'Usulan proyek teknologi, kolaborasi riset, open-source, dan gagasan kreatif.', true),
('Lainnya', 'Topik umum lainnya yang relevan bagi mahasiswa Teknik Komputer.', true)
ON CONFLICT DO NOTHING;

-- 4. ADMIN PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS admin_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    role admin_role NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. FUNCTION: GENERATE TICKET CODE (Format: STK-XXXX-XXXX)
CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    part1 TEXT := '';
    part2 TEXT := '';
    i INT;
    result_code TEXT;
    is_exists BOOLEAN;
BEGIN
    LOOP
        part1 := '';
        part2 := '';
        FOR i IN 1..4 LOOP
            part1 := part1 || substr(chars, floor(random() * length(chars) + 1)::int, 1);
            part2 := part2 || substr(chars, floor(random() * length(chars) + 1)::int, 1);
        END LOOP;
        
        result_code := 'STK-' || part1 || '-' || part2;
        
        -- Check uniqueness in aspirations table
        SELECT EXISTS(SELECT 1 FROM aspirations WHERE ticket_code = result_code) INTO is_exists;
        IF NOT is_exists THEN
            RETURN result_code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 6. ASPIRATIONS TABLE
CREATE TABLE IF NOT EXISTS aspirations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_code TEXT NOT NULL UNIQUE DEFAULT generate_ticket_code(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT true,
    sender_name TEXT,
    sender_contact TEXT,
    sender_generation TEXT,
    public_consent BOOLEAN NOT NULL DEFAULT true,
    visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
    status aspiration_status NOT NULL DEFAULT 'diterima',
    priority aspiration_priority NOT NULL DEFAULT 'sedang',
    assigned_to UUID REFERENCES admin_profiles(user_id) ON DELETE SET NULL,
    public_response TEXT,
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_aspirations_ticket_code ON aspirations(ticket_code);
CREATE INDEX IF NOT EXISTS idx_aspirations_status ON aspirations(status);
CREATE INDEX IF NOT EXISTS idx_aspirations_category_id ON aspirations(category_id);
CREATE INDEX IF NOT EXISTS idx_aspirations_created_at ON aspirations(created_at DESC);

-- 7. STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aspiration_id UUID NOT NULL REFERENCES aspirations(id) ON DELETE CASCADE,
    old_status aspiration_status,
    new_status aspiration_status NOT NULL,
    public_message TEXT,
    changed_by UUID REFERENCES admin_profiles(user_id) ON DELETE SET NULL,
    changed_by_role TEXT DEFAULT 'Humas HIMTEK',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_aspiration_id ON status_history(aspiration_id);

-- 8. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES admin_profiles(user_id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    record_type TEXT NOT NULL,
    record_id TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. TRIGGER: AUTO STATUS HISTORY ON INSERT & UPDATE
CREATE OR REPLACE FUNCTION record_status_history()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO status_history (
            aspiration_id,
            old_status,
            new_status,
            public_message,
            changed_by_role
        ) VALUES (
            NEW.id,
            NULL,
            NEW.status,
            'Aspirasi berhasil diterima di sistem dengan nomor tiket ' || NEW.ticket_code,
            'Sistem SUARA TK'
        );
    ELSIF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO status_history (
            aspiration_id,
            old_status,
            new_status,
            public_message,
            changed_by,
            changed_by_role
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            COALESCE(NEW.public_response, 'Status aspirasi diperbarui menjadi ' || NEW.status::text),
            NEW.assigned_to,
            'Admin Humas HIMTEK'
        );
        NEW.updated_at := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_aspiration_status_history ON aspirations;
CREATE TRIGGER trigger_aspiration_status_history
    AFTER INSERT OR UPDATE OF status ON aspirations
    FOR EACH ROW
    EXECUTE FUNCTION record_status_history();

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE aspirations ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Public can view active categories"
    ON categories FOR SELECT
    USING (is_active = true);

-- Aspirations policies
-- Anyone can insert an aspiration
CREATE POLICY "Public can insert aspirations"
    ON aspirations FOR INSERT
    WITH CHECK (true);

-- Anyone can track an aspiration using ticket_code (only public fields handled via view / api)
CREATE POLICY "Public can select aspiration by ticket_code"
    ON aspirations FOR SELECT
    USING (true);

-- Authenticated admins have full management access
CREATE POLICY "Admins have full access to aspirations"
    ON aspirations FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid() AND is_active = true));

-- Status History policies
CREATE POLICY "Public can view status history"
    ON status_history FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert status history"
    ON status_history FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid() AND is_active = true));

-- Admin Profiles policies
CREATE POLICY "Admins can view admin profiles"
    ON admin_profiles FOR SELECT
    TO authenticated
    USING (true);
