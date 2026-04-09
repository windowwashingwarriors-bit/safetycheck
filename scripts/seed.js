// SafetyCheck Seed Script
// Run after applying supabase/migrations/001_setup.sql in the Supabase SQL Editor:
//   node scripts/seed.js
'use strict'

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://ouwwhwmvrjxlntgwrtet.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91d3dod212cmp4bG50Z3dydGV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxOTEzNiwiZXhwIjoyMDkxMTk1MTM2fQ.n4Q5sqUpzweJrNiMG7xWrn1SV-PxXFd7I7RsKMESmcY'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// ─── USERS ────────────────────────────────────────────────────────────────────
// April 2026 new-hire date for all technicians (within first 3 months)
const HIRE_DATE_NEW = '2026-04-01'
const HIRE_DATE_VETERAN = '2024-01-01' // far enough back to be a veteran

const USERS = [
  // Technicians (new hires — April 2026)
  { name: 'Kowin',   role: 'technician', pin: '1234', hire_date: HIRE_DATE_NEW },
  { name: 'Brandin', role: 'technician', pin: '1234', hire_date: HIRE_DATE_NEW },
  { name: 'Kyle',    role: 'technician', pin: '1234', hire_date: HIRE_DATE_NEW },
  { name: 'RJ',      role: 'technician', pin: '1234', hire_date: HIRE_DATE_NEW },
  { name: 'Josh',    role: 'technician', pin: '1234', hire_date: HIRE_DATE_NEW },
  { name: 'Jesse',   role: 'technician', pin: '1234', hire_date: HIRE_DATE_NEW },
  { name: 'Stephan', role: 'technician', pin: '1234', hire_date: HIRE_DATE_NEW },
  { name: 'Duric',   role: 'technician', pin: '1234', hire_date: HIRE_DATE_NEW },
  // Managers
  { name: 'Jeramy',  role: 'manager', pin: '1234', hire_date: HIRE_DATE_VETERAN },
  { name: 'Kayla',   role: 'manager', pin: '1234', hire_date: HIRE_DATE_VETERAN },
  // Admin
  { name: 'David Schultz', role: 'admin', pin: '1234', hire_date: HIRE_DATE_VETERAN },
]

// ─── QUESTIONS (69 total) ─────────────────────────────────────────────────────
// Categories: safety | summer_service | winter_service | policy
// Season:     year_round | summer | winter
// Type:       multiple_choice | short_answer

