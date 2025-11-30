import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import styles from './styles.module.css';

export default function CodeExample(): ReactNode {
  const exampleCode = `import {
  Model,
  Table,
  Column,
  DataTypes,
  DataSource,
  ExpressRouter,
  ODataControler,
} from '@phrasecode/odata';
import express from 'express';

// Define a model
@Table({ tableName: 'products' })
class Product extends Model<Product> {
  @Column({
    dataType: DataTypes.INTEGER,
    isPrimaryKey: true,
    isAutoIncrement: true,
  })
  id: number;

  @Column({ dataType: DataTypes.STRING })
  name: string;

  @Column({ dataType: DataTypes.DECIMAL })
  price: number;
}

// Create data source
const dataSource = new DataSource({
  dialect: 'postgres',
  database: 'mydb',
  username: 'user',
  password: 'password',
  host: 'localhost',
  models: [Product],
});

// Set up Express with OData
const app = express();
const productController = new ODataControler({
  model: Product,
  allowedMethod: ['get', 'post', 'patch', 'delete'],
});
new ExpressRouter(app, { 
  controllers: [productController], 
  dataSource 
});

app.listen(3000);

// Query examples:
// GET /Product?$filter=price gt 50
// GET /Product?$orderby=price desc&$top=5
// GET /Product?$select=name,price
// GET /$metadata`;

  return (
    <section className={styles.codeExample}>
      <div className="container">
        <div className={styles.codeExampleHeader}>
          <Heading as="h2">Quick Example</Heading>
          <p>Get started in minutes with a simple, intuitive API</p>
        </div>
        <div className={styles.codeBlock}>
          <CodeBlock language="typescript" title="server.ts">
            {exampleCode}
          </CodeBlock>
        </div>
      </div>
    </section>
  );
}
