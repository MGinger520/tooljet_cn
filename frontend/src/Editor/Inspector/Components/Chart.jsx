import React from 'react';
import { renderElement } from '../Utils';
import { CodeHinter } from '../../CodeBuilder/CodeHinter';
import Accordion from '@/_ui/Accordion';
import { resolveReferences } from '@/_helpers/utils';

class Chart extends React.Component {
  constructor(props) {
    super(props);

    const {
      dataQueries,
      component,
      paramUpdated,
      componentMeta,
      eventUpdated,
      eventOptionUpdated,
      components,
      currentState,
    } = props;

    this.state = {
      dataQueries,
      component,
      paramUpdated,
      componentMeta,
      eventUpdated,
      eventOptionUpdated,
      components,
      currentState,
    };
  }

  componentDidMount() {
    const {
      dataQueries,
      component,
      paramUpdated,
      componentMeta,
      eventUpdated,
      eventOptionUpdated,
      components,
      currentState,
    } = this.props;

    this.setState({
      dataQueries,
      component,
      paramUpdated,
      componentMeta,
      eventUpdated,
      eventOptionUpdated,
      components,
      currentState,
    });
  }

  render() {
    const { dataQueries, component, paramUpdated, componentMeta, components, currentState } = this.state;

    const data = this.state.component.component.definition.properties.data;

    const jsonDescription = this.state.component.component.definition.properties.jsonDescription;

    const plotFromJson = resolveReferences(
      this.state.component.component.definition.properties.plotFromJson?.value,
      currentState
    );

    const chartType = this.state.component.component.definition.properties.type.value;

    let items = [];

    items.push({
      title: '标题',
      children: renderElement(
        component,
        componentMeta,
        paramUpdated,
        dataQueries,
        'title',
        'properties',
        currentState,
        components,
        this.props.darkMode
      ),
    });

    items.push({
      title: '绘制图表架构',
      children: renderElement(
        component,
        componentMeta,
        paramUpdated,
        dataQueries,
        'plotFromJson',
        'properties',
        currentState
      ),
    });

    if (plotFromJson) {
      items.push({
        title: 'json描述',
        children: (
          <CodeHinter
            currentState={this.props.currentState}
            initialValue={jsonDescription?.value ?? {}}
            theme={this.props.darkMode ? 'monokai' : 'duotone-light'}
            mode="javascript"
            lineNumbers={false}
            className="chart-input pr-2"
            onChange={(value) => this.props.paramUpdated({ name: 'jsonDescription' }, 'value', value, 'properties')}
            componentName={`component/${this.props.component.component.name}::${chartType}`}
          />
        ),
      });
    } else {
      items.push({
        title: '特性',
        children: renderElement(
          component,
          componentMeta,
          paramUpdated,
          dataQueries,
          'type',
          'properties',
          currentState,
          components
        ),
      });

      items.push({
        title: '图表数据',
        children: (
          <CodeHinter
            currentState={this.props.currentState}
            initialValue={data.value}
            theme={this.props.darkMode ? 'monokai' : 'duotone-light'}
            mode="javascript"
            lineNumbers={false}
            className="chart-input pr-2"
            onChange={(value) => this.props.paramUpdated({ name: 'data' }, 'value', value, 'properties')}
            componentName={`component/${this.props.component.component.name}::${chartType}`}
          />
        ),
      });
    }

    if (chartType !== 'pie') {
      if (!plotFromJson) {
        items.push({
          title: '标记颜色',
          children: renderElement(
            component,
            componentMeta,
            paramUpdated,
            dataQueries,
            'markerColor',
            'properties',
            currentState
          ),
        });
      }

      items.push({
        title: '选项',
        children: (
          <>
            {renderElement(
              component,
              componentMeta,
              paramUpdated,
              dataQueries,
              'loadingState',
              'properties',
              currentState
            )}
            {renderElement(component, componentMeta, paramUpdated, dataQueries, 'showAxes', 'properties', currentState)}
            {renderElement(
              component,
              componentMeta,
              paramUpdated,
              dataQueries,
              'showGridLines',
              'properties',
              currentState
            )}
          </>
        ),
      });
    }

    items.push({
      title: '布局',
      isOpen: true,
      children: (
        <>
          {renderElement(
            component,
            componentMeta,
            this.props.layoutPropertyChanged,
            dataQueries,
            'showOnDesktop',
            'others',
            currentState,
            components
          )}
          {renderElement(
            component,
            componentMeta,
            this.props.layoutPropertyChanged,
            dataQueries,
            'showOnMobile',
            'others',
            currentState,
            components
          )}
        </>
      ),
    });

    return <Accordion items={items} />;
  }
}

export { Chart };
