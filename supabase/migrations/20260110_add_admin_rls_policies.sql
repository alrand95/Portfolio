-- CRITICAL SECURITY FIX: Add missing RLS policies for UPDATE and DELETE operations
-- This prevents any authenticated user from modifying or deleting data
-- Only users with admin emails can perform these operations
-- Supports multiple admins: rundkhaled1995@gmail.com and aliaktarsimon@gmail.com (hidden)

-- ============================================================================
-- BLOG POSTS - Add UPDATE and DELETE policies
-- ============================================================================

CREATE POLICY "Only admin can update blog posts"
ON blog_posts FOR UPDATE
TO authenticated
USING (auth.jwt()->>'email' IN ('rundkhaled1995@gmail.com', 'aliaktarsimon@gmail.com'));

CREATE POLICY "Only admin can delete blog posts"
ON blog_posts FOR DELETE
TO authenticated
USING (auth.jwt()->>'email' IN ('rundkhaled1995@gmail.com', 'aliaktarsimon@gmail.com'));

-- ============================================================================
-- GALLERY ITEMS - Add UPDATE and DELETE policies
-- ============================================================================

CREATE POLICY "Only admin can update gallery items"
ON gallery_items FOR UPDATE
TO authenticated
USING (auth.jwt()->>'email' IN ('rundkhaled1995@gmail.com', 'aliaktarsimon@gmail.com'));

CREATE POLICY "Only admin can delete gallery items"
ON gallery_items FOR DELETE
TO authenticated
USING (auth.jwt()->>'email' IN ('rundkhaled1995@gmail.com', 'aliaktarsimon@gmail.com'));

-- ============================================================================
-- PROJECTS - Add DELETE policy (UPDATE already exists)
-- ============================================================================

CREATE POLICY "Only admin can delete projects"
ON projects FOR DELETE
TO authenticated
USING (auth.jwt()->>'email' IN ('rundkhaled1995@gmail.com', 'aliaktarsimon@gmail.com'));

-- ============================================================================
-- MESSAGES - Add UPDATE and DELETE policies
-- ============================================================================

CREATE POLICY "Only admin can update messages"
ON messages FOR UPDATE
TO authenticated
USING (auth.jwt()->>'email' IN ('rundkhaled1995@gmail.com', 'aliaktarsimon@gmail.com'));

CREATE POLICY "Only admin can delete messages"
ON messages FOR DELETE
TO authenticated
USING (auth.jwt()->>'email' IN ('rundkhaled1995@gmail.com', 'aliaktarsimon@gmail.com'));

-- ============================================================================
-- NOTES
-- ============================================================================
-- This migration adds RLS policies for two admin emails:
-- 1. rundkhaled1995@gmail.com (primary admin)
-- 2. aliaktarsimon@gmail.com (secondary admin - hidden from public)
--
-- To add more admins in the future, update the IN clause in each policy:
-- USING (auth.jwt()->>'email' IN ('email1@example.com', 'email2@example.com', 'email3@example.com'));
--
-- Or use environment variable approach via application code + RLS function
