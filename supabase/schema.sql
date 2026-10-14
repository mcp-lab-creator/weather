-- Smart Pacheri (स्मार्ट पचेरी) – Supabase schema
-- Run this whole file once in: Supabase Dashboard -> SQL Editor -> New query -> Run

-- ---------------------------------------------------------------
-- Complaints
-- ---------------------------------------------------------------
create table if not exists complaints (
  id          uuid primary key default gen_random_uuid(),
  seq         bigint generated always as identity,
  tracking_id text unique,
  name        text not null check (char_length(name) between 1 and 100),
  mobile      text not null check (mobile ~ '^[6-9][0-9]{9}$'),
  ward        int  not null check (ward between 1 and 10),
  category    text not null check (category in (
                'water','roads','drainage','street_lights','electricity',
                'sanitation','ration','pension','other')),
  description text not null check (char_length(description) between 1 and 1000),
  photo_url   text,
  status      text not null default 'submitted'
                check (status in ('submitted','in_progress','resolved')),
  remarks     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists complaints_mobile_idx  on complaints (mobile);
create index if not exists complaints_created_idx on complaints (created_at desc);

-- Tracking ID like PCH-0001 (grows to PCH-10000 etc. after 9999)
create or replace function set_complaint_tracking_id() returns trigger as $$
begin
  new.tracking_id := 'PCH-' ||
    case when new.seq < 10000 then lpad(new.seq::text, 4, '0') else new.seq::text end;
  return new;
end;
$$ language plpgsql;

drop trigger if exists complaints_tracking_id on complaints;
create trigger complaints_tracking_id
  before insert on complaints
  for each row execute function set_complaint_tracking_id();

-- ---------------------------------------------------------------
-- Government schemes (Hindi required, English optional)
-- ---------------------------------------------------------------
create table if not exists schemes (
  id             uuid primary key default gen_random_uuid(),
  sort_order     int  not null default 0,
  name_hi        text not null,
  name_en        text,
  benefit_hi     text not null,
  benefit_en     text,
  eligibility_hi text not null,
  eligibility_en text,
  documents_hi   text not null,
  documents_en   text,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Notices (Panchayat announcements + Gram Sabha meetings)
-- ---------------------------------------------------------------
create table if not exists notices (
  id          uuid primary key default gen_random_uuid(),
  type        text not null default 'notice' check (type in ('notice','gram_sabha')),
  title_hi    text not null,
  title_en    text,
  body_hi     text not null,
  body_en     text,
  notice_date date not null default current_date,
  created_at  timestamptz not null default now()
);

create index if not exists notices_date_idx on notices (notice_date desc, created_at desc);

-- ---------------------------------------------------------------
-- Security: the app talks to the database ONLY from the server using the
-- service-role key. Row Level Security is switched on with no policies, so
-- the public (anon) key cannot read or write anything directly.
-- ---------------------------------------------------------------
alter table complaints enable row level security;
alter table schemes    enable row level security;
alter table notices    enable row level security;

-- ---------------------------------------------------------------
-- Storage bucket for complaint photos (public read, 2 MB, images only)
-- Uploads happen from the server with the service-role key.
-- ---------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('complaint-photos', 'complaint-photos', true, 2097152,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------
-- Seed: government schemes
-- Check amounts/rules on the official portals before sharing widely –
-- they change from time to time. Edit anything from /admin.
-- ---------------------------------------------------------------
insert into schemes
  (sort_order, name_hi, name_en, benefit_hi, benefit_en,
   eligibility_hi, eligibility_en, documents_hi, documents_en)
values
(1,
 'पीएम किसान सम्मान निधि', 'PM-KISAN Samman Nidhi',
 'किसान परिवार को हर साल ₹6,000, तीन किस्तों में (₹2,000 × 3) सीधे बैंक खाते में।',
 '₹6,000 per year to farmer families, paid in three instalments of ₹2,000 directly into the bank account.',
 'खेती की जमीन वाले किसान परिवार। सरकारी कर्मचारी, आयकरदाता और संस्थागत भूमि धारक पात्र नहीं।',
 'Farmer families who own cultivable land. Government employees, income-tax payers and institutional landholders are not eligible.',
 'आधार कार्ड, जमीन के कागज (जमाबंदी), बैंक पासबुक, आधार से जुड़ा मोबाइल नंबर।',
 'Aadhaar card, land records (jamabandi), bank passbook, mobile number linked to Aadhaar.'),
(2,
 'आयुष्मान भारत – पीएम जन आरोग्य योजना', 'Ayushman Bharat – PM-JAY',
 'पात्र परिवार को हर साल ₹5 लाख तक का मुफ्त इलाज, सूचीबद्ध सरकारी व निजी अस्पतालों में।',
 'Free treatment up to ₹5 lakh per family per year at listed government and private hospitals.',
 'योजना की सूची (SECC) में शामिल गरीब व कमजोर परिवार; 70 वर्ष या अधिक आयु के सभी बुजुर्ग। पात्रता की जांच आयुष्मान कार्ड केंद्र पर कराएं।',
 'Poor and vulnerable families on the scheme list (SECC); all senior citizens aged 70+. Check eligibility at an Ayushman card centre.',
 'आधार कार्ड, राशन कार्ड / जन आधार कार्ड, मोबाइल नंबर।',
 'Aadhaar card, ration card / Jan Aadhaar card, mobile number.'),
(3,
 'राजस्थान सामाजिक सुरक्षा पेंशन', 'Rajasthan Social Security Pension',
 'बुजुर्ग, विधवा, एकल नारी और दिव्यांगजन को हर महीने पेंशन, सीधे बैंक खाते में। राशि सरकार तय करती है (लगभग ₹1,000–1,500 प्रति माह, आयु अनुसार) – ताजा राशि पंचायत से पूछें।',
 'Monthly pension paid directly to the bank account for the elderly, widows, single women and persons with disabilities. The amount is set by the state government (roughly ₹1,000–1,500 per month depending on age) – ask the Panchayat for the current figure.',
 'राजस्थान के निवासी: वृद्ध (पुरुष 58+ वर्ष, महिला 55+ वर्ष), विधवा, एकल नारी, दिव्यांग – सरकार द्वारा तय आय सीमा के भीतर।',
 'Rajasthan residents: elderly (men 58+, women 55+), widows, single women, persons with disabilities – within the income limit set by the government.',
 'जन आधार कार्ड, आधार कार्ड, आयु / विकलांगता / पति के मृत्यु प्रमाण पत्र, बैंक पासबुक, फोटो।',
 'Jan Aadhaar card, Aadhaar card, age / disability / husband''s death certificate, bank passbook, photo.'),
(4,
 'प्रधानमंत्री आवास योजना – ग्रामीण', 'PM Awas Yojana – Gramin',
 'कच्चे या जर्जर मकान वाले गरीब परिवार को पक्का घर बनाने के लिए ₹1.20 लाख की सहायता (मैदानी क्षेत्र), साथ में शौचालय व मनरेगा मजदूरी का लाभ।',
 'Assistance of ₹1.20 lakh (plains) to build a pucca house for poor families living in kutcha or dilapidated homes, along with toilet support and MGNREGA wage days.',
 'बिना पक्के मकान वाले ग्रामीण परिवार, जो सरकारी सर्वे / आवास+ सूची में चयनित हों।',
 'Rural families without a pucca house who are selected in the government survey / Awaas+ list.',
 'आधार कार्ड, जॉब कार्ड, बैंक पासबुक, राशन / जन आधार कार्ड, जमीन या घर के कागज।',
 'Aadhaar card, job card, bank passbook, ration / Jan Aadhaar card, land or house papers.'),
(5,
 'प्रधानमंत्री उज्ज्वला योजना', 'PM Ujjwala Yojana',
 'गरीब परिवार की महिला को मुफ्त एलपीजी गैस कनेक्शन।',
 'Free LPG gas connection for women from poor households.',
 'गरीबी रेखा से नीचे (BPL) / पात्र परिवार की वयस्क महिला, जिसके घर में पहले से एलपीजी कनेक्शन न हो।',
 'Adult women from BPL / eligible households with no existing LPG connection in the home.',
 'आधार कार्ड, राशन कार्ड / जन आधार कार्ड, बैंक पासबुक, पासपोर्ट साइज फोटो, पते का प्रमाण।',
 'Aadhaar card, ration / Jan Aadhaar card, bank passbook, passport-size photo, address proof.'),
(6,
 'मनरेगा / वीबी-जी राम जी (ग्रामीण रोजगार गारंटी)', 'MGNREGA / VB-G RAM G (Rural Employment Guarantee)',
 'ग्रामीण परिवार को साल में तय दिनों का मजदूरी रोजगार – मनरेगा में 100 दिन; नया वीबी-जी राम जी कानून (1 जुलाई 2026 से) इसे बढ़ाकर 125 दिन करता है। लागू नियम पंचायत से पूछें।',
 'Guaranteed wage work for rural households – 100 days under MGNREGA; the new VB-G RAM G Act (from 1 July 2026) raises this to 125 days. Ask the Panchayat for the rules currently in force.',
 'ग्रामीण परिवार के वयस्क सदस्य जो अकुशल शारीरिक काम करना चाहते हों।',
 'Adult members of rural households willing to do unskilled manual work.',
 'जॉब कार्ड (ग्राम पंचायत में आवेदन करें), आधार कार्ड, बैंक पासबुक, पासपोर्ट साइज फोटो।',
 'Job card (apply at the Gram Panchayat), Aadhaar card, bank passbook, passport-size photo.');

-- ---------------------------------------------------------------
-- Seed: one welcome notice (edit or delete from /admin)
-- ---------------------------------------------------------------
insert into notices (type, title_hi, title_en, body_hi, body_en)
values (
  'notice',
  'स्मार्ट पचेरी ट्रायल शुरू',
  'Smart Pacheri trial begins',
  'ग्राम पंचायत पचेरी की यह नई सुविधा अभी ट्रायल में है। अपनी शिकायतें यहां दर्ज करें और अपनी राय हमें बताएं।',
  'This new Pacheri Gram Panchayat service is in trial. Raise your complaints here and tell us what you think.'
);
