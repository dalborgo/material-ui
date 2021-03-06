import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import GithubIcon from '@material-ui/docs/svgIcons/GitHub';
import Link from 'docs/src/modules/components/Link';
import appList from './appList';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    // Hide the demo container padding
    margin: -theme.spacing(3),
    // Maintain alignment with the markdown text
    [theme.breakpoints.down('xs')]: {
      padding: 30,
    },
  },
  formControl: {
    marginBottom: theme.spacing(4),
    minWidth: 120,
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  card: {
    marginBottom: theme.spacing(1),
    maxWidth: 600,
  },
  description: {
    marginBottom: theme.spacing(6),
  },
  cardMedia: {
    paddingTop: '75%', // 4:3
  },
});

function byTitle(a, b) {
  return a.title.localeCompare(b.title);
}

// Returns a function that sorts reverse numerically by value of `key`
function sortFactory(key) {
  return function sortNumeric(a, b) {
    if (!b[key]) {
      return -1;
    }
    return a[key] ? b[key] - a[key] : 1;
  };
}

const byNewest = sortFactory('index');
const byVisits = sortFactory('similarWebVisits');
const byStars = sortFactory('stars');

function Showcase(props) {
  const { classes, t } = props;
  const [sortFunction, setSortFunction] = React.useState(() => byVisits);
  const [sortFunctionName, setSortFunctionName] = React.useState('byVisits');

  function handleChangeSort(event) {
    const { value } = event.target;
    setSortFunctionName(value);

    switch (value) {
      case 'byNewest':
        setSortFunction(() => byNewest);
        break;
      case 'byStars':
        setSortFunction(() => byStars);
        break;
      case 'byTitle':
        setSortFunction(() => byTitle);
        break;
      default:
        setSortFunction(() => byVisits);
        break;
    }
  }

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="sort">Sort by</InputLabel>
        <Select value={sortFunctionName} onChange={handleChangeSort} inputProps={{ id: 'sort' }}>
          <MenuItem value="byVisits">{t('traffic')}</MenuItem>
          <MenuItem value="byNewest">{t('newest')}</MenuItem>
          <MenuItem value="byStars">{t('stars')}</MenuItem>
          <MenuItem value="byTitle">{t('alphabetical')}</MenuItem>
        </Select>
      </FormControl>
      {appList.sort(sortFunction).map(app => (
        <div key={app.title}>
          <Typography component="h2" variant="h4" gutterBottom className={classes.title}>
            <span>{app.title}</span>
            {app.source ? (
              <IconButton href={app.source} target="_blank" aria-label={`${app.title} source code`}>
                <GithubIcon />
              </IconButton>
            ) : null}
          </Typography>
          {app.image ? (
            <Card className={classes.card}>
              <CardMedia
                component="a"
                href={app.link}
                rel="noopener"
                target="_blank"
                className={classes.cardMedia}
                image={`/static/images/showcase/${app.image}`}
                title={app.title}
              />
            </Card>
          ) : (
            <Link
              variant="body2"
              target="_blank"
              rel="noopener nofollow"
              href={app.link}
              gutterBottom
            >
              Visit the website
            </Link>
          )}
          <Typography className={classes.description}>{app.description}</Typography>
        </div>
      ))}
    </div>
  );
}

Showcase.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default compose(
  connect(state => ({ t: state.options.t })),
  withStyles(styles),
)(Showcase);
