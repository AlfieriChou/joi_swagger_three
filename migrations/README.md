### migration

* opt --> create, addColumn, dropColumn, renameColumn, renameTable, query, drop
* table --> opt table
* column --> table column
* field --> field
* content --> field content about(type, length, comment, after)
* after --> after table field
* from_column --> rename field name
* to_column --> rename to field name
* from_table --> rename table name
* to_table --> rename to table name
* sql --> sql

#### create

```javascript
{
    opt: 'create',
    table: 'users',
    column: {
        id: {type: 'increments'},
        user_name: {type: 'string', length: '32', comment: '用户名'},
        age: {type: 'float', precision: 3, scale: 0, comment: '年龄'},
        created_at: {type: 'timestamp', comment: '创建时间'},
        updated_at: {type: 'datetime', comment: '更新时间'},
        deleted_at: {type: 'datetime', comment: '删除时间'}
    }
}
```

#### addColumn

```javascript
{
    opt: 'addColumn',
    table: 'users',
    field: 'real_name',
    content: {
        type: 'string',
        length: '64',
        comment: '真实姓名',
        after: 'user_name'
    }
}
```

#### dropColumn

```javascript
{
    opt: 'dropColumn',
    table: 'users',
    field: 'user_name'
}
```

#### renameColumn

```javascript
{
    opt: 'renameColumn',
    from_column: 'user_name',
    to_column: 'username'
}
```

#### renameTable

```javascript
{
    opt: 'renameTable',
    from_table: 'users',
    to_table: 'old_users'
}
```

#### raw

```javascript
{
    opt: 'raw',
    sql: 'ALTER TABLE user_name CHANGE name name INT;'
}
```

#### drop

```javascript
{
    opt: 'drop',
    table: 'users'
}
```