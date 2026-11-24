# cse134_hw5

* Exercise folder: ssg-exercise/ Home page, and About Me page

## Design Note

The visitor's goal is to discover interesting facts without leaving or reloading my portfolio.

When the visitor clicks the Get Random Fact button, a JavaScript event listener handles the interaction and sends a request to an external API using fetch().

While waiting for the response, the component displays a loading message and temporarily disables the request button to prevent repeated requests.

When the request succeeds, JavaScript processes the returned data and updates the component's DOM to display the new fact. A status message informs the visitor that a new fact has been loaded.

If the request fails, the component displays an error message and allows the visitor to try again. The rest of the portfolio remains usable.

This design provides immediate feedback, communicates the request status, and allows visitors to interact with the component without navigating away from the home page.