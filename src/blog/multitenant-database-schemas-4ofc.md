---json
{
  "title": "Multitenant Database Schemas",
  "excerpt": "I recently got to hang with Jamie Barton (@notrab) from the Turso team. We discussed Multitenant...",
  "date": "2024-07-29T05:14:00.000Z",
  "tags": [
    "sqlite",
    "database",
    "turso"
  ],
  "cover_image": null,
  "canonical_url": "https://www.nickyt.co/blog/multitenant-database-schemas-4ofc/",
  "reading_time_minutes": 4,
  "template": "post"
}
---

I recently got to hang with Jamie Barton (@notrab) from the [Turso](https://turso.tech) team. We discussed Multitenant database schemas and how to set them up. Let's dig in.

## Understanding Multitenant Database Schemas with Turso

In today's cloud-based software landscape, efficiently managing data for multiple clients or organizations is crucial. In this post, we'll explore what multitenant database schemas are, how to set them up, and why they're beneficial for modern applications.

## Introduction to Multitenant Databases

Multitenant databases allow multiple customers (tenants) to share a single database instance while keeping their data isolated. This approach offers significant advantages in terms of resource efficiency and scalability, making it popular for SaaS applications and enterprise software.

## Understanding Schema Databases

### Regular Database vs. Schema Database

The key difference between a regular database and a schema database lies in how changes are managed:

- Regular Database: Operates independently, with schema changes applied directly to the database.
- Schema Database: Acts as a template, where schema changes are observed and forwarded to attached child databases.

Turso implements a database-per-tenant architecture with shared schemas, allowing for efficient management of multi-tenant systems. This approach, as detailed in Turso's [blog post about production-friendly improvements to database-per-tenant architectures](https://turso.tech/blog/database-per-tenant-architectures-get-production-friendly-improvements#multi-database-schema-changes), enables developers to maintain consistent schema across multiple databases while still providing isolation between tenants.

## Creating a Multitenant Database Schema

Before getting started, ensure you have the [Turso CLI installed](https://docs.turso.tech/cli/installation).

The first time you run the Turso CLI, you'll be asked to log in.

![Running command `turso db list` and receiving the error Error: user not logged in, please login with turso auth login](https://www.nickyt.co/images/posts/_uploads_articles_vc0qi1kzn9vm14taffkd.png)

The process of setting up a multitenant database schema with Turso involves the following steps:

1. **Create a Group**: This essentially creates a machine to host the database.

```bash
{% raw %}
turso group create default
{% endraw %}
```

You'll receive a message like this one.

```bash
{% raw %}
Created group default at yul in 8.989s.
{% endraw %}
```

2. **Create a Schema Database**: This database defines the structure for child databases.

```bash
{% raw %}
turso db create parent-db --type schema
{% endraw %}
```

3. **Set Up the Schema**: Connect to the schema database shell and create your table structure.

```bash
{% raw %}
turso db shell parent-db
{% endraw %}
```

For example, in the shell enter:

```sql
{% raw %}
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE
);
{% endraw %}
```

4. Type `.quit` in the shell to exit the shell.

5. Create a child database with the schema DB `parent-db`

```bash
{% raw %}
turso db create child-db1 --schema parent-db
{% endraw %}
```

6. Run `turso db shell child-db1` to load the shell for the newly created `child-db1`

7. Run `.schema` from the shell. Notice the schema:

```bash
{% raw %}
CREATE TABLE users ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);
{% endraw %}
```

8. Type `.quit` in the shell to exit the shell.

9. Create another child Databases with the schema DB `parent-db`

```bash
{% raw %}
turso db create child-db2 --schema parent-db
{% endraw %}
```

10. Run `turso db shell child-db2` to load the shell for the newly created `child-db2`

11. Run `.schema` from the shell. Notice the schema:

```bash
{% raw %}
CREATE TABLE users ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);
{% endraw %}
```

12. Type `.quit` in the shell to exit the shell.

13. Go back to the shell of the `parent-db`. Run `turso db shell parent-db`.

14. Add another field, `emai`

15. Run `.schema` from the shell to view the updated schema.

```bash
{% raw %}
CREATE TABLE users ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT);
{% endraw %}
```

16. Type `.quit` in the shell to exit the shell.

17. Go back to the shell of each child database and view their schemas. Notice they have updated schemas that reflect the schema in the `parent-db`.

## Potential Use Cases

Multitenant database schemas are particularly useful for:

* SaaS applications serving multiple clients
* Enterprise software supporting various departments or subsidiaries
* Platforms requiring strict data isolation between users or organizations

## Benefits of Multitenant Database Schemas

Implementing a multitenant database schema offers several advantages:

1. Scalability: Easily accommodate growing numbers of tenants without major infrastructure changes.
1. Consistency: Maintain uniform schema across all tenant databases.
1. Efficient Management: Simplify updates and maintenance by managing schema in one place.
1. Cost-Effective: Optimize resource utilization by sharing infrastructure.
1. Data Isolation: Ensure data privacy and security between tenants.

## Conclusion

Multitenant database schemas, as implemented by Turso, offer a powerful solution for modern, scalable applications. By understanding and leveraging this architecture, developers can build more efficient, manageable, and secure multi-client systems.

To dive deeper into this topic and see a practical demonstration, check out my full conversation with Jamie Barton.

{% embed "https://www.youtube.com/watch?v=RvmB8WzXWw0" %}

Have you implemented multitenant databases in your projects? Share your experiences or questions in the comments below!

Thanks again Jamie for hanging on stream!

Until the next one!
