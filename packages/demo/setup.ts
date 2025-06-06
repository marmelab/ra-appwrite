import generateData from 'data-generator-retail';
import * as appwrite from 'node-appwrite';
import { ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.VITE_APPWRITE_ENDPOINT) {
    throw new Error('VITE_APPWRITE_ENDPOINT environment variable is not set.');
}
if (!process.env.VITE_APPWRITE_PROJECTID) {
    throw new Error('VITE_APPWRITE_PROJECTID environment variable is not set.');
}
if (!process.env.APPWRITE_API_KEY) {
    throw new Error('APPWRITE_API_KEY environment variable is not set.');
}

const client = new appwrite.Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECTID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new appwrite.Databases(client);

const result = await databases.list();

if (result.total > 0) {
    console.log('Database already exists, skipping creation.');
    process.exit(0);
}

console.log('Creating database "admin"...');
const databaseId = ID.unique();
await databases.create(databaseId, 'admin');

const collections = [
    'customers',
    'categories',
    'products',
    'orders',
    'invoices',
    'reviews',
] as const;
type CollectionName = (typeof collections)[number];

type Attribute = {
    key: string;
    type: 'string' | 'integer' | 'float' | 'boolean' | 'date';
    size?: number;
    required?: boolean;
    array?: boolean;
};

const collectionTypes: Record<CollectionName, Attribute[]> = {
    customers: [
        { key: 'id', type: 'integer', required: true },
        { key: 'first_name', type: 'string', size: 100 },
        { key: 'last_name', type: 'string', size: 100 },
        { key: 'email', type: 'string', size: 100 },
        { key: 'address', type: 'string', size: 100 },
        { key: 'zipcode', type: 'string', size: 100 },
        { key: 'city', type: 'string', size: 100 },
        { key: 'stateAbbr', type: 'string', size: 100 },
        { key: 'avatar', type: 'string', size: 100 },
        { key: 'birthday', type: 'string', size: 100, required: false },
        { key: 'first_seen', type: 'date' },
        { key: 'last_seen', type: 'date' },
        { key: 'has_ordered', type: 'boolean' },
        { key: 'latest_purchase', type: 'date' },
        { key: 'has_newsletter', type: 'boolean' },
        {
            key: 'groups',
            type: 'string',
            size: 100,
            array: true,
        },
        { key: 'nb_orders', type: 'integer' },
        { key: 'total_spent', type: 'float' },
    ],
    categories: [
        { key: 'id', type: 'integer', required: true },
        { key: 'name', type: 'string', size: 100, required: true },
    ],
    products: [
        { key: 'id', type: 'integer', required: true },
        { key: 'category_id', type: 'integer' },
        { key: 'reference', type: 'string', size: 100, required: true },
        { key: 'width', type: 'float' },
        { key: 'height', type: 'float' },
        { key: 'price', type: 'float' },
        { key: 'thumbnail', type: 'string', size: 100 },
        { key: 'image', type: 'string', size: 100 },
        { key: 'description', type: 'string', size: 5000 },
        { key: 'stock', type: 'integer' },
        { key: 'sales', type: 'float' },
    ],
    orders: [
        { key: 'id', type: 'integer', required: true },
        { key: 'reference', type: 'string', size: 100, required: true },
        { key: 'date', type: 'date' },
        { key: 'customer_id', type: 'integer' },
        { key: 'total_ex_taxes', type: 'float' },
        { key: 'delivery_fees', type: 'float' },
        { key: 'tax_rate', type: 'float' },
        { key: 'taxes', type: 'float' },
        { key: 'total', type: 'float' },
        { key: 'status', type: 'string', size: 100 },
        { key: 'returned', type: 'boolean' },
    ],
    invoices: [
        { key: 'id', type: 'integer', required: true },
        { key: 'date', type: 'date' },
        { key: 'order_id', type: 'integer' },
        { key: 'customer_id', type: 'integer' },
        { key: 'total_ex_taxes', type: 'float' },
        { key: 'delivery_fees', type: 'float' },
        { key: 'tax_rate', type: 'float' },
        { key: 'taxes', type: 'float' },
        { key: 'total', type: 'float' },
    ],
    reviews: [
        { key: 'id', type: 'integer', required: true },
        { key: 'date', type: 'date' },
        { key: 'status', type: 'string', size: 100 },
        { key: 'order_id', type: 'integer' },
        { key: 'product_id', type: 'integer' },
        { key: 'customer_id', type: 'integer' },
        { key: 'rating', type: 'integer' },
        { key: 'comment', type: 'string', size: 2000 },
    ],
};

const collectionIds = collections.reduce((acc, collection) => {
    acc[collection] = ID.unique();
    return acc;
}, {} as Record<CollectionName, string>);

for (const collectionName of collections) {
    console.log(`Creating collection "${collectionName}"...`);
    const collectionId = collectionIds[collectionName];
    await databases.createCollection(databaseId, collectionId, collectionName, [
        Permission.read(Role.users()),
        Permission.write(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
    ]);
}

for (const [collectionName, attributes] of Object.entries(collectionTypes)) {
    const collectionId = collectionIds[collectionName as CollectionName];
    console.log(`Creating attributes for collection "${collectionName}"...`);
    for (const attribute of attributes) {
        switch (attribute.type) {
            case 'string':
                await databases.createStringAttribute(
                    databaseId,
                    collectionId,
                    attribute.key,
                    attribute.size || 255,
                    attribute.required || false,
                    undefined,
                    attribute.array || false
                );
                break;
            case 'integer':
                await databases.createIntegerAttribute(
                    databaseId,
                    collectionId,
                    attribute.key,
                    attribute.required || false,
                    undefined,
                    undefined,
                    undefined,
                    attribute.array || false
                );
                break;
            case 'float':
                await databases.createFloatAttribute(
                    databaseId,
                    collectionId,
                    attribute.key,
                    attribute.required || false,
                    undefined,
                    undefined,
                    undefined,
                    attribute.array || false
                );
                break;
            case 'boolean':
                await databases.createBooleanAttribute(
                    databaseId,
                    collectionId,
                    attribute.key,
                    attribute.required || false,
                    undefined,
                    attribute.array || false
                );
                break;
            case 'date':
                await databases.createDatetimeAttribute(
                    databaseId,
                    collectionId,
                    attribute.key,
                    attribute.required || false,
                    undefined,
                    attribute.array || false
                );
                break;
            default:
                throw new Error(`Unknown attribute type: ${attribute.type}`);
        }
    }
}

console.log('Generating data...');
const data = generateData.default();

for (const collectionName of collections) {
    const collectionId = collectionIds[collectionName as CollectionName];
    console.log(`Inserting data into collection "${collectionName}"...`);
    for (const item of data[collectionName]) {
        // FIXME: basket field is not yet supported
        // @ts-expect-error
        const { basket, ...itemWithoutBasket } = item;
        await databases.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            itemWithoutBasket,
            [
                Permission.read(Role.users()),
                Permission.write(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
        );
    }
}

console.log('Database setup completed successfully.');
