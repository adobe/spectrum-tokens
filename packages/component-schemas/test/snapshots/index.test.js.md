# Snapshot report for `test/index.test.js`

The actual snapshot is saved in `index.test.js.snap`.

Generated by [AVA](https://avajs.dev).

## getSchemaFile should fetch schema data

> Snapshot 1

    {
      $id: 'https://opensource.adobe.com/spectrum-tokens/schemas/component.json',
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      properties: {
        meta: {
          properties: {
            category: {
              enum: [
                'actions',
                'containers',
                'data visualization',
                'feedback',
                'inputs',
                'navigation',
                'status',
                'typography',
              ],
              type: 'string',
            },
            documentationUrl: {
              format: 'uri',
              type: 'string',
            },
          },
          required: [
            'category',
            'documentationUrl',
          ],
          type: 'object',
        },
      },
      required: [
        'meta',
        'title',
        'description',
        'properties',
        '$id',
      ],
      title: 'Component',
      type: 'object',
    }
