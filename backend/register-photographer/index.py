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
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        '''
        INSERT INTO photographers (
            full_name, phone, email, city,
            experience_years, specializations, equipment,
            portfolio_links, instagram, vk, telegram,
            about_me, price_range
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        ) RETURNING id, full_name, phone, city, created_at
        ''',
        (
            body_data.get('fullName'),
            body_data.get('phone'),
            body_data.get('email'),
            body_data.get('city'),
            body_data.get('experienceYears'),
            body_data.get('specializations', []),
            body_data.get('equipment'),
            body_data.get('portfolioLinks', []),
            body_data.get('instagram'),
            body_data.get('vk'),
            body_data.get('telegram'),
            body_data.get('aboutMe'),
            body_data.get('priceRange')
        )
    )
    
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
