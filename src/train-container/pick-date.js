import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// 查询日期限制
const QUERY_START_DATE = '2017-05-18';

function formatDate(date) {
  return date.format('YYYY-MM-DD');
}

export default class PickDate extends Component {
  constructor(props) {
    super(props);
    this.initialDay = 7;
    this.searchDate = DateRange.getInitDateRange(this.initialDay);
    util.bindMethods(['onDateChange'], this);
  }

  componentDidMount() {
    this.onDateChange(this.searchDate);
  }

  downloadFile() {
    const {
      exportURL
    } = this.props;
    this.iframe.src = exportURL;
    util.logEvent({
      event_name: 'Export_Excel',
      event_params: {
        'Export URL': exportURL
      }
    });
  }

  onDateChange({ startDate, endDate }) {
    this.props.onDateChange({
      start_date: formatDate(startDate),
      end_date: formatDate(endDate)
    });
  }

  render() {
    const { exportURL } = this.props;
    return (
      <div className="tb-row-flex tb-row-flex-middle">
        <DateRange
          className="select-area"
          initialDay={this.initialDay}
          onDateChange={this.onDateChange}
          isOutsideRange={date => date.isAfter(moment().hour(12)) || date.isBefore(QUERY_START_DATE)}
        />
        {!!exportURL && <div>
          <a className="date-panel-export" onClick={this.downloadFile.bind(this)}>
            {strings.mcn_Export_Excel}
          </a>
          <iframe style={{ display: 'none' }} ref={el => this.iframe = el} />
        </div> }
      </div>
    );
  }
}
PickDate.propTypes = {
  onDateChange: PropTypes.func.isRequired,
  exportURL: PropTypes.string
};

PickDate.defaultProps = {
  exportURL: ''
};
