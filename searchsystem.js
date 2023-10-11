 // Function to check if a profile meets the selected criteria
  function profileMatchesCriteria(profile, parameter, value) {
    var profileValue = profile.getElementsByClassName("parameters")[0].getElementsByTagName("p");
    for (var k = 0; k < profileValue.length; k++) {
      var profileParam = profileValue[k].textContent.toLowerCase();
      if (profileParam.includes(parameter.toLowerCase()) && profileParam.includes(value.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  // Function to filter profiles based on the selected criteria
  function filterProfiles() {
    var location = document.getElementById("location").value;
    var age = document.getElementById("age").value;
    var complexion = document.getElementById("complexion").value;
    var bust = document.getElementById("bust").value;
    var backside = document.getElementById("backside").value;
    var specialServices = document.getElementById("special-services").value;
    var rating = document.getElementById("rating").value;

    var profiles = document.getElementsByClassName("grid-item");

    for (var i = 0; i < profiles.length; i++) {
      var profile = profiles[i];
      var profileLocation = profile.getElementsByClassName("parameters")[0].getElementsByTagName("p")[1].textContent.split(": ")[1];

      var matches = 0;

      if (location === "all" || profileLocation === location) {
        matches++;

        if (profileMatchesCriteria(profile, "age", age)) matches++;
        if (profileMatchesCriteria(profile, "complexion", complexion)) matches++;
        if (profileMatchesCriteria(profile, "bust", bust)) matches++;
        if (profileMatchesCriteria(profile, "backside", backside)) matches++;
        if (profileMatchesCriteria(profile, "special services", specialServices)) matches++;
        if (profileMatchesCriteria(profile, "rating", rating)) matches++;
      }

      if (matches > 0) {
        profile.style.display = "block";
        profile.setAttribute("data-matches", matches); // Use setAttribute
      } else {
        profile.style.display = "none";
        profile.removeAttribute("data-matches");
      }
    }
  }

  // Function to prioritize results with more matches
  function prioritizeResults() {
    var gridContainer = document.getElementsByClassName("grid-container")[0];
    var profiles = Array.from(gridContainer.getElementsByClassName("grid-item"));

    profiles.sort(function (a, b) {
      var matchesA = parseInt(a.dataset.matches || 0);
      var matchesB = parseInt(b.dataset.matches || 0);

      return matchesB - matchesA;
    });

    for (var i = 0; i < profiles.length; i++) {
      gridContainer.appendChild(profiles[i]);
    }
  }

  // Function to refresh database results on parameter change
  function refreshResults() {
    filterProfiles();
    prioritizeResults();
  }

  // Initialize the functions when the page loads
  window.onload = function () {
    refreshResults();

    var selects = document.getElementsByTagName("select");
    for (var i = 0; i < selects.length; i++) {
      var select = selects[i];
      select.addEventListener("change", refreshResults);
    }

    openPopup(); // Open the pop-up when the page loads
  };

  // Function to open the pop-up box
  function openPopup() {
    document.getElementById("popupBox").style.display = "block";
  }

  // Function to close the pop-up box
  function closePopup() {
    document.getElementById("popupBox").style.display = "none";
  }

