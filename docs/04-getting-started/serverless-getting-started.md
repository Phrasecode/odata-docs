---
sidebar_position: 3
---

# Serverless Getting Started Guide

Complete guide to deploying OData APIs in serverless environments using the **OpenRouter** solution.

## Overview

The **OpenRouter** is optimized for serverless deployments with:

- ✅ Minimal cold start overhead
- ✅ Efficient connection pooling for serverless
- ✅ Support for AWS Lambda, Vercel Functions, Netlify Functions
- ✅ Framework-agnostic design
- ✅ Environment variable configuration

## Supported Platforms

- **AWS Lambda** (with API Gateway or ALB)
- **Vercel Functions**
- **Netlify Functions**
- **Google Cloud Functions**
- **Azure Functions**

## Prerequisites

- Node.js 16+ installed
- Serverless platform account (AWS, Vercel, Netlify, etc.)
- Database server accessible from serverless environment
- Basic knowledge of serverless deployments

## Installation

```bash
npm install @phrasecode/odata
```

Install your database driver:

```bash
# PostgreSQL
npm install pg pg-hstore

# MySQL
npm install mysql2
```
***See the [Installation Guide](../02-installation.md) for details.***

## Core Concepts for Serverless

### 1. Connection Pooling

Serverless functions are stateless and short-lived. Configure connection pooling appropriately:

```typescript
pool: {
  max: 2,        // Small pool for serverless
  min: 0,        // No minimum connections
  idle: 1000,    // Close idle connections quickly
  acquire: 10000, // Longer acquire timeout for cold starts
}
```

### 2. Singleton Pattern

Always use singleton pattern to reuse connections across warm starts:

```typescript
let dataSource: DataSource | null = null;

export function getDataSource(): DataSource {
  if (!dataSource) {
    dataSource = new DataSource({
      /* config */
    });
  }
  return dataSource;
}
```

### 3. Environment Variables

Store all configuration in environment variables for security and flexibility.

## Example: AWS Lambda Implementation

### Step 1: Define Models

**models/user.ts:**

```typescript
import { Model, Table, Column, DataTypes } from '@phrasecode/odata';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({
    dataType: DataTypes.INTEGER,
    isPrimaryKey: true,
    isAutoIncrement: true,
  })
  id: number;

  @Column({ dataType: DataTypes.STRING })
  name: string;

  @Column({ dataType: DataTypes.STRING })
  email: string;
}
```

### Step 2: Create DataSource Singleton

**lib/datasource.ts:**

```typescript
import { DataSource } from '@phrasecode/odata';
import { User } from '../models/user';

let dataSource: DataSource | null = null;

export function getDataSource(): DataSource {
  if (!dataSource) {
    dataSource = new DataSource({
      dialect: 'postgres',
      database: process.env.DB_NAME!,
      username: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT || '5432'),

      // Optimized for serverless
      pool: {
        max: 2,
        min: 0,
        idle: 1000,
        acquire: 10000,
      },

      ssl: true,
      models: [User],
    });
  }

  return dataSource;
}
```

### Step 3: Create OpenRouter Singleton

**lib/odata-router.ts:**

```typescript
import { OpenRouter } from '@phrasecode/odata';
import { getDataSource } from './datasource';

let router: OpenRouter | null = null;

export function getODataRouter(): OpenRouter {
  if (!router) {
    router = new OpenRouter({
      dataSource: getDataSource(),
      logger: {
        enabled: true,
        logLevel: 'ERROR',
        format: 'JSON',
      },
    });
  }

  return router;
}
```

### Step 4: Create Lambda Handler

**handlers/user.ts:**

```typescript
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getODataRouter } from '../lib/odata-router';
import { User } from '../models/user';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const router = getODataRouter();

    // Extract path from event
    const path = event.path;

    // Execute OData query
    const result = router.queryable(User)(path);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    console.error('Lambda error:', error);

    return {
      statusCode: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
```

**handlers/metadata.ts:**

```typescript
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getDataSource } from '../lib/datasource';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const dataSource = getDataSource();
    const metadata = dataSource.getMetadata();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
      },
      body: metadata,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
```

### Step 5: Configure Serverless Framework

**serverless.yml:**

```yaml
service: odata-api

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    DB_HOST: ${env:DB_HOST}
    DB_PORT: ${env:DB_PORT}
    DB_NAME: ${env:DB_NAME}
    DB_USER: ${env:DB_USER}
    DB_PASSWORD: ${env:DB_PASSWORD}
  timeout: 30
  memorySize: 512

functions:
  getUsers:
    handler: handlers/user.handler
    events:
      - http:
          path: odata/User
          method: get
          cors: true

  getMetadata:
    handler: handlers/metadata.handler
    events:
      - http:
          path: odata/$metadata
          method: get
          cors: true

plugins:
  - serverless-plugin-typescript
  - serverless-offline
```

> **Note:** If any issues occur during the bundling process, consider **exclude** the package in the serverless.yml configuration. 

### Step 6: Deploy to AWS

```bash
# Install Serverless Framework
npm install -g serverless

# Install plugins
npm install --save-dev serverless-plugin-typescript serverless-offline

# Deploy
serverless deploy

# Test locally
serverless offline
```

## Serverless Best Practices

### 1. Connection Pooling

Use minimal connection pools for serverless:

```typescript
pool: {
  max: 2,        // Very small for serverless
  min: 0,        // No minimum
  idle: 1000,    // Close quickly
  acquire: 10000, // Allow time for cold starts
  evict: 1000,   // Evict idle connections
}
```

### 2. Cold Start Optimization

Minimize cold start time:

```typescript
// Use lazy loading for models
const User = () => require('./models/user').User;

// Initialize DataSource outside handler
const dataSource = getDataSource();
```

### 3. Error Handling

Always handle errors gracefully:

```typescript
try {
  const result = await handler(queryString);
  return { statusCode: 200, body: JSON.stringify(result) };
} catch (error: any) {
  console.error('Function error:', error);
  return {
    statusCode: error.statusCode || 500,
    body: JSON.stringify({
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    }),
  };
}
```

### 4. Timeout Configuration

Set appropriate timeouts:

```typescript
// AWS Lambda
timeout: 30; // seconds

// Vercel
maxDuration: 30; // seconds

// Netlify
functions: timeout: 30; // seconds
```

### 5. Memory Allocation

Allocate sufficient memory:

```typescript
// AWS Lambda
memorySize: 512; // MB

// Vercel
memory: 512; // MB
```

### 6. Database Connection

Use connection pooling services for better performance:

- **AWS RDS Proxy** for AWS Lambda
- **PgBouncer** for PostgreSQL
- **ProxySQL** for MySQL

### 7. Monitoring

Enable logging and monitoring:

```typescript
logger: {
  enabled: true,
  logLevel: 'ERROR',  // Only errors in production
  format: 'JSON',
  advancedOptions: {
    logSqlQuery: false,
    logDbExecutionTime: true,
    logDbQueryParameters: false,
  },
}
```