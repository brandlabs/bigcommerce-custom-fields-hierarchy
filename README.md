# BigCommerce Custom Fields Hierarchy

Utility module for transforming hierarchically constructed products custom fields to Javascript objects.

## Usage

### Constructing custom fields
Let's say we have a parent child relationship with custom fields, for example: "Dimensions" custom field can have two sub custom fields "Dimension A" and "Dimension B".

We can build this relationship by constructing custom field names as paths, so with "Dimensions" custom field hierarchy we get:
```
Custom Field #1 Name: Dimensions / A
Custom Field #2 Name: Dimensions / B
```

So the delimiter is a slash.

Now let's say we want to separate these kinds of custom fields from the other custom fields, so they can be used separately. For example if we want to generate a chart from this custom fields paths, we can add a name space in the beginning of the custom field name:

```
Custom Field #1 Name: Chart / Dimensions / A
Custom Field #2 Name: Chart / Dimensions / B
```

### Transforming custom fields to an object

Now as we have custom fields paths built, we can transform them into object:

```javascript
import transformPathToHierarchy from 'bigcommerce-custom-fields-hierarchy';

const customFieldsObj = transformPathToHierarchy(this.context.category.products, 'Chart');
console.log(customFieldsObj);
```

As a result we get an object:

```
[
  {
    "name": " Dimensions ",
    "children": [
      {
        "name": " A",
        "path": "Chart / Dimensions / A"
      },
      {
        "name": " B",
        "path": "Chart / Dimensions / B"
      }
    ]
  }
]
```
## API

<a name="flattenHierarchy"></a>

## flattenHierarchy(hierarchy) ⇒ <code>Array</code>
Flattens the Hierarchy to only one level

| Param | Type |
| --- | --- |
| hierarchy | <code>Array</code> | 

<a name="fieldExists"></a>

## fieldExists(fields, fieldName) ⇒ <code>Boolean</code>

| Param | Type |
| --- | --- |
| fields | <code>Array</code> | 
| fieldName | <code>string</code> | 

<a name="populateChildFields"></a>

## populateChildFields(hierarchy, parentField, childField, index, path) ⇒ <code>Array</code>
Adds the second level of custom fields to the hierarchy

| Param | Type |
| --- | --- |
| hierarchy | <code>Array</code> | 
| parentField | <code>string</code> | 
| childField | <code>string</code> | 
| index | <code>number</code> | 
| path | <code>string</code> | 

<a name="populateFields"></a>

## populateFields(hierarchy, path, index, namespace) ⇒ <code>Array</code>
Adds the first level of custom fields to the hierarchy

| Param | Type | Description |
| --- | --- | --- |
| hierarchy | <code>Array</code> |  |
| path | <code>string</code> | a full path of a custom field |
| index | <code>number</code> | used for retaining the order of the custom fields |
| namespace | <code>string</code> |  |

<a name="transformPathToHierarchy"></a>

## transformPathToHierarchy(products, namespace) ⇒ <code>Array</code>
Transforms products custom fields paths into Javascript object

| Param | Type | Description |
| --- | --- | --- |
| products | <code>Array</code> | products that are coming from BigCommerce context |
| namespace | <code>string  </code> | only transform custom fields which have this namespace |

