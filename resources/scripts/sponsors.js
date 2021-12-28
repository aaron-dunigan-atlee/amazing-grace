var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1mI0Prj20RwR-9bMV_wnmKgavspKl7jg6cvYrOLi61Fg/pub?output=csv';
var sponsorSpreadsheetUrls = [
  { 'year': '2021', 'url': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQM_Fvk7louC_v6rGXUR0vKfRnmYqZcRQ8ZFnPoj_am9RsBTxY5xaLCty0Qtw1CHMK-eLeYvBCZcJts/pub?gid=541868499&single=true&output=csv' },
  { 'year': '2020', 'url': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQM_Fvk7louC_v6rGXUR0vKfRnmYqZcRQ8ZFnPoj_am9RsBTxY5xaLCty0Qtw1CHMK-eLeYvBCZcJts/pub?gid=0&single=true&output=csv' },
  { 'year': '2019', 'url': 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQM_Fvk7louC_v6rGXUR0vKfRnmYqZcRQ8ZFnPoj_am9RsBTxY5xaLCty0Qtw1CHMK-eLeYvBCZcJts/pub?gid=374590758&single=true&output=csv' },
]

function init()
{
  // 8.15.21 Switched from tabletop to Papa Parse as tabletop is now broken
  // See https://github.com/jsoma/tabletop
  // and https://www.papaparse.com/docs
  Papa.parse(publicSpreadsheetUrl, {
    download: true,
    header: true,
    complete: function (results)
    {
      addToPage(results.data)
    }
  })
  sponsorSpreadsheetUrls.forEach((sheet) =>
  {
    addSponsorsTab(sheet.year)
    Papa.parse(sheet.url, {
      download: true,
      header: true,
      complete: function (results)
      {
        addSponsorsData(sheet.year, results.data)
      }
    })
  })

}

function addSponsorsTab(year)
{
  console.log("Adding tab for year %s", year)
  $('#sponsors-nav').append('<li class="nav-item" role="presentation">'
    + '<a class="nav-link" id="tab-' + year + '" href="#sponsors-' + year + '" data-toggle="tab" role="tab" aria-controls="sponsors-' + year + '" aria-selected="false">'
    + year + '</a> </li>')
}

function addSponsorsData(year, data)
{
  console.log("Adding data for year %s", year)
  $('#sponsors-tab-content').append(
    '<div class="tab-pane fade" id="sponsors-' + year + '" role="tabpanel" aria-labelledby="tab-' + year + '">New content for year ' + year + '</div>'
  )
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