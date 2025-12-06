-- Add background_image column to mantras table
ALTER TABLE mantras ADD COLUMN background_image TEXT;

-- Update existing mantras with sample background images
UPDATE mantras SET background_image = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' WHERE title_hindi LIKE '%शिव%';
UPDATE mantras SET background_image = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' WHERE title_hindi LIKE '%कृष्ण%';
UPDATE mantras SET background_image = 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' WHERE title_hindi LIKE '%गायत्री%';