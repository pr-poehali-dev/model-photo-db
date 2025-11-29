-- Добавляем недостающие индексы для моделей
CREATE INDEX IF NOT EXISTS idx_models_blocked ON t_p16461725_model_photo_db.models(is_blocked);
CREATE INDEX IF NOT EXISTS idx_models_last_login ON t_p16461725_model_photo_db.models(last_login DESC);

-- Добавляем недостающие индексы для фотографов
CREATE INDEX IF NOT EXISTS idx_photographers_cooperation ON t_p16461725_model_photo_db.photographers(cooperation_format);
CREATE INDEX IF NOT EXISTS idx_photographers_city ON t_p16461725_model_photo_db.photographers(city);
CREATE INDEX IF NOT EXISTS idx_photographers_blocked ON t_p16461725_model_photo_db.photographers(is_blocked);
CREATE INDEX IF NOT EXISTS idx_photographers_last_login ON t_p16461725_model_photo_db.photographers(last_login DESC);