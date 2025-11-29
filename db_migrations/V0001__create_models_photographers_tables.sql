-- Таблица моделей
CREATE TABLE models (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    birth_date DATE NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Женщина', 'Мужчина', 'Другое')),
    height INTEGER,
    weight INTEGER,
    bust INTEGER,
    waist INTEGER,
    hips INTEGER,
    shoe_size DECIMAL(3,1),
    hair_color VARCHAR(50),
    eye_color VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    experience TEXT,
    specializations TEXT[],
    portfolio_links TEXT[],
    instagram VARCHAR(255),
    vk VARCHAR(255),
    telegram VARCHAR(255),
    about_me TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    profile_photo_url TEXT,
    portfolio_photos TEXT[]
);

-- Таблица фотографов
CREATE TABLE photographers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    experience_years INTEGER,
    specializations TEXT[],
    equipment TEXT,
    portfolio_links TEXT[],
    instagram VARCHAR(255),
    vk VARCHAR(255),
    telegram VARCHAR(255),
    about_me TEXT,
    price_range VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    profile_photo_url TEXT,
    portfolio_photos TEXT[]
);

-- Таблица отзывов для моделей
CREATE TABLE model_reviews (
    id SERIAL PRIMARY KEY,
    model_id INTEGER NOT NULL REFERENCES models(id),
    author_name VARCHAR(255) NOT NULL,
    author_phone VARCHAR(20) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE
);

-- Таблица отзывов для фотографов
CREATE TABLE photographer_reviews (
    id SERIAL PRIMARY KEY,
    photographer_id INTEGER NOT NULL REFERENCES photographers(id),
    author_name VARCHAR(255) NOT NULL,
    author_phone VARCHAR(20) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE
);

-- Индексы для быстрого поиска
CREATE INDEX idx_models_city ON models(city);
CREATE INDEX idx_models_gender ON models(gender);
CREATE INDEX idx_models_created_at ON models(created_at);
CREATE INDEX idx_photographers_city ON photographers(city);
CREATE INDEX idx_photographers_created_at ON photographers(created_at);
CREATE INDEX idx_model_reviews_model_id ON model_reviews(model_id);
CREATE INDEX idx_photographer_reviews_photographer_id ON photographer_reviews(photographer_id);