const QUESTIONS = [
  // ── SAFETY (25) — year_round ────────────────────────────────────────────────
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'What is the minimum distance you must maintain from energized power lines when using a water-fed pole?',
    options: ['5 feet', '10 feet', '15 feet', '20 feet'],
    correct_answer: '10 feet',
    reference: 'OSHA 1910.333',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'What PPE is required when working at heights above 4 feet?',
    options: ['Hard hat only', 'Safety harness and lanyard', 'Gloves and goggles', 'Steel-toed boots only'],
    correct_answer: 'Safety harness and lanyard',
    reference: 'OSHA 1926.502',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'How often should personal fall protection equipment be formally inspected?',
    options: ['Monthly', 'Quarterly', 'Annually', 'Before each use and annually'],
    correct_answer: 'Before each use and annually',
    reference: 'OSHA 1926.502(d)',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'What is the first action when you discover a safety hazard at a job site?',
    options: ['Complete the job, then report it', 'Stop work and notify your supervisor immediately', 'Work around the hazard', 'Post a warning sign and continue'],
    correct_answer: 'Stop work and notify your supervisor immediately',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'At what wind speed should you stop work on a ladder?',
    options: ['Over 15 mph', 'Over 25 mph', 'Over 30 mph', 'Only during gusts'],
    correct_answer: 'Over 15 mph',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'What is the 4-to-1 rule for ladder placement?',
    options: ['Maximum 4 pounds per rung', 'For every 4 feet of height, move the base 1 foot out', 'Ladders must overlap 4 feet minimum', 'Inspect 4 points before climbing'],
    correct_answer: 'For every 4 feet of height, move the base 1 foot out',
    reference: 'OSHA 1926.1053',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'What does SDS stand for?',
    options: ['Safety Data Sheet', 'Standard Delivery System', 'Surface Drying Solution', 'Safety Descent System'],
    correct_answer: 'Safety Data Sheet',
    reference: 'OSHA HazCom Standard 29 CFR 1910.1200',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'What is the maximum load capacity for a Type II ladder?',
    options: ['200 lbs', '225 lbs', '250 lbs', '300 lbs'],
    correct_answer: '225 lbs',
    reference: 'ANSI A14.1',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'If cleaning solution splashes into a coworker\'s eyes, what is the first step?',
    options: ['Apply a neutralizer', 'Rinse with clean water for 15–20 minutes', 'Apply a clean cloth and wait', 'Call 911 immediately without rinsing'],
    correct_answer: 'Rinse with clean water for 15–20 minutes',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'What color is a standard OSHA Danger tag used in lockout/tagout?',
    options: ['Yellow', 'Orange', 'Red', 'Blue'],
    correct_answer: 'Red',
    reference: 'OSHA 1910.147',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'How should chemical containers be stored in a work vehicle?',
    options: ['In the cab for quick access', 'In a locked, ventilated compartment away from heat sources', 'In the truck bed uncovered', 'Stacked without lids to prevent pressure buildup'],
    correct_answer: 'In a locked, ventilated compartment away from heat sources',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'What OSHA standard covers fall protection in construction?',
    options: ['1910.132', '1926.502', '1904.39', '1910.23'],
    correct_answer: '1926.502',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'When must you complete an incident report?',
    options: ['Only for injuries requiring hospitalization', 'For any injury, near-miss, or property damage', 'Only when a customer files a complaint', 'Monthly for all completed work'],
    correct_answer: 'For any injury, near-miss, or property damage',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'What knot is recommended when tying off a safety rope to an anchor point?',
    options: ['Slipknot', 'Square knot', 'Figure-eight follow-through', 'Granny knot'],
    correct_answer: 'Figure-eight follow-through',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'What should you do with a piece of equipment you find is defective?',
    options: ['Mark it and keep using it carefully', 'Remove it from service, tag it defective, and report it', 'Repair it yourself before the next job', 'Only use it for light-duty tasks'],
    correct_answer: 'Remove it from service, tag it defective, and report it',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'What is the minimum safe distance from an unprotected roof edge?',
    options: ['2 feet', '4 feet', '6 feet', '10 feet'],
    correct_answer: '6 feet',
    reference: 'OSHA 1926.502',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'What is required when working adjacent to an active roadway?',
    options: ['Stay aware of traffic', 'Traffic cones and a high-visibility vest', 'A police escort', 'Work only at night'],
    correct_answer: 'Traffic cones and a high-visibility vest',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'How should contaminated cleaning water be disposed of?',
    options: ['Pour it into the nearest storm drain', 'Dispose per local regulations and SDS instructions', 'Leave it on site for the customer to handle', 'Dump it in the nearest landscaping'],
    correct_answer: 'Dispose per local regulations and SDS instructions',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'What is the maximum height you can stand on a stepladder without additional fall protection?',
    options: ['6 feet', '10 feet', '4 feet', '8 feet'],
    correct_answer: '4 feet',
    reference: 'OSHA 1926.1053',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'What is the correct way for two people to carry a long extension ladder?',
    options: ['Horizontally at shoulder height, one person at each end', 'Vertically over one shoulder each', 'One person drags while the other guides', 'Carry it folded under one arm'],
    correct_answer: 'Horizontally at shoulder height, one person at each end',
  },
  {
    category: 'safety', season: 'year_round', type: 'multiple_choice',
    question: 'What is the minimum anchor strength requirement for a personal fall arrest system?',
    options: ['1,000 lbs', '2,000 lbs', '3,000 lbs', '5,000 lbs'],
    correct_answer: '5,000 lbs',
    reference: 'OSHA 1926.502(d)(15)',
  },
  {
    category: 'safety', season: 'year_round', type: 'short_answer',
    question: 'Describe the steps you take to properly inspect your rope descent system before starting work.',
    grading_guidance: 'Should include: check rope for fraying/cuts/kinks, inspect carabiner gates and locking mechanism, verify anchor point rating, test braking system function, check harness stitching and buckles.',
  },
  {
    category: 'safety', season: 'year_round', type: 'short_answer',
    question: 'What would you do if you noticed a coworker not wearing their required fall protection equipment?',
    grading_guidance: 'Should include: address it directly and immediately, remind them of company policy, stop work if necessary, notify supervisor if they refuse — never ignore it.',
  },
  {
    category: 'safety', season: 'year_round', type: 'short_answer',
    question: 'A customer\'s irrigation system activates unexpectedly while you are on a ladder cleaning second-floor windows. What do you do?',
    grading_guidance: 'Should include: safely and calmly descend — do not rush or jump, assess ladder footing before moving, notify customer, determine if safe to continue or reschedule.',
  },
  {
    category: 'safety', season: 'year_round', type: 'short_answer',
    question: 'Explain how the buddy system applies to working at significant heights.',
    grading_guidance: 'Should include: never work alone at heights, partners actively monitor each other, one can call for help if the other is incapacitated, establish regular check-ins.',
  },

  // ── SUMMER SERVICE (20) — season: summer ────────────────────────────────────
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'What is the best time of day to clean windows in summer to avoid sun-induced streaking?',
    options: ['Midday when the sun is strongest', 'Early morning or late afternoon', 'Any time — sunlight has no effect', 'After sunset only'],
    correct_answer: 'Early morning or late afternoon',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'How does hot glass affect your cleaning solution?',
    options: ['It dissolves grime faster', 'It causes solution to evaporate too quickly, leaving streaks', 'It has no effect on solution performance', 'It makes solution more effective'],
    correct_answer: 'It causes solution to evaporate too quickly, leaving streaks',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'What additive can help slow evaporation on hot glass in summer?',
    options: ['Extra dish soap', 'A small amount of isopropyl alcohol', 'Baking soda', 'White vinegar only'],
    correct_answer: 'A small amount of isopropyl alcohol',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'Hard water mineral spots from irrigation systems are best treated with:',
    options: ['Extra soap and scrubbing', 'A diluted acid-based spot remover', 'Hot water rinse only', 'A dry microfiber cloth'],
    correct_answer: 'A diluted acid-based spot remover',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'How should you protect a customer\'s landscaping from cleaning solution runoff?',
    options: ['Work quickly so little runoff occurs', 'Pre-wet plants with water and rinse thoroughly after', 'Place a tarp over all plants', 'No protection is needed for diluted solutions'],
    correct_answer: 'Pre-wet plants with water and rinse thoroughly after',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'When cleaning tinted windows, what must you avoid?',
    options: ['Using a squeegee', 'Abrasive pads or excessive scrubbing pressure', 'Water-based cleaners', 'Straight-pull squeegee strokes'],
    correct_answer: 'Abrasive pads or excessive scrubbing pressure',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'What water quality (TDS level) is required for streak-free water-fed pole results?',
    options: ['Tap water is fine', '0–10 TDS (purified water)', 'Softened water at any TDS', 'Distilled water only, regardless of TDS'],
    correct_answer: '0–10 TDS (purified water)',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'After rinsing with a water-fed pole, how do you achieve a spot-free result?',
    options: ['Squeegee immediately after rinsing', 'Add soap to the rinse water', 'Use purified water and allow to air dry completely', 'Use warm water to speed evaporation'],
    correct_answer: 'Use purified water and allow to air dry completely',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'Before cleaning solar panels, what must you always verify first?',
    options: ['Panel surface temperature', 'Manufacturer guidelines and any warranty restrictions', 'Which direction the panels face', 'Whether the owner has home insurance'],
    correct_answer: 'Manufacturer guidelines and any warranty restrictions',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'What screen cleaning method is preferred when summer dust and pollen buildup is heavy?',
    options: ['Dry brush only', 'Wash with mild soap solution, rinse well, and allow to dry', 'Full-pressure power wash', 'Skip screens and clean glass only'],
    correct_answer: 'Wash with mild soap solution, rinse well, and allow to dry',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'At what TDS reading should you regenerate or replace your DI resin tank?',
    options: ['0 TDS', '10 TDS', '25 TDS', '50 TDS'],
    correct_answer: '10 TDS',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'How should you approach cleaning a large commercial glass facade in peak summer heat?',
    options: ['Clean as fast as possible before solution dries', 'Work in sections, starting with shaded areas', 'Apply extra solution and let it dwell', 'Use the longest squeegee possible for maximum speed'],
    correct_answer: 'Work in sections, starting with shaded areas',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'What is the "fanning" technique in squeegee work?',
    options: ['Waving the squeegee to air-dry it between strokes', 'An arc motion stroke across the glass from one side to the other', 'Using a fan to pre-dry the glass surface', 'Rapid overlapping horizontal strokes'],
    correct_answer: 'An arc motion stroke across the glass from one side to the other',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'What is a common cause of brush marks when using a water-fed pole?',
    options: ['Using too much water', 'Dirty or worn brush bristles', 'Moving the pole too slowly', 'Over-purified water'],
    correct_answer: 'Dirty or worn brush bristles',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'What is the first step before removing a window screen?',
    options: ['Ask the customer which ones come out', 'Number or photograph each screen\'s location', 'Wet the screen to check for damage', 'Lean it against the house in order'],
    correct_answer: 'Number or photograph each screen\'s location',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'What is the correct water-fed pole technique for upper-floor windows?',
    options: ['Angle the pole at 45° and spray from the side only', 'Scrub in overlapping strokes, then rinse top to bottom', 'Only rinse — no scrubbing at height', 'Hold the pole vertical and spray straight up'],
    correct_answer: 'Scrub in overlapping strokes, then rinse top to bottom',
  },
  {
    category: 'summer_service', season: 'summer', type: 'multiple_choice',
    question: 'What is the standard dilution ratio for window cleaning concentrate?',
    options: ['1:1 (full strength)', '1:10 or per manufacturer specification', '1:100 for summer heat', 'No dilution — use concentrate directly'],
    correct_answer: '1:10 or per manufacturer specification',
  },
  {
    category: 'summer_service', season: 'summer', type: 'short_answer',
    question: 'Describe your process for cleaning a window with heavy pollen and mineral deposit buildup from summer irrigation.',
    grading_guidance: 'Should include: pre-rinse to remove loose debris, apply appropriate cleaner (acid-based for minerals), agitate with a non-abrasive scrubber, squeegee in controlled strokes, detail edges and sills.',
  },
  {
    category: 'summer_service', season: 'summer', type: 'short_answer',
    question: 'A customer complains their windows streaked after you cleaned them on a 95°F day. What likely caused this, and how do you prevent it next time?',
    grading_guidance: 'Should include: solution dried too fast due to heat and/or direct sun, should work in shade or early/late in day, work in smaller sections, adjust solution mixture.',
  },
  {
    category: 'summer_service', season: 'summer', type: 'short_answer',
    question: 'A customer asks why their second-floor windows still look hazy after you cleaned them with the water-fed pole. Walk through your troubleshooting process.',
    grading_guidance: 'Should include: check TDS reading (replace resin if above 10), inspect brush bristles for dirt/contamination, verify sufficient rinse time, check if any soap was in the system, ensure windows fully dried before evaluation.',
  },

  // ── WINTER SERVICE (10) — season: winter ────────────────────────────────────
  {
    category: 'winter_service', season: 'winter', type: 'multiple_choice',
    question: 'At what temperature should you add an antifreeze additive to your cleaning solution?',
    options: ['Below 50°F', 'Below 40°F', 'At or below 32°F', 'Below 20°F only'],
    correct_answer: 'At or below 32°F',
  },
  {
    category: 'winter_service', season: 'winter', type: 'multiple_choice',
    question: 'What is the primary hazard of solution freezing on glass in cold temperatures?',
    options: ['Solution becomes less effective', 'Ice patches form, creating slip hazards for you and customers', 'Glass expands and cracks', 'The squeegee rubber sticks permanently'],
    correct_answer: 'Ice patches form, creating slip hazards for you and customers',
  },
  {
    category: 'winter_service', season: 'winter', type: 'multiple_choice',
    question: 'How should hoses be protected from freezing between winter jobs?',
    options: ['Leave water in them and park in the sun', 'Drain completely after each use and store in a heated space', 'Wrap them in plastic wrap', 'Fill with hot water before driving to the next job'],
    correct_answer: 'Drain completely after each use and store in a heated space',
  },
  {
    category: 'winter_service', season: 'winter', type: 'multiple_choice',
    question: 'What type of squeegee rubber performs best in cold temperatures?',
    options: ['Standard hard rubber', 'Foam rubber', 'Soft low-temperature rubber or silicone', 'No difference — any rubber works the same'],
    correct_answer: 'Soft low-temperature rubber or silicone',
  },
  {
    category: 'winter_service', season: 'winter', type: 'multiple_choice',
    question: 'What additional PPE is required for winter outdoor work?',
    options: ['Nothing extra beyond standard PPE', 'Waterproof insulated gloves, slip-resistant footwear, and a hi-vis jacket', 'Just a warm hat and scarf', 'A full waterproof wetsuit'],
    correct_answer: 'Waterproof insulated gloves, slip-resistant footwear, and a hi-vis jacket',
  },
  {
    category: 'winter_service', season: 'winter', type: 'multiple_choice',
    question: 'Before using a water-fed pole system in freezing temperatures, what must you verify?',
    options: ['The water temperature is above 60°F', 'The hose reel is insulated and the system will not freeze mid-job', 'The customer has salt on the driveway', 'The pole has been stored at room temperature for 24 hours'],
    correct_answer: 'The hose reel is insulated and the system will not freeze mid-job',
  },
  {
    category: 'winter_service', season: 'winter', type: 'multiple_choice',
    question: 'How do cold temperatures affect squeegee rubber?',
    options: ['No effect at all', 'It becomes stiffer, reducing glide and effectiveness', 'It stretches more, improving reach', 'It cleans more effectively in cold'],
    correct_answer: 'It becomes stiffer, reducing glide and effectiveness',
  },
  {
    category: 'winter_service', season: 'winter', type: 'multiple_choice',
    question: 'How should icy or frozen window frames be treated before you begin cleaning the glass?',
    options: ['Ignore the frames and clean glass only', 'Apply gentle warm water to frames to thaw them before proceeding', 'Use a metal scraper on the frame', 'Leave them and reschedule for warmer weather'],
    correct_answer: 'Apply gentle warm water to frames to thaw them before proceeding',
  },
  {
    category: 'winter_service', season: 'winter', type: 'multiple_choice',
    question: 'What footwear is required when working on wet or icy surfaces?',
    options: ['Any closed-toe shoe', 'Slip-resistant, waterproof boots', 'Rubber-soled athletic shoes', 'Steel-toed shoes only'],
    correct_answer: 'Slip-resistant, waterproof boots',
  },
  {
    category: 'winter_service', season: 'winter', type: 'short_answer',
    question: 'Describe safe ladder placement and use procedures on icy or snow-covered surfaces.',
    grading_guidance: 'Should include: clear ice/snow from the base area before placing ladder, use ladder feet designed for winter (spikes or rubber), have a spotter whenever possible, avoid sudden movements on the ladder, do not climb if surface cannot be made safe — reschedule.',
  },

  // ── POLICY (14) — year_round ─────────────────────────────────────────────────
  {
    category: 'policy', season: 'year_round', type: 'multiple_choice',
    question: 'What is the required dress code for technicians on customer job sites?',
    options: ['Any comfortable work clothing', 'Company uniform shirt, clean dark work pants, and appropriate footwear', 'Business casual attire', 'Any WWW-branded item is acceptable'],
    correct_answer: 'Company uniform shirt, clean dark work pants, and appropriate footwear',
  },
  {
    category: 'policy', season: 'year_round', type: 'multiple_choice',
    question: 'What is the first step when you arrive and notice pre-existing damage at a property?',
    options: ['Start work and mention it at the end', 'Document and photograph the damage, notify the office before starting work', 'Fix the damage as a goodwill gesture', 'Ask the customer to inspect with you, then start immediately'],
    correct_answer: 'Document and photograph the damage, notify the office before starting work',
  },
  {
    category: 'policy', season: 'year_round', type: 'multiple_choice',
    question: 'If a customer is not present at their scheduled appointment, you should:',
    options: ['Do the work anyway and bill them', 'Leave a door hanger and contact the office for instructions', 'Leave and mark it as a no-show without notice', 'Wait up to 2 hours before leaving'],
    correct_answer: 'Leave a door hanger and contact the office for instructions',
  },
  {
    category: 'policy', season: 'year_round', type: 'multiple_choice',
    question: 'How should you respond when a customer complains about work quality on the spot?',
    options: ['Explain that is the best result possible', 'Apologize, inspect together, correct issues within your scope, and report to the office', 'Offer a discount on the spot without authorization', 'Refer them to call the office and leave'],
    correct_answer: 'Apologize, inspect together, correct issues within your scope, and report to the office',
  },
  {
    category: 'policy', season: 'year_round', type: 'multiple_choice',
    question: 'Using a personal cell phone on company time for non-work-related activities is:',
    options: ['Allowed in moderation', 'Allowed anytime as long as work is getting done', 'Not permitted except during designated breaks', 'Encouraged to document and share completed work on social media'],
    correct_answer: 'Not permitted except during designated breaks',
  },
  {
    category: 'policy', season: 'year_round', type: 'multiple_choice',
    question: 'What is the procedure for reporting a vehicle accident, even a minor one?',
    options: ['Handle it yourself if there is no injury', 'Notify your supervisor immediately and file a company incident report', 'Wait until end of shift to report', 'Only report if the other party files a claim'],
    correct_answer: 'Notify your supervisor immediately and file a company incident report',
  },
  {
    category: 'policy', season: 'year_round', type: 'multiple_choice',
    question: 'After completing a job, all equipment must be:',
    options: ['Left at the job site if the customer approves', 'Returned to the vehicle, cleaned, and properly stored', 'Left in the customer\'s driveway until the next visit', 'Checked in at the office before going home'],
    correct_answer: 'Returned to the vehicle, cleaned, and properly stored',
  },
  {
    category: 'policy', season: 'year_round', type: 'multiple_choice',
    question: 'Posting photos of customers, their homes, or job sites on social media is:',
    options: ['Fine as long as no faces are visible', 'Not permitted without explicit written company permission', 'Fine if posted from a personal account', 'Encouraged as good advertising'],
    correct_answer: 'Not permitted without explicit written company permission',
  },
  {
    category: 'policy', season: 'year_round', type: 'multiple_choice',
    question: 'When you cannot safely perform a job due to hazardous conditions, you should:',
    options: ['Complete as much as you safely can', 'Stop, contact your supervisor immediately, and do not proceed until cleared', 'Use your best judgment and continue', 'Charge the customer for a partial job and leave'],
    correct_answer: 'Stop, contact your supervisor immediately, and do not proceed until cleared',
  },
  {
    category: 'policy', season: 'year_round', type: 'multiple_choice',
    question: 'What is the correct procedure for requesting time off?',
    options: ['Call in the morning of the day you need off', 'Submit a request via the scheduling system at least 1 week in advance', 'Text your manager directly any time', 'Arrange a shift swap on your own without notifying management'],
    correct_answer: 'Submit a request via the scheduling system at least 1 week in advance',
  },
  {
    category: 'policy', season: 'year_round', type: 'multiple_choice',
    question: 'The company no-smoking and vaping policy on customer properties states:',
    options: ['Smoking is permitted 10 feet from the building', 'No smoking or vaping at any time while on a customer property', 'Smoking is allowed during lunch breaks', 'Vaping is acceptable but cigarettes are not'],
    correct_answer: 'No smoking or vaping at any time while on a customer property',
  },
  {
    category: 'policy', season: 'year_round', type: 'multiple_choice',
    question: 'How should damaged or missing company equipment be reported?',
    options: ['Replace it yourself and submit the receipt later', 'Report it to your supervisor or manager by end of that work day', 'Wait until the next scheduled equipment audit', 'Mention it at the next team meeting'],
    correct_answer: 'Report it to your supervisor or manager by end of that work day',
  },
  {
    category: 'policy', season: 'year_round', type: 'multiple_choice',
    question: 'What is the company vehicle flat tire procedure?',
    options: ['Change it yourself if you are comfortable doing so', 'Notify your supervisor first, then follow the vehicle breakdown protocol', 'Call a tow truck independently and submit the bill', 'Leave the vehicle and use a rideshare app to finish the day'],
    correct_answer: 'Notify your supervisor first, then follow the vehicle breakdown protocol',
  },
  {
    category: 'policy', season: 'year_round', type: 'short_answer',
    question: 'A customer demands a refund on the spot for a job completed last week. How do you handle this situation?',
    grading_guidance: 'Should include: listen respectfully without arguing, do not agree to or promise any refund, apologize for their experience, collect all details, immediately contact your supervisor or the office — let management handle the refund decision.',
  },
]

