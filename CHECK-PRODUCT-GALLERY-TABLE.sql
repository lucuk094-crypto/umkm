-- Check if product_gallery table exists and is working

-- 1. Check table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'product_gallery';

-- Expected: 1 row with "product_gallery"

-- 2. Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'product_gallery'
ORDER BY ordinal_position;

-- Expected: id, product_id, media_url, media_type, caption, order_index, is_active, created_at, updated_at

-- 3. Check RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'product_gallery';

-- Expected: rowsecurity = true

-- 4. Check policies
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'product_gallery';

-- Expected: 2 policies (Public read, Authenticated full)

-- 5. Test query (should work)
SELECT COUNT(*) as total_items FROM product_gallery;

-- Expected: 0 (if no data yet) or number of items

-- If all queries above return results → Table is OK! ✅
-- If error "relation does not exist" → Table not created ❌
