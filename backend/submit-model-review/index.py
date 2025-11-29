import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Submit review for a model with rating
    Args: event - dict with httpMethod, body containing review data (modelId, authorName, authorPhone, rating, reviewText)
          context - object with request_id, function_name
    Returns: HTTP response with created review data
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
        INSERT INTO model_reviews (
            model_id, author_name, author_phone, rating, review_text, is_verified
        ) VALUES (
            %s, %s, %s, %s, %s, %s
        ) RETURNING id, model_id, author_name, rating, review_text, created_at
        ''',
        (
            body_data.get('modelId'),
            body_data.get('authorName'),
            body_data.get('authorPhone'),
            body_data.get('rating', 5),
            body_data.get('reviewText'),
            True
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
            'modelId': result['model_id'],
            'authorName': result['author_name'],
            'rating': result['rating'],
            'reviewText': result['review_text'],
            'createdAt': result['created_at'].isoformat()
        }, ensure_ascii=False)
    }
