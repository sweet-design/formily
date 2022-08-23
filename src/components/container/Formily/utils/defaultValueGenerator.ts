const input = (config: Record<string, any>) => {
  return config.fieldProperties.defaultValue;
};

const select = (config: Record<string, any>) => {
  const dataType = config.fieldProperties.defaultValue.dataType;
  const value = config.fieldProperties.defaultValue.value;

  switch (dataType) {
    case 'text': {
      if (value.trim() !== '') {
        return value;
      }

      return undefined;
    }
    case 'expression': {
      if (value.trim() !== '') {
        return JSON.parse(value);
      }

      return undefined;
    }
    case 'number': {
      if (value) {
        return value;
      }

      return undefined;
    }
  }
};

const arrayTable = (config: Record<string, any>) => {
  const defaultValue = config.fieldProperties.defaultValue.value;

  if (defaultValue.trim() !== '') {
    return JSON.parse(defaultValue);
  }

  return [];
};

export default (config: Record<string, any>) => {
  switch (config.fieldProperties.type) {
    case 'input':
      return input(config);
    case 'arrayTable':
      return arrayTable(config);
    case 'password':
      return input(config);
    case 'textarea':
      return input(config);
    case 'number':
      return input(config);
    case 'select':
      return select(config);
    case 'treeSelect':
      return select(config);
    default:
      return '';
  }
};
