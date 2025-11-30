import json
import os
from typing import Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Register new photographer with profile data
    Args: event - dict with httpMethod, body containing photographer registration data
          context - object with request_id, function_name
    Returns: HTTP response with created photographer data
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    database_url = os.environ.get('DATABASE_URL')
    
    def escape_sql(value):
        if value is None:
            return 'NULL'
        if isinstance(value, bool):
            return 'TRUE' if value else 'FALSE'
        if isinstance(value, (int, float)):
            return str(value)
        if isinstance(value, list):
            escaped_items = [escape_sql(item) for item in value]
            return "ARRAY[" + ",".join(escaped_items) + "]"
        return "'" + str(value).replace("'", "''") + "'"
    
    conn = psycopg2.connect(database_url)
    conn.autocommit = False
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    full_name = escape_sql(body_data.get('fullName'))
    phone = escape_sql(body_data.get('phone'))
    email = escape_sql(body_data.get('email'))
    city = escape_sql(body_data.get('city'))
    experience_years = escape_sql(body_data.get('experienceYears'))
    specializations = escape_sql(body_data.get('specializations', []))
    equipment = escape_sql(body_data.get('equipment'))
    portfolio_links = escape_sql(body_data.get('portfolioLinks', []))
    instagram = escape_sql(body_data.get('instagram'))
    vk = escape_sql(body_data.get('vk'))
    telegram = escape_sql(body_data.get('telegram'))
    about_me = escape_sql(body_data.get('aboutMe'))
    price_range = escape_sql(body_data.get('priceRange'))
    cooperation_format = escape_sql(body_data.get('cooperationFormat'))
    is_blocked = escape_sql(body_data.get('isBlocked', False))
    profile_photo_url = escape_sql(body_data.get('profilePhotoUrl'))
    
    check_query = f'''
        SELECT id, full_name, phone, city, created_at
        FROM t_p16461725_model_photo_db.photographers
        WHERE phone = {phone}
    '''
    
    cur.execute(check_query)
    existing = cur.fetchone()
    
    if existing:
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'id': existing['id'],
                'fullName': existing['full_name'],
                'phone': existing['phone'],
                'city': existing['city'],
                'createdAt': existing['created_at'].isoformat(),
                'message': 'Photographer with this phone already exists'
            }, ensure_ascii=False)
        }
    
    query = f'''
        INSERT INTO t_p16461725_model_photo_db.photographers (
            full_name, phone, email, city,
            experience_years, specializations, equipment,
            portfolio_links, instagram, vk, telegram,
            about_me, price_range, cooperation_format, is_blocked, profile_photo_url
        ) VALUES (
            {full_name}, {phone}, {email}, {city},
            {experience_years}, {specializations}, {equipment},
            {portfolio_links}, {instagram}, {vk}, {telegram},
            {about_me}, {price_range}, {cooperation_format}, {is_blocked}, {profile_photo_url}
        ) RETURNING id, full_name, phone, city, created_at
    '''
    
    cur.execute(query)
    
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 201,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'id': result['id'],
            'fullName': result['full_name'],
            'phone': result['phone'],
            'city': result['city'],
            'createdAt': result['created_at'].isoformat()
        }, ensure_ascii=False)
    }