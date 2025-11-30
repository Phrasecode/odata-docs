import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'OData v4 Compliant',
    icon: '✅',
    description: (
      <>
        Full support for OData v4 protocol including <code>$filter</code>, <code>$select</code>, 
        <code>$expand</code>, <code>$orderby</code>, <code>$top</code>, <code>$skip</code>, 
        and <code>$count</code> query options with automatic metadata generation.
      </>
    ),
  },
  {
    title: 'Sequelize-Powered',
    icon: '🗄️',
    description: (
      <>
        Built on Sequelize ORM with support for PostgreSQL, MySQL, MariaDB, SQLite, 
        SQL Server, and Oracle. Leverage the power of a mature ORM ecosystem.
      </>
    ),
  },
  {
    title: 'TypeScript Decorators',
    icon: '🔷',
    description: (
      <>
        Define models using intuitive TypeScript decorators. Get full type safety, 
        IntelliSense support, and compile-time validation for your data models.
      </>
    ),
  },
  {
    title: 'Express Integration',
    icon: '🚂',
    description: (
      <>
        Seamless integration with Express.js through <code>ExpressRouter</code>. 
        Set up OData endpoints in minutes with minimal configuration.
      </>
    ),
  },
  {
    title: 'Flexible Controllers',
    icon: '⚡',
    description: (
      <>
        Control access with <code>ODataControler</code> allowing you to specify 
        which HTTP methods are permitted (GET, POST, PATCH, DELETE) per model.
      </>
    ),
  },
  {
    title: 'Auto Metadata',
    icon: '📋',
    description: (
      <>
        Automatic <code>/$metadata</code> endpoint generation based on your models. 
        Full EDMX support for client tools and OData consumers.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureIcon}>{icon}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresHeader}>
          <Heading as="h2">Why Choose @phrasecode/odata?</Heading>
          <p>Build powerful RESTful APIs with standardized querying capabilities</p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
