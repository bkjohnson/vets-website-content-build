import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import moment from 'moment';

import { loadPrescriptions } from '../actions/prescriptions';
import { openGlossaryModal } from '../actions/modal.js';
import Pagination from '../components/Pagination';
import SortableTable from '../components/tables/SortableTable';
import SortMenu from '../components/SortMenu';
import { glossary } from '../config.js';

class History extends React.Component {
  constructor(props) {
    super(props);
    this.handleSort = this.handleSort.bind(this);
    this.openGlossaryModal = this.openGlossaryModal.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(loadPrescriptions());
  }

  handleSort(param, order) {
    const formattedParam = _.snakeCase(param);
    const sortValue = order === 'DESC'
                    ? `-${formattedParam}`
                    : formattedParam;
    this.props.dispatch(loadPrescriptions({
      sort: sortValue
    }));
  }

  openGlossaryModal(term) {
    const content = glossary.filter(obj => {
      return obj.term === term;
    });
    this.props.dispatch(openGlossaryModal(content));
  }

  render() {
    const items = this.props.prescriptions.items;
    let content;

    if (items) {
      const currentSort = this.props.prescriptions.history.sort;

      const fields = [
        { label: 'Last requested', value: 'ordered-date' },
        { label: 'Last fill date', value: 'dispensed-date' },
        { label: 'Prescription', value: 'prescription-name' },
        { label: 'Prescription status', value: 'refill-status' }
      ];

      const data = items.map(item => {
        const attrs = item.attributes;
        const status = _.capitalize(attrs['refill-status']);

        return {
          'ordered-date': moment(
              attrs['ordered-date']
            ).format('MMM DD, YYYY'),
          'dispensed-date': moment(
              attrs['dispensed-date']
            ).format('MMM DD, YYYY'),
          'prescription-name': (
            <Link to={`/rx/prescription/${attrs['prescription-id']}`}>
              {attrs['prescription-name']}
            </Link>
            ),
          'refill-status': (
            <a onClick={() => this.openGlossaryModal(status)}>
              {status}
            </a>
            )
        };
      });

      content = (
        <div>
          <SortMenu
              changeHandler={(e) => this.handleSort(e.target.value)}
              options={fields}
              selected={currentSort}/>
          <SortableTable
              className="usa-table-borderless rx-table rx-table-list"
              currentSort={currentSort}
              data={data}
              fields={fields}
              onSort={this.handleSort}/>
          <Pagination/>
        </div>
      );
    }

    return (
      <div id="rx-history" className="va-tab-content">
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(History);
