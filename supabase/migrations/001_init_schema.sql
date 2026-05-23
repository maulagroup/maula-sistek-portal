-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE project_status AS ENUM ('draft', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE service_type AS ENUM ('website', 'mobile_app', 'saas', 'consulting', 'design', 'other');
CREATE TYPE deployment_platform AS ENUM ('vercel', 'netlify', 'aws', 'gcp', 'azure', 'self_hosted', 'other');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT DEFAULT 'member' CHECK (role IN ('superadmin', 'admin', 'member')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create clients table
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_client TEXT NOT NULL,
    nama_pic TEXT NOT NULL,
    nomor_wa TEXT NOT NULL,
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    nama_project TEXT NOT NULL,
    jenis_layanan TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Leads',
    domain TEXT,
    deployment_platform TEXT,
    deadline DATE,
    harga_project NUMERIC(10, 2),
    biaya_renewal NUMERIC(10, 2),
    tanggal_renewal DATE,
    pic_internal TEXT,
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create project_logs table
CREATE TABLE public.project_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id),
    action TEXT NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create credentials table
CREATE TABLE public.credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    username TEXT,
    password TEXT,
    url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_pic_internal_id ON public.projects(pic_internal_id);
CREATE INDEX idx_project_logs_project_id ON public.project_logs(project_id);
CREATE INDEX idx_project_logs_user_id ON public.project_logs(user_id);
CREATE INDEX idx_credentials_project_id ON public.credentials(project_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" 
    ON public.users 
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Superadmins can manage all users" 
    ON public.users 
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'superadmin'
        )
    );

CREATE POLICY "All authenticated users can view clients" 
    ON public.clients 
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "All authenticated users can manage clients" 
    ON public.clients 
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "All authenticated users can view projects" 
    ON public.projects 
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "All authenticated users can manage projects" 
    ON public.projects 
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "All authenticated users can view project logs" 
    ON public.project_logs 
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "All authenticated users can create project logs" 
    ON public.project_logs 
    FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

-- Create activity_logs table
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    pesan TEXT NOT NULL,
    dibuat_oleh TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for better query performance
CREATE INDEX idx_activity_logs_project_id ON public.activity_logs(project_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- Create RLS policies
CREATE POLICY "All authenticated users can view activity logs" 
    ON public.activity_logs 
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "All authenticated users can create activity logs" 
    ON public.activity_logs 
    FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only superadmins can view credentials" 
    ON public.credentials 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'superadmin'
        )
    );

CREATE POLICY "Only superadmins can manage credentials" 
    ON public.credentials 
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'superadmin'
        )
    );

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_clients_updated_at 
    BEFORE UPDATE ON public.clients 
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_projects_updated_at 
    BEFORE UPDATE ON public.projects 
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_credentials_updated_at 
    BEFORE UPDATE ON public.credentials 
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to automatically create user profile on sign up
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, full_name, role)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 'member');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user sign up
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();
