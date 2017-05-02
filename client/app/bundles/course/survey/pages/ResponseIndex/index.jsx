import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Link, browserHistory } from 'react-router';
import mirrorCreator from 'mirror-creator';
import { Card, CardText } from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import IconButton from 'material-ui/IconButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import { red500 } from 'material-ui/styles/colors';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TitleBar from 'lib/components/TitleBar';
import BarChart from 'lib/components/BarChart';
import { formatDateTime } from 'lib/date-time-defaults';
import { fetchResponses } from 'course/survey/actions/responses';
import surveyTranslations from 'course/survey/translations';
import LoadingIndicator from 'course/survey/components/LoadingIndicator';
import UnsubmitButton from 'course/survey/containers/UnsubmitButton';
import { surveyShape, responseShape } from 'course/survey/propTypes';
import RemindButton from './RemindButton';

const styles = {
  red: {
    color: red500,
  },
  table: {
    maxWidth: 600,
  },
  detailsCard: {
    marginBottom: 30,
  },
  statsCard: {
    marginBottom: 30,
  },
  statsHeader: {
    marginBottom: 30,
  },
  toggle: {
    marginTop: 30,
  },
};

const responseStatus = mirrorCreator([
  'NOT_STARTED',
  'SUBMITTED',
  'RESPONDING',
]);

const translations = defineMessages({
  name: {
    id: 'course.surveys.ResponseIndex.name',
    defaultMessage: 'Name',
  },
  responseStatus: {
    id: 'course.surveys.ResponseIndex.responseStatus',
    defaultMessage: 'Response Status',
  },
  [responseStatus.NOT_STARTED]: {
    id: 'course.surveys.ResponseIndex.notStarted',
    defaultMessage: 'Not Started',
  },
  [responseStatus.SUBMITTED]: {
    id: 'course.surveys.ResponseIndex.submitted',
    defaultMessage: 'Submitted',
  },
  [responseStatus.RESPONDING]: {
    id: 'course.surveys.ResponseIndex.responding',
    defaultMessage: 'Responding',
  },
  submittedAt: {
    id: 'course.surveys.ResponseIndex.submittedAt',
    defaultMessage: 'Submitted At',
  },
  phantoms: {
    id: 'course.surveys.ResponseIndex.phantoms',
    defaultMessage: 'Phantom Students',
  },
  stats: {
    id: 'course.surveys.ResponseIndex.stats',
    defaultMessage: 'Response Statistics',
  },
  includePhantoms: {
    id: 'course.surveys.ResponseIndex.includePhantoms',
    defaultMessage: 'Include Phantom Students',
  },
});

