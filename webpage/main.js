//main.js

    let gridApi; // Declare a global variable to store the grid API

    // Define columns for each table
    const tableColumns = {
        movies: ['title', 'year', 'language', 'isadult', 'runtime', 'region'],
        movie_cast: ['primaryname', 'birthyear', 'deathyear' ],
        ratings: ['averagerating']
    };

    // Define operations for each data type
    const columnOperations = {
        charvar: ['contains', 'equals', 'does not equal', 'is null', 'is not null'],
        integer: ['equals', 'does not equal', 'greater than', 'less than','greater than or equal to', 'less than or equal to', 'is null', 'is not null']
    };

    // Operations that require an additional value
    const operationsWithInput = [
        'contains',
        'equals',
        'does not equal',
        'greater than',
        'less than',
        'greater than or equal to',
        'less than or equal to'
    ];

    const operationMappings = {
        'equals': '=',
        'not equals': '!=',
        'greater than': '>',
        'less than': '<',
        'greater than or equal to': '>=',
        'less than or equal to': '<=',
        'contains': 'LIKE',
        'is null':'is null',
        'is not null':'is not null',
    };

    const dataTypes = {
        title: 'charvar',
        year: 'integer',
        language: 'charvar',
        isadult:'integer',
        runtime:'integer',
        region:'charvar',
        primaryname:'charvar',
        birthyear: 'integer',
        deathyear:'integer',
        averagerating:'integer'
    };

    document.addEventListener('DOMContentLoaded', function () {
        const currentPath = window.location.pathname;

        if (currentPath.includes('index.html')) {

            fetchMovies();
        } else if (currentPath.includes('movie-details.html')) {
            // Get the movie ID from the URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const movieid = urlParams.get('movieid');

            // Fetch detailed information about the movie using the movieID
            fetchMovieDetails(movieid);
        } else if (currentPath.includes('search.html')) {

            initializeSearchPage();
        }
    });


    function onFirstDataRendered(params) {
        gridApi = params.api;
        //gridApi.addEventListener('cellClicked', onCellClicked);
    }


    async function fetchMovies() {
        try {
            const response = await fetch('fetch_data.php');
            const data = await response.json();
            const columnDefs = Object.keys(data[0]).map(columnName => ({
                headerName: columnName,
                field: columnName,
                sortable: true,
                cellRenderer: (params) => {
                    if (columnName === 'region') {
                        // Create an image element for the flag
                        const flagImg = document.createElement('img');
                        flagImg.src = getFlagURL(params.value);
                        flagImg.alt = params.value; // Use the country code as alt text
                        return flagImg;
                    }
                    else if(columnName === 'movieid'){
                        return `<a href="movie-details.html?movieid=${params.value}">${params.value}</a>`;
                    }
                    else {
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
                onFirstDataRendered: onFirstDataRendered, // Add callback function
            };

            // Create ag-Grid
            new agGrid.Grid(document.getElementById('movieGrid'), gridOptions);

        } catch (error) {
          console.error('Error fetching movies:', error);
        }
    }


    async function fetchMovieDetails(movieid) {
       try {
           // Fetch the detailed information for the specified movieID
           const response = await fetch(`fetch_movie_details.php?movieid=${encodeURIComponent(movieid)}`);
           const movieDetails = await response.json();
           const posterURL = await fetchMoviePoster(movieDetails.movieDetails.title);

           if (!response.ok) {
               throw new Error(`Failed to fetch movie details (HTTP ${response.status})`);
           }

           // Display the movie details on the page
           displayMovieDetails(movieDetails, posterURL);
       } catch (error) {
           console.error('Error fetching movie details:', error);
       }
    }

    function displayMovieDetails(data, posterURL) {
        const movieDetailsContainer = document.getElementById('movieDetails');


        // Check if the container exists before proceeding
        if (!movieDetailsContainer) {
            console.error('Movie details container not found');
            return;
        }

        // Create an <img> tag for the movie poster
        const posterHTML = `<img src="${posterURL}" alt="Movie Poster" style="max-width: 100%;">`;

        // Create HTML content to display movie details
        const movieDetailsHTML = `
           <h2>${data.movieDetails.title}</h2>
           <p>Year: ${data.movieDetails.year}</p>
           <p>Runtime: ${data.movieDetails.runtime} minutes</p>
           <p>Genres: ${data.movieDetails.genres}</p>
        `;

        // Create HTML content to display cast members
        const castMembersHTML = data.castMembers.map(member => `
           <div>
               <h3>${member.primaryname}</h3>
               <p>Role: ${member.roles}</p>
               <p>Birth Year: ${member.birthyear}</p>
               <p>Death Year: ${member.deathyear || 'Still alive'}</p>
           </div>
        `).join('');

        // Set the HTML content in the movie details container
        movieDetailsContainer.innerHTML = posterHTML + movieDetailsHTML + castMembersHTML;
    }


    async function fetchMoviePoster(title) {
        try {
            const apiKey = 'b9019a53';
            //const response = await fetch(`https://imdb-api.com/en/API/SearchMovie/${apiKey}/${encodeURIComponent(title)}`);
            const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
            const movieData = await response.json();

            if (!response.ok ) {
                throw new Error('Poster not found');
                console.log("error with poster");
            }

            const posterURL = movieData.Poster;
            console.log(posterURL);
            return posterURL;

        } catch (error) {
            console.error('Error fetching movie poster:', error);
            // Return a default image URL or handle the error as needed
            return 'path_to_default_poster_image.jpg';
        }
    }


    function updateColumns() {
        const tableSelect = document.getElementById('table');
        const columnSelect = document.getElementById('column');
        const selectedTable = tableSelect.value;

        // Clear previous options
        columnSelect.innerHTML = '';

        // Populate columns based on the selected table
        tableColumns[selectedTable].forEach(column => {
            const option = document.createElement('option');
            option.value = column;
            option.text = column;
            columnSelect.add(option);
        });

        // Update operations based on the selected column's data type
        updateOperations();
    }

    function updateOperations() {
        const tableSelect = document.getElementById('table');
        const columnSelect = document.getElementById('column');
        const operationSelect = document.getElementById('operation');
        const selectedTable = tableSelect.value;
        const selectedColumn = columnSelect.value;

        // Clear previous options
        operationSelect.innerHTML = '';

        // Get data type of the selected column (you need to define this logic based on your data model)
        columnDataType = dataTypes[column];
        console.log(columnDataType);

        // Populate operations based on the data type
        columnOperations[columnDataType].forEach(operation => {
            const option = document.createElement('option');
            option.value = operation;
            option.text = operation;
            operationSelect.add(option);
        });
    }


    function displayDataInGrid(data) {
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
                }
                else if(columnName === 'movieid'){
                    // Generate the link directly in the cell
                    return `<a href="movie-details.html?movieid=${params.value}">${params.value}</a>`;
                }
                else {
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
        new agGrid.Grid(document.getElementById('searchGrid'), gridOptions);
    }


    function removeExistingGrid() {
        // Get the existing grid container element
        const gridContainer = document.getElementById('searchGrid');

        // Check if there is an existing grid
        if (gridContainer.firstChild) {
            // Remove the existing grid
            gridContainer.removeChild(gridContainer.firstChild);
        }
    }

    function toggleAdvancedSearch() {
        const advancedSearchToggle = document.getElementById('advancedSearchToggle');
        const advancedSearch = document.getElementById('searchBar');

        // Toggle the display property
        if (advancedSearch.style.display === 'none') {
            advancedSearch.style.display = 'block';
            advancedSearchToggle.textContent = 'Hide Advanced Search';
        } else {
            advancedSearch.style.display = 'none';
            advancedSearchToggle.textContent = 'Show Advanced Search';
        }
    }


    function toggleInput() {
        const operationSelect = document.getElementById('operation');
        const inputContainer = document.getElementById('inputContainer');
        const selectedOperation = operationSelect.value;

        // Show input if the selected operation requires it, hide otherwise
        inputContainer.style.display = operationsWithInput.includes(selectedOperation) ? 'block' : 'none';
    }


    // Function to get the flag URL based on the country code
    function getFlagURL(countryCode) {

        // Check if the country code is null or undefined
        if (countryCode == null) {
            // Return a default flag URL or handle the case as needed
            return 'noIcon.png';
        }


	// Check if the country code is invalid (contains '/' or length > 2)
  	if (countryCode && (countryCode.includes('\\') || countryCode.length > 2)) {
    		// Return URL for the null flag icon
    		return 'noIcon.png';  // Adjust the path accordingly
  	}

        // Special case for 'UK' region
        if (countryCode.toUpperCase() === 'UK') {
            return 'https://flagcdn.com/16x12/gb.png';
        }

        // Use the flagcdn.com format to get the flag URL
        return `https://flagcdn.com/16x12/${countryCode.toLowerCase()}.png`;
    }


    function goBack() {
        // Navigate back to the home page (index.html)
        window.location.href = 'index.html';
    }

    function redirectToSearch() {
            window.location.href = 'search.html';
    }
