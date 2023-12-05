/*
	Stellar by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/



let countryData;
let gridApi; // Declare a global variable to store the grid API


async function fetchMovies() {
    try {

const response = await fetch('fetch_data.php');
      const data = await response.json();


        const columnDefs = Object.keys(data[0]).map(columnName => ({
        headerName: columnName,
        field: columnName,
        sortable: true,
        cellRenderer: (params) => {
          // Check if the column is 'region'
          if (columnName === 'region') {
            // Create an image element for the flag
            const flagImg = document.createElement('img');
            flagImg.src = getFlagURL(params.value);
            flagImg.alt = params.value; // Use the country code as alt text
            return flagImg;
          } else {
            // Return the regular text value for other columns
            return params.value;
          }
        },
      }));

      const gridOptions = {
        columnDefs: columnDefs,
        rowData: data,
        pagination: true,
        domLayout: 'autoHeight',
	paginationPageSize: 20,
  height: 400,  // Set your desired height
        onFirstDataRendered: onFirstDataRendered, // Add callback function
      };

      // Create ag-Grid
      new agGrid.Grid(document.getElementById('movieGrid'), gridOptions);

    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }

async function fetchRatings() {
    try {

const response = await fetch('fetch_ratings.php');
      const data = await response.json();


        const columnDefs = Object.keys(data[0]).map(columnName => ({
        headerName: columnName,
        field: columnName,
        sortable: true,
        cellRenderer: (params) => {
          // Check if the column is 'region'
          if (columnName === 'region') {
            // Create an image element for the flag
            const flagImg = document.createElement('img');
            flagImg.src = getFlagURL(params.value);
            flagImg.alt = params.value; // Use the country code as alt text
            return flagImg;
          } else {
            // Return the regular text value for other columns
            return params.value;
          }
        },
      }));

      const gridOptions = {
        columnDefs: columnDefs,
        rowData: data,
        pagination: true,
        domLayout: 'autoHeight',
	paginationPageSize: 20,
  height: 400,  // Set your desired height
      };

      // Create ag-Grid
      new agGrid.Grid(document.getElementById('ratingsGrid'), gridOptions);

    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  }


async function fetchCast() {
    try {

const response = await fetch('fetch_cast.php');
      const data = await response.json();


        const columnDefs = Object.keys(data[0]).map(columnName => ({
        headerName: columnName,
        field: columnName,
        sortable: true,
        cellRenderer: (params) => {
          // Check if the column is 'region'
          if (columnName === 'region') {
            // Create an image element for the flag
            const flagImg = document.createElement('img');
            flagImg.src = getFlagURL(params.value);
            flagImg.alt = params.value; // Use the country code as alt text
            return flagImg;
          } else {
            // Return the regular text value for other columns
            return params.value;
          }
        },
      }));

      const gridOptions = {
        columnDefs: columnDefs,
        rowData: data,
        pagination: true,
        domLayout: 'autoHeight',
	paginationPageSize: 20,
  height: 400,  // Set your desired height
      };

      // Create ag-Grid
      new agGrid.Grid(document.getElementById('castGrid'), gridOptions);

    } catch (error) {
      console.error('Error fetching cast:', error);
    }
  }


async function fetchParticipates() {
    try {

const response = await fetch('fetch_participates.php');
      const data = await response.json();


        const columnDefs = Object.keys(data[0]).map(columnName => ({
        headerName: columnName,
        field: columnName,
        sortable: true,
        cellRenderer: (params) => {
          // Check if the column is 'region'
          if (columnName === 'region') {
            // Create an image element for the flag
            const flagImg = document.createElement('img');
            flagImg.src = getFlagURL(params.value);
            flagImg.alt = params.value; // Use the country code as alt text
            return flagImg;
          } else {
            // Return the regular text value for other columns
            return params.value;
          }
        },
      }));

      const gridOptions = {
        columnDefs: columnDefs,
        rowData: data,
        pagination: true,
        domLayout: 'autoHeight',
	paginationPageSize: 20,
      };

      // Create ag-Grid
      new agGrid.Grid(document.getElementById('participatesGrid'), gridOptions);

    } catch (error) {
      console.error('Error fetching participates:', error);
    }
  }



// Function to get the flag URL based on the country code
function getFlagURL(countryCode) {

  // Special case for 'UK' region
  if (countryCode.toUpperCase() === 'UK') {
    return 'https://flagcdn.com/16x12/gb.png';
  }

  // Use the flagcdn.com format to get the flag URL
  return `https://flagcdn.com/16x12/${countryCode.toLowerCase()}.png`;
}



// Callback function to store the grid API
function onFirstDataRendered(params) {
  gridApi = params.api;
}





function searchMovies() {

const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.toLowerCase();


  // Check if the api is available
  if (gridApi) {
    // Use the api to set the quick filter
    gridApi.setQuickFilter(searchTerm);
  } else {
    console.error('Ag-Grid API not available.');
  }

}




async function executeSqlCommand() {

	 // Get the SELECT query from the search bar
        const searchQuery = document.getElementById('sqlInput').value;
		console.log(searchQuery);


        try {
            // Fetch the data using the fetch_sql_command.php script
            const response = await fetch(`fetch_sql_command.php?query=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();

            // Display the data in the ag-Grid
            displayDataInGrid(data);
        } catch (error) {
            console.error('Error executing search:', error);
        }

}


function displayDataInGrid(data) {
        const columnDefs = Object.keys(data[0]).map(columnName => ({ headerName: columnName, field: columnName,     sortable: true }));
        const gridOptions = {
            columnDefs: columnDefs,
            rowData: data,
            pagination: true,
            domLayout: 'autoHeight',
  paginationPageSize: 20,
        };

        // Create ag-Grid
        new agGrid.Grid(document.getElementById('movieGrid'), gridOptions);
    }





// Call the fetchMovies function when the DOM is loaded
document.addEventListener('DOMContentLoaded', fetchMovies);
document.addEventListener('DOMContentLoaded', fetchRatings);
document.addEventListener('DOMContentLoaded', fetchCast);
document.addEventListener('DOMContentLoaded', fetchParticipates);



(function($) {

	var	$window = $(window),
		$body = $('body'),
		$main = $('#main');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
		var $nav = $('#nav');

		if ($nav.length > 0) {

			// Shrink effect.
				$main
					.scrollex({
						mode: 'top',
						enter: function() {
							$nav.addClass('alt');
						},
						leave: function() {
							$nav.removeClass('alt');
						},
					});

			// Links.
				var $nav_a = $nav.find('a');

				$nav_a
					.scrolly({
						speed: 1000,
						offset: function() { return $nav.height(); }
					})
					.on('click', function() {

						var $this = $(this);

						// External link? Bail.
							if ($this.attr('href').charAt(0) != '#')
								return;

						// Deactivate all links.
							$nav_a
								.removeClass('active')
								.removeClass('active-locked');

						// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
							$this
								.addClass('active')
								.addClass('active-locked');

					})
					.each(function() {

						var	$this = $(this),
							id = $this.attr('href'),
							$section = $(id);

						// No section for this link? Bail.
							if ($section.length < 1)
								return;

						// Scrollex.
							$section.scrollex({
								mode: 'middle',
								initialize: function() {

									// Deactivate section.
										if (browser.canUse('transition'))
											$section.addClass('inactive');

								},
								enter: function() {

									// Activate section.
										$section.removeClass('inactive');

									// No locked links? Deactivate all links and activate this section's one.
										if ($nav_a.filter('.active-locked').length == 0) {

											$nav_a.removeClass('active');
											$this.addClass('active');

										}

									// Otherwise, if this section's link is the one that's locked, unlock it.
										else if ($this.hasClass('active-locked'))
											$this.removeClass('active-locked');

								}
							});

					});

		}

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000
		});

})(jQuery);
