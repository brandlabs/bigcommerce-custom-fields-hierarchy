# BigCommerce Custom Fields Hierarchy

Utility module for transforming hierarchically constructed products custom fields to Javascript objects.

## Info
* **URL:** https://www.npmjs.com/package/bigcommerce-custom-fields-hierarchy
* **Platform:** BigCommerce

## Setup
Requirements: [NodeJS](https://nodejs.org/en/download/package-manager/), [npm](https://docs.npmjs.com/getting-started/installing-node#install-npm--manage-npm-versions)

**1\. Run `npm ci` to install dependencies.**

**2\. Inject products in your cornerstone template.**

You can use **any** types of product list, for example products that are coming with category or related products.

`{{inject "products" category.products}}`

Or

`{{inject "relatedProducts" product.related_products}}`

Or any other product list which has custom fields property

**3\. Import the library main function in your theme JS.**

For example, for [Cornerstone](https://github.com/bigcommerce/cornerstone) it could be any `PageManager` file.

`import transformPathToHierarchy from 'bigcommerce-custom-fields-hierarchy';`

**4\. Transform custom fields to JS object**

`const customFieldsObj = transformPathToHierarchy(this.context.category.products, 'Chart');`

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

const customFieldsObj = transformPathToHierarchy(this.context.products, 'Chart');
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

### Example of constructing custom fields

![BigCommerce Custom fields](https://user-images.githubusercontent.com/3370367/44449946-a26c0880-a600-11e8-8785-7d52e64d8e45.png "BigCommerce Custom fields")

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

[![alt text](/assets/brandlabs.png)](http://www.brandlabs.us/?utm_source=gitlab&utm_medium=technology_referral&utm_campaign=brandlabs-bigcommerce-custom-fields-hierarchy)
