import visualization from '../visualization.json'

const group = visualization.variables[0].name;

const metric = visualization.variables[1].name;

/**
 * Go through all keys and get the deeper value
 * @param {object} metric 
 * @returns {number} value of the deeper key
 */
const getValueFromMetric = metric => {
    const metricKey= metric[_.first(_.keys(metric))];
    if (_.isObject(metricKey)) {
        return getValueFromMetric(metricKey);
    }
    return metricKey;
}

const getTableRow = (label, value, color='') => `<div class="zd_tooltip_info_table_row"><div class="zd_tooltip_info_table_row_label">${label}</div><div class="zd_tooltip_info_table_row_value">${color} ${value}</div></div>`;

const getMetricLabel = data => {
    if (_.has(data, 'label')) {
      const func = _.has(data, 'func') && data.func ? `(${_.replace(data.func, /_/g, ' ')})` : '';
      return `${data.label} ${func}`;
    }
    return '';
  }

const getVolumenMetric = params => {
    if (_.has(params, 'data.datum.current.count')) {
        return `<div class="zd_tooltip_info_table_row">${getTableRow('Volume', `${params.data.datum.current.count} (${params.percent}%)`, '', `(${params.percent}%)`)}</div>`;
    }
    return '';
}

const getExtraMetric = params => {
    if (_.has(params, 'data.datum.current.metrics') && _.isObject(params.data.datum.current.metrics)) {
        const label = getMetricLabel(controller.dataAccessors[metric]._metric);
        return `<div class="zd_tooltip_info_table_row"><div class="zd_tooltip_info_table_row_label">${label}</div><div class="zd_tooltip_info_table_row_value">${controller.dataAccessors[metric].formatted(params.data.datum)}</div></div>`;
    }
    return '';
}

const getMetric = params => {
    return `${getVolumenMetric(params)}${getExtraMetric(params)}`;
}

export const getData = data => data.map(datum => {
    const data = { name: _.first(datum.group), datum, itemStyle: { color: controller.getColorAccessor().color(datum) } }
    if (_.isObject(datum.current.metrics)) {
        data.value = getValueFromMetric(datum.current.metrics);
    } else data.value = datum.current.count;
    return data;
});

export const getMetricTooltip = params => {
    if (params && _.has(params, 'name') && _.has(params, 'color') && _.has(params, 'data.value')) {
        const label = controller.dataAccessors[group]._group.label;
        const color = `<div class="color_icon active" style="background-color: ${params.color};"></div>`;
        const metric = getMetric(params);
        return `<div class="zd_tooltip_info_group customized"><div class="zd_tooltip_info_table"><div class="zd_tooltip_info_table_row">${getTableRow(label, params.name, color)}</div>${metric}</div></div>`;
    }
    return '';
};