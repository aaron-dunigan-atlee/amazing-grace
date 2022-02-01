var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1mI0Prj20RwR-9bMV_wnmKgavspKl7jg6cvYrOLi61Fg/pub?output=csv';
var sponsorSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQM_Fvk7louC_v6rGXUR0vKfRnmYqZcRQ8ZFnPoj_am9RsBTxY5xaLCty0Qtw1CHMK-eLeYvBCZcJts/pub?gid=306826384&single=true&output=csv'

var SPONSORSHIP_LEVELS = [
  '$15,000+',
  '$10,000 - $14,999',
  '$5,000 - $9,999',
  '$3,000 - $4,999',
  '$1,000 - $2,999',
  '$999 and under'
]

function init()
{
  // See https://www.papaparse.com/docs
  Papa.parse(publicSpreadsheetUrl, {
    download: true,
    header: true,
    complete: function (results)
    {
      addToPage(results.data)
    }
  })
}

function addSponsorsTab(year, index)
{
  // console.log("Adding tab for year %s", year)
  var show = (index === 0)
  // if (show) console.log("This tab is active")

  $('#sponsors-nav').append('<li class="nav-item" role="presentation">'
    + '<a class="nav-link'
    + (show ? ' active' : '')
    + '" id="tab-' + year + '" href="#sponsors-' + year + '" data-toggle="tab" role="tab" aria-controls="sponsors-' + year + '" aria-selected="' + show + '">'
    + year + '</a> </li>')

  $('#sponsors-tab-content').append(
    '<div class="tab-pane fade'
    + (show ? ' show active' : '')
    + '" id="sponsors-' + year + '" role="tabpanel" aria-labelledby="tab-' + year + '"><div class="sponsors-container"></div></div>'
  )
}

var DATA

function addSponsorsData(data)
{
  DATA = data
  var years = []
  for (var y = 2014; data[0].hasOwnProperty(y); y++) { years.push(y) }
  data.forEach(row =>
  {
    row.years = getRanges(years.filter(y => { return row[y] })).join(', ')
  })

  years.reverse();
  years.forEach(addSponsorsTab)

  years.forEach(year =>
  {
    var container = $("#sponsors-" + year + ' .sponsors-container')

    // Compile sponsorship levels for this year
    var sponsorshipLevels = SPONSORSHIP_LEVELS.filter(level =>
    {
      return data.some(row => { return row[year] === level })
    })
    var levelRows = {};
    sponsorshipLevels.forEach(level =>
    {
      if (!levelRows[level])
      {
        levelRows[level] = $('<div></div>')
          .addClass('sponsorship-level-row')
          .append(
            '<div class="sponsorship-level-card">'
            + '<img src="./resources/images/logo_lighthouse.png" alt="" />'
            + '<div class="caption sponsor-level">'
            + '<h4>' + level + '</h4>'
            + ' </div>'
            + '</div>'
            + '<div class="sponsor-card-container"></div>'
          )
        container.append(levelRows[level])
      }
    })

    for (var i = 0; i < data.length; i++)
    {
      var row = data[i]

      // Detect sponsor rows
      if (row['Sponsor Name'] && row[year])
      {
        // container.children('.sponsorship-level-row').last().append(
        var sponsorCard =
          '<div class="sponsor-card' + (row['Logo Link'] ? '' : ' no-logo') + '">'
          + '<div class="no-hover">'
          + (
            row['Logo Link'] ?
              '<img src="' + (row['Logo Link'] || '') + '" alt="" />'
              : '<div class="caption" title="' + row['Sponsor Name'] + '">'
              + '<h4>' + row['Sponsor Name'] + '</h4>'
              + '</div>'
          )
          + '</div>'
          + '<div class="hover">'
          + '<div class="caption" title="' + row['Sponsor Name'] + '">'
          + (row['Website Link'] ? '<a href="' + row['Website Link'] + '" target="_blank">' : '')
          + '<h4>' + row['Sponsor Name'] + '</h4>'
          + (row['Website Link'] ? '</a>' : '')
          + '<div class="sponsor-years">Sponsor ' + row.years + '</div>'
          + '</div>'
          + '</div>'
          + '</div>'

        levelRows[row[year]].find('.sponsor-card-container')
          .append(sponsorCard)
      }
    }
  })
}

// https://stackoverflow.com/a/2270987
function getRanges(array)
{
  var ranges = [], rstart, rend;
  for (var i = 0; i < array.length; i++)
  {
    rstart = array[i];
    rend = rstart;
    while (array[i + 1] - array[i] == 1)
    {
      rend = array[i + 1]; // increment the index if the numbers sequential
      i++;
    }
    ranges.push(rstart == rend ? rstart + '' : rstart + '-' + rend.toString());
  }
  return ranges;
}

function logData(data)
{
  console.log(data);
}

function addToPage(data)
{
  var div = document.getElementById('gdoc-content');
  var pageName = getMeta("page-name");
  for (var i = 0; i < data.length; i++)
  {
    if (data[i].page === pageName)
    {
      div.innerHTML += data[i].content;
    }
  }



  Papa.parse(sponsorSpreadsheetUrl, {
    download: true,
    header: true,
    complete: function (results)
    {
      addSponsorsData(results.data)
    }
  })
}

function getMeta(metaName)
{
  const metas = document.getElementsByTagName('meta');

  for (let i = 0; i < metas.length; i++)
  {
    if (metas[i].getAttribute('name') === metaName)
    {
      return metas[i].getAttribute('content');
    }
  }

  return '';
}

window.addEventListener('DOMContentLoaded', init)