// ─── QUOTES (100) ─────────────────────────────────────────────────────────────
const QUOTES = [
  { quote: 'Safety is not an intellectual exercise to keep us in work. It is a matter of life and death.', author: 'Brian McBride' },
  { quote: 'An ounce of prevention is worth a pound of cure.', author: 'Benjamin Franklin' },
  { quote: 'The quality of a person\'s life is in direct proportion to their commitment to excellence.', author: 'Vince Lombardi' },
  { quote: 'Working safely is like breathing — if you don\'t do it, you die.', author: 'Unknown' },
  { quote: 'Safety brings first aid to the uninjured.', author: 'F.S. Hughes' },
  { quote: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { quote: 'Success is not final, failure is not fatal — it is the courage to continue that counts.', author: 'Winston Churchill' },
  { quote: 'Take care of your body. It\'s the only place you have to live.', author: 'Jim Rohn' },
  { quote: 'Your attitude, not your aptitude, will determine your altitude.', author: 'Zig Ziglar' },
  { quote: 'Safety is everyone\'s responsibility, every day.', author: 'Unknown' },
  { quote: 'Do what you do so well that they will want to see it again and bring their friends.', author: 'Walt Disney' },
  { quote: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { quote: 'Excellence is not a destination but a continuous journey that never ends.', author: 'Brian Tracy' },
  { quote: 'A team that looks out for each other stays together.', author: 'Unknown' },
  { quote: 'Safety is a cheap and effective insurance policy.', author: 'Unknown' },
  { quote: 'The best way to predict the future is to create it.', author: 'Peter Drucker' },
  { quote: 'It takes 20 years to build a reputation and five minutes to ruin it.', author: 'Warren Buffett' },
  { quote: 'Prevention is better than cure.', author: 'Desiderius Erasmus' },
  { quote: 'The strength of the team is each individual member. The strength of each member is the team.', author: 'Phil Jackson' },
  { quote: 'Small acts, when multiplied by millions of people, can transform the world.', author: 'Howard Zinn' },
  { quote: 'Hard work spotlights character — some turn up their sleeves, some turn up their noses, and some don\'t turn up at all.', author: 'Sam Ewing' },
  { quote: 'The difference between ordinary and extraordinary is that little extra.', author: 'Jimmy Johnson' },
  { quote: 'Safety first — then teamwork.', author: 'Unknown' },
  { quote: 'You don\'t have to be great to start, but you have to start to be great.', author: 'Zig Ziglar' },
  { quote: 'Accidents don\'t just happen; they are caused.', author: 'Unknown' },
  { quote: 'Be a voice, not an echo.', author: 'Albert Einstein' },
  { quote: 'Character is doing the right thing when no one is looking.', author: 'C.S. Lewis' },
  { quote: 'Your future is created by what you do today, not tomorrow.', author: 'Robert Kiyosaki' },
  { quote: 'Attitude is a little thing that makes a big difference.', author: 'Winston Churchill' },
  { quote: 'Safety is not a gadget — it\'s a state of mind.', author: 'Eleanor Everet' },
  { quote: 'Without commitment you cannot have depth in anything.', author: 'Neil deGrasse Tyson' },
  { quote: 'We are what we repeatedly do. Excellence, then, is not an act but a habit.', author: 'Aristotle' },
  { quote: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
  { quote: 'The person who says it cannot be done should not interrupt the person who is doing it.', author: 'Chinese Proverb' },
  { quote: 'Well done is better than well said.', author: 'Benjamin Franklin' },
  { quote: 'Push yourself, because no one else is going to do it for you.', author: 'Unknown' },
  { quote: 'If opportunity doesn\'t knock, build a door.', author: 'Milton Berle' },
  { quote: 'Teamwork makes the dream work.', author: 'Bang Gae' },
  { quote: 'Safety is a mission, not a policy.', author: 'Unknown' },
  { quote: 'Excellence is doing ordinary things extraordinarily well.', author: 'John Gardner' },
  { quote: 'Make each day your masterpiece.', author: 'John Wooden' },
  { quote: 'No one can make you feel inferior without your consent.', author: 'Eleanor Roosevelt' },
  { quote: 'Success usually comes to those who are too busy to be looking for it.', author: 'Henry David Thoreau' },
  { quote: 'Safety is an investment in human capital.', author: 'Unknown' },
  { quote: 'Great things in business are never done by one person. They\'re done by a team.', author: 'Steve Jobs' },
  { quote: 'The price of excellence is discipline. The cost of mediocrity is disappointment.', author: 'William Arthur Ward' },
  { quote: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn' },
  { quote: 'Every expert was once a beginner.', author: 'Helen Hayes' },
  { quote: 'You miss 100% of the shots you don\'t take.', author: 'Wayne Gretzky' },
  { quote: 'The only limit to our realization of tomorrow is our doubts of today.', author: 'Franklin D. Roosevelt' },
  { quote: 'Don\'t watch the clock — do what it does. Keep going.', author: 'Sam Levenson' },
  { quote: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
  { quote: 'Risk comes from not knowing what you\'re doing.', author: 'Warren Buffett' },
  { quote: 'Safety is a full-time job; don\'t make it a part-time practice.', author: 'Unknown' },
  { quote: 'Professionalism is not a title. It\'s a mindset.', author: 'Unknown' },
  { quote: 'Quality is never an accident — it is always the result of intelligent effort.', author: 'John Ruskin' },
  { quote: 'The true measure of success is how many times you can bounce back from failure.', author: 'Stephen Richards' },
  { quote: 'A goal without a plan is just a wish.', author: 'Antoine de Saint-Exupéry' },
  { quote: 'Leadership is not about being in charge. It is about taking care of those in your charge.', author: 'Simon Sinek' },
  { quote: 'The customer\'s perception is your reality.', author: 'Kate Zabriskie' },
  { quote: 'Service is the rent we pay for being. It is the very purpose of life.', author: 'Marian Wright Edelman' },
  { quote: 'Pride in workmanship transcends all nationalities.', author: 'Unknown' },
  { quote: 'An accident is a failure to identify, a failure to communicate, or a failure to care.', author: 'Unknown' },
  { quote: 'Knowing is not enough; we must apply. Willing is not enough; we must do.', author: 'Johann Wolfgang von Goethe' },
  { quote: 'Safety is not a priority — it\'s a value.', author: 'Unknown' },
  { quote: 'The only person you should try to be better than is who you were yesterday.', author: 'Unknown' },
  { quote: 'Opportunities are usually disguised as hard work, so most people don\'t recognize them.', author: 'Ann Landers' },
  { quote: 'Hard work beats talent when talent doesn\'t work hard.', author: 'Tim Notke' },
  { quote: 'Don\'t find fault — find a remedy.', author: 'Henry Ford' },
  { quote: 'Coming together is a beginning. Keeping together is progress. Working together is success.', author: 'Henry Ford' },
  { quote: 'Safety is not a department. It is the responsibility of every person on every team.', author: 'Unknown' },
  { quote: 'Ability is what you\'re capable of. Motivation gets you going. Attitude keeps you there.', author: 'Lou Holtz' },
  { quote: 'Every accomplishment starts with the decision to try.', author: 'John F. Kennedy' },
  { quote: 'I am not a product of my circumstances. I am a product of my decisions.', author: 'Stephen R. Covey' },
  { quote: 'In the middle of every difficulty lies opportunity.', author: 'Albert Einstein' },
  { quote: 'The best preparation for tomorrow is doing your best today.', author: 'H. Jackson Brown Jr.' },
  { quote: 'Sweat more in training, bleed less in battle.', author: 'Unknown' },
  { quote: 'Reputation is built drop by drop and lost in a flood.', author: 'Unknown' },
  { quote: 'If it\'s not safe, it\'s not work.', author: 'Unknown' },
  { quote: 'Your most unhappy customers are your greatest source of learning.', author: 'Bill Gates' },
  { quote: 'The standard of excellence is never achieved by accident.', author: 'Unknown' },
  { quote: 'Train everyone well enough so they could leave, treat them well enough so they don\'t want to.', author: 'Richard Branson' },
  { quote: 'It always seems impossible until it\'s done.', author: 'Nelson Mandela' },
  { quote: 'Don\'t count the days — make the days count.', author: 'Muhammad Ali' },
  { quote: 'Act as if what you do makes a difference. It does.', author: 'William James' },
  { quote: 'Leave it better than you found it.', author: 'Robert Baden-Powell' },
  { quote: 'Safety isn\'t expensive — it\'s priceless.', author: 'Unknown' },
  { quote: 'We rise by lifting others.', author: 'Robert Ingersoll' },
  { quote: 'A man who dares to waste one hour of time has not discovered the value of life.', author: 'Charles Darwin' },
  { quote: 'The secret is to work less as individuals and more as a team.', author: 'Knute Rockne' },
  { quote: 'You are never too old to set another goal or dream a new dream.', author: 'C.S. Lewis' },
  { quote: 'Productivity is never an accident. It is always the result of commitment to excellence.', author: 'Paul J. Meyer' },
  { quote: 'Take calculated risks. That is quite different from being rash.', author: 'George S. Patton' },
  { quote: 'The ladder of success is best climbed by stepping on the rungs of opportunity.', author: 'Ayn Rand' },
  { quote: 'Show me a thoroughly satisfied man and I will show you a failure.', author: 'Thomas Edison' },
  { quote: 'The most common form of despair is not being who you are.', author: 'Søren Kierkegaard' },
  { quote: 'A good plan today is better than a perfect plan tomorrow.', author: 'General George Patton' },
  { quote: 'Clear eyes, full hearts, can\'t lose.', author: 'Coach Taylor (Friday Night Lights)' },
  { quote: 'Do the right thing even when no one is watching.', author: 'Unknown' },
  { quote: 'The expert in anything was once a beginner who refused to quit.', author: 'Unknown' },
]

// ─── SEED FUNCTION ─────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Starting seed...\n')

  // Users
  console.log('👤 Inserting users...')
  const { data: insertedUsers, error: usersErr } = await supabase
    .from('users')
    .insert(USERS.map(u => ({ ...u, is_active: true })))
    .select()

  if (usersErr) {
    console.error('❌ Users error:', usersErr.message)
    process.exit(1)
  }
  console.log(`   ✓ ${insertedUsers.length} users inserted`)

  // Questions
  console.log('\n❓ Inserting questions...')
  const { data: insertedQuestions, error: questionsErr } = await supabase
    .from('questions')
    .insert(QUESTIONS.map(q => ({
      ...q,
      options: q.options ? q.options : null,
    })))
    .select()

  if (questionsErr) {
    console.error('❌ Questions error:', questionsErr.message)
    process.exit(1)
  }
  console.log(`   ✓ ${insertedQuestions.length} questions inserted`)

  // Quotes
  console.log('\n💬 Inserting quotes...')
  const quotesWithOrder = QUOTES.map((q, i) => ({ ...q, sort_order: i + 1 }))
  const { data: insertedQuotes, error: quotesErr } = await supabase
    .from('quotes')
    .insert(quotesWithOrder)
    .select()

  if (quotesErr) {
    console.error('❌ Quotes error:', quotesErr.message)
    process.exit(1)
  }
  console.log(`   ✓ ${insertedQuotes.length} quotes inserted`)

  // Summary
  const techCount = USERS.filter(u => u.role === 'technician').length
  const mgrCount  = USERS.filter(u => u.role === 'manager').length
  const adminCount = USERS.filter(u => u.role === 'admin').length
  const safetyQ  = QUESTIONS.filter(q => q.category === 'safety').length
  const summerQ  = QUESTIONS.filter(q => q.category === 'summer_service').length
  const winterQ  = QUESTIONS.filter(q => q.category === 'winter_service').length
  const policyQ  = QUESTIONS.filter(q => q.category === 'policy').length

  console.log('\n✅ Seed complete!\n')
  console.log('Users:')
  console.log(`  ${techCount} technicians, ${mgrCount} managers, ${adminCount} admin`)
  console.log('Questions:')
  console.log(`  ${safetyQ} safety  |  ${summerQ} summer service  |  ${winterQ} winter service  |  ${policyQ} policy`)
  console.log(`  ${QUESTIONS.length} total`)
  console.log(`Quotes: ${insertedQuotes.length}`)
  console.log('\nDefault PIN for all users: 1234')
}

seed().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
