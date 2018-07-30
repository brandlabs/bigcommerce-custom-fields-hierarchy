# BigCommerce Custom Fields Hierarchy

Utility module for transforming hierarchically constructed products custom fields to Javascript objects.

## Guidelines

### Constructing custom fields
Let's say we have a parent child relationship with custom fields, for example: "Dimensions" custom field can have two sub custom fields "Dimension A" and "Dimension B".

We can build this relationship by constructing custom field names as paths, so with "Dimensions" custom field hierarchy we get:
```
Custom Field #1 Name: Dimensions \ A
Custom Field #2 Name: Dimensions \ B
```

So the delimiter is a slash.

Now let's say we want to separate these kinds of custom fields from the other custom fields, so they can be used separately. For example if we want to generate a chart from this custom fields paths, we can add a name space in the beginning of the custom field name:

```
Custom Field #1 Name: Chart \ Dimensions \ A
Custom Field #2 Name: Chart \ Dimensions \ B
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
        "path": "Dimensions \ A"
      },
      {
        "name": " B",
        "path": "Dimensions \ B"
      }
    ]
  }
]
```

Please note that the depth can be unlimited. For example `Chart \ Thread Sizes \ Caps \ Baseball` will get us:
```
[{
  "name": " Thread Sizes ",
  "path": " Thread Sizes ",
  "children": [
    {
      "name": " Caps",
      "path": " Thread Sizes \ Caps",
      "children": [
        {
          "name": " Baseball",
          "path": " Thread Sizes \ Caps \ Baseball",
          "children": []
        }
      ]
    }
  ]
}]
```

### Delimiter format

The format for delimiter is `[whitespace]\[whitespace]`, so backslashes which are not surrounded with whitespace won't be considered as separator and will be included as a custom field title.

## API

<a name="transformPathToHierarchy"></a>

## transformPathToHierarchy(products, namespace) ⇒ <code>Array</code>
Transforms products custom fields paths into Javascript object

| Param | Type | Description |
| --- | --- | --- |
| products | <code>Array</code> | products that are coming from BigCommerce context |
| namespace | <code>string  </code> | only transform custom fields which have this namespace |

## Notes
- Since BigCommerce doesn't transpile external package code (for oldies like IE11), we provide transpiled files inside __dist/__ folder. You can access these files adding an alias on your `webpack.conf.js` file like `'bigcommerce-custom-fields-hierarchy': path.resolve(__dirname, 'node_modules/bigcommerce-custom-fields-hierarchy/dist/product-options.min.js')`

## Authors
* Shota Karkashadze

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

[![alt text](/brandlabs.png)](http://www.brandlabs.us/?utm_source=gitlab&utm_medium=technology_referral&utm_campaign=brandlabs-bigcommerce-custom-fields-hierarchy)
