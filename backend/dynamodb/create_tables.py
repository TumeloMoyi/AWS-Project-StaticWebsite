import boto3

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
print("🚀 Creating DynamoDB tables for Baía Seafood...")

# Table 1: Bookings
try:
    dynamodb.create_table(
        TableName='BaiaBookings',
        KeySchema=[{'AttributeName': 'bookingId', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'bookingId', 'AttributeType': 'S'}],
        BillingMode='PAY_PER_REQUEST'
    )
    print(" BaiaBookings table created")
except Exception as e:
    print(f"⚠️ BaiaBookings: {e}")

# Table 2: Orders
try:
    dynamodb.create_table(
        TableName='BaiaOrders',
        KeySchema=[{'AttributeName': 'orderId', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'orderId', 'AttributeType': 'S'}],
        BillingMode='PAY_PER_REQUEST'
    )
    print("✅ BaiaOrders table created")
except Exception as e:
    print(f"⚠️ BaiaOrders: {e}")

# Table 3: Users
try:
    dynamodb.create_table(
        TableName='BaiaUsers',
        KeySchema=[{'AttributeName': 'userId', 'KeyType': 'HASH'}],
        AttributeDefinitions=[{'AttributeName': 'userId', 'AttributeType': 'S'}],
        BillingMode='PAY_PER_REQUEST'
    )
    print(" BaiaUsers table created")
except Exception as e:
    print(f"⚠️ BaiaUsers: {e}")

print("\n🎉 DynamoDB setup complete!")