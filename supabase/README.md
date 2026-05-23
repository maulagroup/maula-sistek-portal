# Supabase Database - Portal Maula SisTek

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor > New Query
3. Copy the content of `migrations/001_init_schema.sql`
4. Paste and run the query
5. Wait for all tables and policies to be created

## Database Structure

### Tables

| Table           | Description                          |
|-----------------|--------------------------------------|
| `users`         | User profiles with roles             |
| `clients`       | Client information                   |
| `projects`      | Project details with all fields      |
| `project_logs`  | Activity logs for projects           |
| `credentials`   | Sensitive credentials (superadmin only) |

### Roles

- `superadmin`: Full access, including credentials
- `admin`: Manage clients and projects
- `member`: View-only access

### Project Fields

✅ nama project
✅ jenis layanan (service_type)
✅ status
✅ domain
✅ deployment platform
✅ deadline
✅ harga project
✅ biaya renewal
✅ tanggal renewal
✅ PIC internal
✅ catatan

## Security

- RLS (Row Level Security) enabled on all tables
- Credentials table only accessible to superadmins
- UUID primary keys for all tables
- Timestamps (created_at, updated_at) with auto-update triggers
