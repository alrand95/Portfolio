-- Update Profile Settings
UPDATE public.profile_settings
SET 
  full_name = 'Rand Albakhet',
  job_title = 'Graphic Designer',
  about_bio = 'With over 6 years of experience, I am a highly creative and knowledgeable Graphic Designer with a strong background in developing and executing visual design. I also have a demonstrated attention to detail and an ability to effectively collaborate with cross-functional teams to effectively deliver projects and initiatives on-time, on-budget and with high-quality results.',
  location = 'Al Zarqa, JORDAN',
  email = 'rundkhaled1995@gmail.com',
  phone = '+962799167626',
  full_name_ar = 'رند البخيت', -- Approximate Arabic, user can edit
  job_title_ar = 'مصمم جرافيك'
WHERE id IS NOT NULL; -- Updates the single row if it exists

-- Repopulate Experience Timeline
DELETE FROM public.experience_timeline;

INSERT INTO public.experience_timeline (role, company, start_date, end_date, description, type, sort_order)
VALUES
  ('Graphic Designer', 'Zalatimo Brothers', '2023', '2023 (3 Months)', 'Shmeisani, JORDAN', 'work', 1),
  ('Graphic Designer', 'Shabib Marketing', '2023', '2023 (4 Months)', 'Al Zarqa, JORDAN', 'work', 2),
  ('Graphic Designer', 'ORYX', '2020', '2020 (3 Months)', 'Freelancer - Macca', 'work', 3),
  ('Graphic Designer', 'IT / A.I.C.S.K Schools', '2018', '2018 (6 Months)', 'Shafa Badran, JORDAN', 'work', 4),
  ('Graphic Designer', 'Advertising Offices', '2018', '2018 (6 Months)', 'Trainee - Amman', 'work', 5),
  ('Graphic Designer', 'KSA Academe', '2017', '2017 (3 Months)', 'Al Zarqa, JORDAN', 'work', 6),
  ('Freelance Graphic Designer', 'Global', '2018', 'Present', 'I have been working as a freelancer for my 6 years all over the world', 'work', 0),
  ('Diploma Degree / Graphic Design', 'HorizonApex', '2018', '2018', '', 'education', 7),
  ('Bachelor / Software Eng.', 'The Hashemite University', '2013', '2017', '', 'education', 8);

-- Repopulate Skills
DELETE FROM public.skills;

INSERT INTO public.skills (name, category)
VALUES
  ('Logo Design', 'Design'),
  ('Branding', 'Design'),
  ('Typography', 'Design'),
  ('Digital Marketing', 'Marketing'),
  ('Campaign Development', 'Marketing'),
  ('Video Editing', 'Media'),
  ('Photography', 'Media'),
  ('Adobe Photoshop', 'Tech'),
  ('Adobe Illustrator', 'Tech'),
  ('Social Media Management', 'Marketing');
