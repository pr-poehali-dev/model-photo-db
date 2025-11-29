import json
import os
from typing import Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Search and filter models or photographers with pagination
    Args: event - dict with httpMethod, queryStringParameters (type: model|photographer, filters)
          context - object with request_id, function_name
    Returns: HTTP response with filtered profiles list and pagination info
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters', {}) or {}
    profile_type = params.get('type', 'model')
    
    page = int(params.get('page', 1))
    per_page = 20
    offset = (page - 1) * per_page
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    if profile_type == 'model':
        result = search_models(cur, params, page, per_page, offset)
    else:
        result = search_photographers(cur, params, page, per_page, offset)
    
    cur.close()
    conn.close()
    
    return result

def search_models(cur, params, page, per_page, offset):
    profile_id = params.get('id')
    name = params.get('name')
    city = params.get('city', 'Хабаровск')
    gender = params.get('gender')
    min_height = params.get('minHeight')
    max_height = params.get('maxHeight')
    min_age = params.get('minAge')
    max_age = params.get('maxAge')
    openness_level = params.get('opennessLevel')
    cooperation_format = params.get('cooperationFormat')
    
    query_conditions = ["is_blocked = FALSE"]
    
    if profile_id:
        query_conditions.append(f"id = {int(profile_id)}")
    if name:
        safe_name = name.replace("'", "''")
        query_conditions.append(f"full_name ILIKE '%{safe_name}%'")
    if city:
        safe_city = city.replace("'", "''")
        query_conditions.append(f"city = '{safe_city}'")
    if gender:
        safe_gender = gender.replace("'", "''")
        query_conditions.append(f"gender = '{safe_gender}'")
    if min_height:
        query_conditions.append(f"height >= {int(min_height)}")
    if max_height:
        query_conditions.append(f"height <= {int(max_height)}")
    if min_age:
        current_year = datetime.now().year
        max_birth_year = current_year - int(min_age)
        query_conditions.append(f"EXTRACT(YEAR FROM birth_date) <= {max_birth_year}")
    if max_age:
        current_year = datetime.now().year
        min_birth_year = current_year - int(max_age)
        query_conditions.append(f"EXTRACT(YEAR FROM birth_date) >= {min_birth_year}")
    if openness_level:
        levels = ['Портрет', 'Купальник', 'Бельё', 'Гламур', 'Эротика', 'Ню', 'Метарт', 'Порно']
        if openness_level in levels:
            level_index = levels.index(openness_level)
            allowed_levels = levels[level_index:]
            levels_str = "', '".join(allowed_levels)
            query_conditions.append(f"openness_level IN ('{levels_str}')")
    if cooperation_format:
        safe_format = cooperation_format.replace("'", "''")
        query_conditions.append(f"cooperation_format = '{safe_format}'")
    
    where_clause = ' AND '.join(query_conditions)
    
    count_query = f'''
        SELECT COUNT(*) as total 
        FROM t_p16461725_model_photo_db.models 
        WHERE {where_clause}
    '''
    cur.execute(count_query)
    total_count = cur.fetchone()['total']
    
    data_query = f'''
        SELECT id, full_name, phone, email, birth_date, gender, height, 
               city, profile_photo_url, openness_level, cooperation_format, 
               created_at, last_login
        FROM t_p16461725_model_photo_db.models
        WHERE {where_clause}
        ORDER BY last_login DESC NULLS LAST
        LIMIT {per_page} OFFSET {offset}
    '''
    cur.execute(data_query)
    models = cur.fetchall()
    
    result = []
    for model in models:
        age = None
        if model['birth_date']:
            age = datetime.now().year - model['birth_date'].year
        
        result.append({
            'id': model['id'],
            'fullName': model['full_name'],
            'age': age,
            'height': model['height'],
            'city': model['city'],
            'gender': model['gender'],
            'opennessLevel': model['openness_level'],
            'cooperationFormat': model['cooperation_format'],
            'profilePhotoUrl': model['profile_photo_url'],
            'lastLogin': model['last_login'].isoformat() if model['last_login'] else None
        })
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'profiles': result,
            'pagination': {
                'page': page,
                'perPage': per_page,
                'total': total_count,
                'totalPages': (total_count + per_page - 1) // per_page
            }
        }, ensure_ascii=False)
    }

def search_photographers(cur, params, page, per_page, offset):
    profile_id = params.get('id')
    name = params.get('name')
    city = params.get('city', 'Хабаровск')
    specialization = params.get('specialization')
    cooperation_format = params.get('cooperationFormat')
    
    query_conditions = ["is_blocked = FALSE"]
    
    if profile_id:
        query_conditions.append(f"id = {int(profile_id)}")
    if name:
        safe_name = name.replace("'", "''")
        query_conditions.append(f"full_name ILIKE '%{safe_name}%'")
    if city:
        safe_city = city.replace("'", "''")
        query_conditions.append(f"city = '{safe_city}'")
    if specialization:
        safe_spec = specialization.replace("'", "''")
        query_conditions.append(f"'{safe_spec}' = ANY(specializations)")
    if cooperation_format:
        safe_format = cooperation_format.replace("'", "''")
        query_conditions.append(f"cooperation_format = '{safe_format}'")
    
    where_clause = ' AND '.join(query_conditions)
    
    count_query = f'''
        SELECT COUNT(*) as total 
        FROM t_p16461725_model_photo_db.photographers 
        WHERE {where_clause}
    '''
    cur.execute(count_query)
    total_count = cur.fetchone()['total']
    
    data_query = f'''
        SELECT id, full_name, phone, email, city, specializations, 
               profile_photo_url, cooperation_format, price_range,
               experience_years, created_at, last_login
        FROM t_p16461725_model_photo_db.photographers
        WHERE {where_clause}
        ORDER BY last_login DESC NULLS LAST
        LIMIT {per_page} OFFSET {offset}
    '''
    cur.execute(data_query)
    photographers = cur.fetchall()
    
    result = []
    for photographer in photographers:
        result.append({
            'id': photographer['id'],
            'fullName': photographer['full_name'],
            'city': photographer['city'],
            'specializations': photographer['specializations'],
            'cooperationFormat': photographer['cooperation_format'],
            'priceRange': photographer['price_range'],
            'experienceYears': photographer['experience_years'],
            'profilePhotoUrl': photographer['profile_photo_url'],
            'lastLogin': photographer['last_login'].isoformat() if photographer['last_login'] else None
        })
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'profiles': result,
            'pagination': {
                'page': page,
                'perPage': per_page,
                'total': total_count,
                'totalPages': (total_count + per_page - 1) // per_page
            }
        }, ensure_ascii=False)
    }
