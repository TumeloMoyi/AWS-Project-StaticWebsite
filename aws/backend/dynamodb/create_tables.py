import boto3
import time

print("🌊 Baía Seafood Restaurant - Backend Setup")
print("=" * 50)

# Connect to DynamoDB (uses your AWS credentials)
dynamodb = boto3.resource('dynamodb')

def create_table(table_name, key_schema, attr_defs, gsi_list=None):
    """Create DynamoDB table if it doesn't exist"""
    try:
        # Check if table exists
        dynamodb.meta.client.describe_table(TableName=table_name)
        print(f"ℹ️  Table '{table_name}' already exists")
        return None
    except dynamodb.meta.client.exceptions.ResourceNotFoundException:
        print(f"📦 Creating table: {table_name}")
        
        params = {
            'TableName': table_name,
            'KeySchema': key_schema,
            'AttributeDefinitions': attr_defs,
            'BillingMode': 'PAY_PER_REQUEST'  # Free tier eligible
        }
        
        if gsi_list:
            params['GlobalSecondaryIndexes'] = gsi_list
        
        table = dynamodb.create_table(**params)
        
        # Wait for table to be active
        waiter = dynamodb.meta.client.get_waiter('table_exists')
        waiter.wait(TableName=table_name)
        
        print(f"✅ Table '{table_name}' created")
        return table

# 1. BOOKINGS TABLE (based on your booking form fields)
create_table(
    'BaiaBookings',
    key_schema=[
        {'AttributeName': 'bookingId', 'KeyType': 'HASH'}  # Partition key
    ],
    attr_defs=[
        {'AttributeName': 'bookingId', 'AttributeType': 'S'},
        {'AttributeName': 'email', 'AttributeType': 'S'},
        {'AttributeName': 'bookingDate', 'AttributeType': 'S'}
    ],
    gsi_list=[
        {
            'IndexName': 'EmailIndex',
            'KeySchema': [{'AttributeName': 'email', 'KeyType': 'HASH'}],
            'Projection': {'ProjectionType': 'ALL'}
        },
        {
            'IndexName': 'DateIndex',
            'KeySchema': [{'AttributeName': 'bookingDate', 'KeyType': 'HASH'}],
            'Projection': {'ProjectionType': 'ALL'}
        }
    ]
)

# 2. ORDERS TABLE (based on your order form)
create_table(
    'BaiaOrders',
    key_schema=[
        {'AttributeName': 'orderId', 'KeyType': 'HASH'}
    ],
    attr_defs=[
        {'AttributeName': 'orderId', 'AttributeType': 'S'},
        {'AttributeName': 'email', 'AttributeType': 'S'}
    ],
    gsi_list=[
        {
            'IndexName': 'EmailIndex',
            'KeySchema': [{'AttributeName': 'email', 'KeyType': 'HASH'}],
            'Projection': {'ProjectionType': 'ALL'}
        }
    ]
)

# 3. USERS TABLE (for Cognito - AWS Cloud Engineer handles this)
create_table(
    'BaiaUsers',
    key_schema=[
        {'AttributeName': 'userId', 'KeyType': 'HASH'}
    ],
    attr_defs=[
        {'AttributeName': 'userId', 'AttributeType': 'S'},
        {'AttributeName': 'email', 'AttributeType': 'S'}
    ],
    gsi_list=[
        {
            'IndexName': 'EmailIndex',
            'KeySchema': [{'AttributeName': 'email', 'KeyType': 'HASH'}],
            'Projection': {'ProjectionType': 'ALL'}
        }
    ]
)

print("\n" + "=" * 50)
print("✅ All DynamoDB tables created successfully!")
print("\n📊 Tables ready:")
print("   - BaiaBookings (table reservations)")
print("   - BaiaOrders (food delivery orders)")
print("   - BaiaUsers (customer accounts)")