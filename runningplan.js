//PLAN PAGE JAVASCRIPT

// Open a connection to the IndexedDB database
var request = window.indexedDB.open('routesDB', 1);

// Create the object store for routes if it doesn't exist
request.onupgradeneeded = function (event) {
  var db = event.target.result;
  if (!db.objectStoreNames.contains('routes')) {
    var store = db.createObjectStore('routes', { keyPath: 'id', autoIncrement: true });
  }
};

// Display the saved routes in the table
request.onsuccess = function (event) {
  var db = event.target.result;
  var transaction = db.transaction(['routes'], 'readonly');
  var objectStore = transaction.objectStore('routes');

  objectStore.openCursor().onsuccess = function (event) {
    var cursor = event.target.result;

    if (cursor) {
      // Create a new row in the table for each saved route
      var row = document.createElement('tr');
      row.innerHTML = '<td>' + cursor.value.name + '</td>';

      //date and time
      if (cursor.value.datetime) {
        var date = new Date(cursor.value.datetime);
        var formattedDate = date.toLocaleDateString('en-GB'); // format as DD/MM/YYYY
        var formattedTime = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); // format as HH:MM
        row.innerHTML += '<td>' + formattedDate + ' ' + formattedTime + '</td>';
      } else {
        row.innerHTML += '<td></td>';
      }

      // Check if distance is defined before adding it to the row
      if (cursor.value.distance) {
        row.innerHTML += '<td>' + parseFloat(cursor.value.distance).toFixed(2) + '</td>';
      } else {
        row.innerHTML += '<td></td>';
      }

      // Check if weather is defined before adding it to the row
      if (cursor.value.weather) {
        row.innerHTML += '<td>' + cursor.value.weather + '</td>';
      } else {
        row.innerHTML += '<td></td>';
      }

      // Add checkbox for activity completion
      row.innerHTML += '<td><input type="checkbox" name="completed" value="yes"></td>';

      // Add dropdown list for activity feelings
      row.innerHTML += '<td><select name="feelings"><option value="easy">Easy</option><option value="ok">Ok</option><option value="hard">Hard</option></select></td>';

      // Add checkbox for activity substituted
      row.innerHTML += '<td><input type="checkbox" name="completed" value="yes"></td>';

      document.getElementById('route-list').appendChild(row);

      cursor.continue();
    }
  };
};











// // Display the saved routes in the table
// request.onsuccess = function (event) {
//   var db = event.target.result;
//   var transaction = db.transaction(['routes'], 'readonly');
//   var objectStore = transaction.objectStore('routes');

//   objectStore.openCursor().onsuccess = function (event) {
//     var cursor = event.target.result;

//     if (cursor) {
//       // Create a new row in the table for each saved route
//       var row = document.createElement('tr');
//       row.innerHTML = '<td>' + cursor.value.name + '</td>';


    //   //date and time
    //   if (cursor.value.datetime) {
    //     var date = new Date(cursor.value.datetime);
    //     var formattedDate = date.toLocaleDateString('en-GB'); // format as DD/MM/YYYY
    //     var formattedTime = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); // format as HH:MM
    //     row.innerHTML += '<td>' + formattedDate + ' ' + formattedTime + '</td>';
    // } else {
    //     row.innerHTML += '<td></td>';
    // }
    
            
    //   // Check if distance is defined before adding it to the row
    //   if (cursor.value.distance) {
    //     row.innerHTML += '<td>' + parseFloat(cursor.value.distance).toFixed(2) + '</td>';
    //   } else {
    //     row.innerHTML += '<td></td>';
    //   }

    //   // Check if weather is defined before adding it to the row
    //   if (cursor.value.weather) {
    //     row.innerHTML += '<td>' + cursor.value.weather + '</td>';
    //   } else {
    //     row.innerHTML += '<td></td>';
    //   }

      // document.getElementById('route-list').appendChild(row);

      // cursor.continue();



