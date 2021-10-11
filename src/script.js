let lat = 0;
let long = 0;

let entity = new og.Entity({
    'name': 'iss',
    'lonlat': [0, 0, 1000000],
    'label': { 'text': "iss" }
});



let osm = new og.layer.XYZ("OpenStreetMap", {
    isBaseLayer: true,
    url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    visibility: true,
    attribution: 'Data @ OpenStreetMap contributors, ODbL'
});

let globus = new og.Globe({
    "target": "globus",
    "name": "Earth",
    "terrain": new og.terrain.GlobusTerrain(),
    "layers": [osm]
});

let e = new og.EntityCollection({ 'entities': [entity] });
e.events.on("draw", (c) => {
    c.each((e) => { e.setLonLat(new og.LonLat(long, lat, 420000)) });
});
e.addTo(globus.planet);


let f = () => {
    let http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (http.status == 200 && http.readyState == 4) {
            let data = JSON.parse(http.responseText);
            long = parseFloat(data['iss_position']['longitude']);
            lat = parseFloat(data['iss_position']['latitude']);
            console.log(data['iss_position']);
        }
    };
    http.open("GET", "http://api.open-notify.org/iss-now.json", true);
    http.send(null);

    setTimeout(f, 1000);
}

f();