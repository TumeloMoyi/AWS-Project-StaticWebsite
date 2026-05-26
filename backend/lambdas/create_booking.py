import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('BaiaBookings')

def lambda_handler(event, context):
    # Handle CORS preflight OPTIONS request
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            'body': ''
        }
    
    try:
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event.get('body', {})
        
        booking = {
            'bookingId': str(uuid.uuid4()),
            'fullName': body.get('fullName', ''),
            'email': body.get('email', ''),
            'phone': body.get('phone', ''),
            'bookingDate': body.get('bookingDate', ''),
            'bookingTime': body.get('bookingTime', ''),
            'partySize': int(body.get('partySize', 0)),
            'specialRequests': body.get('specialRequests', ''),
            'status': 'confirmed',
            'createdAt': datetime.now().isoformat()
        }
        
        table.put_item(Item=booking)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'success': True, 'message': 'Booking confirmed!', 'bookingId': booking['bookingId']})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': False, 'message': str(e)})
        }