class ResponseIndex extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    surveys: PropTypes.arrayOf(surveyShape),
    responses: PropTypes.arrayOf(responseShape),
    isLoading: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
      surveyId: PropTypes.string.isRequired,
    }).isRequired,
  };

  static computeStatuses(responses) {
    const summary = {
      [responseStatus.NOT_STARTED]: 0,
      [responseStatus.SUBMITTED]: 0,
      [responseStatus.RESPONDING]: 0,
    };
    const responsesWithStatuses = [];
    const updateStatus = (response, status) => {
      summary[status] += 1;
      responsesWithStatuses.push({ ...response, status });
    };
    responses.forEach((response) => {
      if (!response.present) {
        updateStatus(response, responseStatus.NOT_STARTED);
      } else if (response.submitted_at) {
        updateStatus(response, responseStatus.SUBMITTED);
      } else {
        updateStatus(response, responseStatus.RESPONDING);
      }
    });

    return { responses: responsesWithStatuses, summary };
  }

  static renderReponseStatus(response, survey) {
    const status = <FormattedMessage {...translations[response.status]} />;
    if (response.status === responseStatus.NOT_STARTED) {
      return <div style={styles.red}>{ status }</div>;
    }
    return survey.anonymous ? status : <Link to={response.path}>{ status }</Link>;
  }

  static renderSubmittedAt(response, survey) {
    if (!response.submitted_at) {
      return null;
    }
    const submittedAt = moment(response.submitted_at).format('DD MMM YYYY, h:mma');
    if (survey.end_at && moment(response.submitted_at).isAfter(survey.end_at)) {
      return <div style={styles.red}>{ submittedAt }</div>;
    }
    return submittedAt;
  }

  static renderTable(responses, survey) {
    return (
      <Table>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn colSpan={2}>
              <FormattedMessage {...translations.name} />
            </TableHeaderColumn>
            <TableHeaderColumn>
              <FormattedMessage {...translations.responseStatus} />
            </TableHeaderColumn>
            <TableHeaderColumn>
              <FormattedMessage {...translations.submittedAt} />
            </TableHeaderColumn>
            <TableHeaderColumn />
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          showRowHover
        >
          {
            responses.map(response => (
              <TableRow key={response.course_user.id}>
                <TableRowColumn colSpan={2}>
                  <a href={response.course_user.path}>
                    { response.course_user.name }
                  </a>
                </TableRowColumn>
                <TableRowColumn>
                  { ResponseIndex.renderReponseStatus(response, survey) }
                </TableRowColumn>
                <TableRowColumn>
                  { ResponseIndex.renderSubmittedAt(response, survey) }
                </TableRowColumn>
                <TableRowColumn>
                  {
                    response.status === responseStatus.SUBMITTED && response.canUnsubmit ?
                      <UnsubmitButton responseId={response.id} /> : null
                  }
                </TableRowColumn>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    );
  }

  static renderPhantomTable(responses, survey) {
    if (responses.length < 1) { return null; }

    return (
      <div>
        <h1><FormattedMessage {...translations.phantoms} /></h1>
        { ResponseIndex.renderTable(responses, survey) }
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      includePhantomsInStats: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchResponses());
  }

  renderHeader(survey) {
    const { params: { courseId, surveyId } } = this.props;
    return (
      <div>
        <TitleBar
          title={survey.title}
          iconElementLeft={<IconButton><ArrowBack /></IconButton>}
          onLeftIconButtonTouchTap={() => browserHistory.push(`/courses/${courseId}/surveys/${surveyId}`)}
        />
        <Card style={styles.detailsCard}>
          <Table style={styles.table}>
            <TableBody displayRowCheckbox={false}>
              <TableRow>
                <TableRowColumn>
                  <FormattedMessage {...surveyTranslations.opensAt} />
                </TableRowColumn>
                <TableRowColumn>
                  {formatDateTime(survey.start_at)}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>
                  <FormattedMessage {...surveyTranslations.expiresAt} />
                </TableRowColumn>
                <TableRowColumn>
                  {formatDateTime(survey.end_at)}
                </TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>
                  <FormattedMessage {...surveyTranslations.closingRemindedAt} />
                </TableRowColumn>
                <TableRowColumn>
                  {survey.closing_reminded_at ? formatDateTime(survey.closing_reminded_at) : '-'}
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
          <CardText>
            <RemindButton />
          </CardText>
        </Card>
      </div>
    );
  }

  renderStats(realResponsesStatuses, phantomResponsesStatuses) {
    const { NOT_STARTED, RESPONDING, SUBMITTED } = responseStatus;
    const dataColor = { [NOT_STARTED]: 'red', [RESPONDING]: 'yellow', [SUBMITTED]: 'green' };
    const chartData = [NOT_STARTED, RESPONDING, SUBMITTED].map((state) => {
      const count = this.state.includePhantomsInStats ?
        realResponsesStatuses[state] + phantomResponsesStatuses[state] :
        realResponsesStatuses[state];
      return {
        count,
        color: dataColor[state],
        label: <FormattedMessage {...translations[state]} />,
      };
    });

    return (
      <Card style={styles.statsCard}>
        <CardText>
          <h3 style={styles.statsHeader}><FormattedMessage {...translations.stats} /></h3>
          <BarChart data={chartData} />
          <Toggle
            style={styles.toggle}
            labelPosition="right"
            label={<FormattedMessage {...translations.includePhantoms} />}
            onToggle={(_, value) => this.setState({ includePhantomsInStats: value })}
          />
        </CardText>
      </Card>
    );
  }

  renderBody(survey) {
    const { responses, isLoading } = this.props;
    if (isLoading) { return <LoadingIndicator />; }

    const { realResponses, phantomResponses } = responses.reduce(
      (categories, response) => {
        const cateogry = response.course_user.phantom ? 'phantomResponses' : 'realResponses';
        categories[cateogry].push(response);
        return categories;
      },
      { realResponses: [], phantomResponses: [] }
    );

    const { responses: realResponsesWithStatuses, summary: realResponsesStatuses } =
      ResponseIndex.computeStatuses(realResponses);
    const { responses: phantomResponsesWithStatuses, summary: phantomResponsesStatuses } =
      ResponseIndex.computeStatuses(phantomResponses);

    return (
      <div>
        { this.renderStats(realResponsesStatuses, phantomResponsesStatuses) }
        { ResponseIndex.renderTable(realResponsesWithStatuses, survey) }
        { ResponseIndex.renderPhantomTable(phantomResponsesWithStatuses, survey) }
      </div>
    );
  }

  render() {
    const { surveys, params: { surveyId } } = this.props;
    const survey = surveys && surveys.length > 0 ?
                   surveys.find(s => String(s.id) === String(surveyId)) : {};
    return (
      <div>
        { this.renderHeader(survey) }
        { this.renderBody(survey) }
      </div>
    );
  }
}

export default connect(state => ({
  ...state.responses,
  surveys: state.surveys,
}))(ResponseIndex);
