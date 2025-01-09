let map, marker, autocomplete;

const defaultLocationName = "New Delhi, India"; // Default location name

const count = 100;
const stage = document.querySelector(".stage .rotate");

for (let i = 0; i < count; i++) {
    setTimeout(() => {
        makeNeon();
    }, 50 * i);
}

function makeNeon() {
    let span = document.createElement("span");
    span.classList.add("s" + gsap.utils.random(1, 2, 1));
    stage.appendChild(span);

    let height = gsap.utils.random(2, 8, 2);
    gsap.set(span, {
        width: gsap.utils.random(50, 300, 10),
        height: height,
        left: gsap.utils.random(-stage.offsetWidth * 0.3, stage.offsetWidth * 0.7),
        top: gsap.utils.random(-stage.offsetHeight * 0.3, stage.offsetHeight * 1.3),
        opacity: 0,
    });

    let tl = gsap.timeline({
        paused: true,
        onComplete: () => {
            span.remove();
            makeNeon();
        },
    });

    tl.to(span, {
        opacity: 1,
        duration: 0.5,
    });
    tl.to(
        span,
        {
            x: gsap.utils.random(stage.offsetWidth * 0.7, stage.offsetWidth * 0.8, 20),
            duration: 7 - height / 2,
            ease: Power0.easeNone,
        },
        -0.5
    );
    tl.to(
        span,
        {
            opacity: 0,
            duration: 0.5,
        },
        ">-.5"
    );

    tl.play();
}

// Initialize the map with latitude and longitude
function initMap(latitude = 28.6139, longitude = 77.209) {
    const userLocation = { lat: latitude, lng: longitude };

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: userLocation,
    });

    marker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Location",
    });
    toggleBounce();
    setupAutocomplete(); // Setup autocomplete once map is initialized
}

function toggleBounce() {
    // if (marker.getAnimation() !== null) {
    //     marker.setAnimation(null);
    // } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    // }
}

// Function to geocode an address
function geocodeAddress(address) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, function (results, status) {
        if (status === "OK") {
            const location = results[0].geometry.location;
            initMap(location.lat(), location.lng());
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

// Function to initialize the address autocomplete feature
function setupAutocomplete() {
    const input = document.getElementById("searchBox");
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields(["address_component", "geometry"]);

    autocomplete.addListener("place_changed", function () {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            const location = place.geometry.location;
            map.setCenter(location);
            marker.setPosition(location);
            map.setZoom(15);
        }
    });
}

// Function to get user's current geolocation
function getGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                initMap(latitude, longitude);
            },
            function (error) {
                if (error.code === error.PERMISSION_DENIED) {
                    document.getElementById("searchBoxDiv").style.display = "block";
                } else {
                    alert("Error getting your location: " + error.message);
                }
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Function to search for an address
function searchAddress() {
    const address = document.getElementById("searchBox").value;
    if (address) {
        geocodeAddress(address);
    } else {
        alert("Please enter an address.");
    }
}

// Load Google Maps API with API key and callback to `initMap`
function loadGoogleMapsScript() {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBGr6THpGcIf3OlBCM7mMZWyitKs7V23Wo&libraries=places&callback=initMap`;
    script.async = true;
    script.onerror = function () {
        alert("Error loading Google Maps. Please check your API key.");
    };
    document.head.appendChild(script);
}

function loadScript() {
    loadGoogleMapsScript();
    geocodeAddress(defaultLocationName);
}

loadScript();

//neon code
