window.dateFnsLocaleRu = {
    code: 'ru',
    formatDistance: function(token, count, options) {
      var result = '';
      switch (token) {
        case 'lessThanXSeconds':
          result = 'меньше секунды';
          break;
        case 'xSeconds':
          result = count + ' секунд';
          break;
        case 'halfAMinute':
          result = 'полминуты';
          break;
        case 'lessThanXMinutes':
          result = 'меньше минуты';
          break;
        case 'xMinutes':
          result = count + ' минут';
          break;
        case 'aboutXHours':
          result = 'около ' + count + ' часов';
          break;
        case 'xHours':
          result = count + ' часов';
          break;
        case 'xDays':
          result = count + ' дней';
          break;
        case 'aboutXMonths':
          result = 'около ' + count + ' месяцев';
          break;
        case 'xMonths':
          result = count + ' месяцев';
          break;
        case 'aboutXYears':
          result = 'около ' + count + ' лет';
          break;
        case 'xYears':
          result = count + ' лет';
          break;
        case 'overXYears':
          result = 'больше ' + count + ' лет';
          break;
        case 'almostXYears':
          result = 'почти ' + count + ' лет';
          break;
        default:
          result = '';
      }
      if (options && options.addSuffix) {
        if (options.comparison > 0) {
          return 'через ' + result;
        } else {
          return result + ' назад';
        }
      }
      return result;
    },
    formatLong: {
      date: function() { return 'dd.MM.yyyy'; },
      time: function() { return 'HH:mm'; },
      dateTime: function() { return 'dd.MM.yyyy HH:mm'; }
    },
    formatRelative: function() { return 'P'; },
    localize: function() { return ''; },
    match: function() { return ''; },
    options: {
      weekStartsOn: 1,
      firstWeekContainsDate: 1
    }
  };