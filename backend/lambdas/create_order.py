import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('BaiaOrders')

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
        
        price = body.get('price', 0)
        quantity = int(body.get('quantity', 1))
        total = price * quantity
        
        order = {
            'orderId': str(uuid.uuid4()),
            'fullName': body.get('fullName', ''),
            'email': body.get('email', ''),
            'phone': body.get('phone', ''),
            'menuItem': body.get('menuItem', ''),
            'quantity': quantity,
            'deliveryAddress': body.get('deliveryAddress', ''),
            'specialInstructions': body.get('specialInstructions', ''),
            'totalAmount': total,
            'status': 'received',
            'createdAt': datetime.now().isoformat()
        }
        
        table.put_item(Item=order)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'success': True, 'message': 'Order received!', 'orderId': order['orderId'], 'total': total})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'message': str(e)})
        }