function customTypeParser (key, obj) {
  switch (obj.field_type) {
    case 'bootstrap-utility-class-selector':
      return {
        [key]: {
          type: 'object',
          properties: {
            values: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        }
      }
    case 'vue-color-picker':
      return {
        [key]: {
          type: 'object',
          properties: {
            rgba: {
              type: 'string'
            }
          }
        }
      }
    case 'material-icons-selector':
      return {
        [key]: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            }
          }
        }
      }
    case 'tags-select':
      const isSingle = obj.options.find(item => item.name === 'single' && item.value === 'true')
      if (isSingle) {
        return {
          [key]: {
            type: 'object',
            properties: {
              values: {
                type: 'string'
              }
            }
          }
        }
      }
      return {
        [key]: {
          type: 'object',
          properties: {
            values: {
              type: 'array',
              items: {
                type: 'string'
              }
            }

          }
        }
      }
    case 'table':
      return {
        [key]: {
          type: 'object',
          properties: {
            tbody: {
              type: 'array'
            },
            thead: {
              type: 'array'
            }
          }
        }
      }
    default:
      return {}
  }
}

module.exports = {customTypeParser}
