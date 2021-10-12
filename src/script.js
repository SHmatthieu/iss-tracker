let lat = 0;
let long = 0;
let oldLat = 0;
let oldLong = 0;
let path = [];
let update = false;

let iss = new og.Entity({
    'name': 'iss',
    'lonlat': [0, 0, 1000000],
    'label': { 'text': "iss" }
});

let entity = new og.Entity({
    'name': 'path',
    'polyline': {
        'pathLonLat': path,
        'thickness': 10,
        'color': "red"
    }
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



let e = new og.EntityCollection({
    'entities': [iss, entity]
});
e.events.on("draw", (c) => {
    c.each((e) => {
        if (e.properties.name == "iss") {
            e.setLonLat(new og.LonLat(long, lat, 420000));
        } else if (e.properties.name == "path") {
            if (update) {
                e.polyline.setPathLonLat(path);
                update = false;
            }
        }
    });
});
e.addTo(globus.planet);


let f = () => {
    let http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (http.status == 200 && http.readyState == 4) {
            let data = JSON.parse(http.responseText);
            long = parseFloat(data['iss_position']['longitude']);
            lat = parseFloat(data['iss_position']['latitude']);
            if (oldLong != 0 && oldLat != 0) {
                path.push([new og.LonLat(oldLong, oldLat, 20000), new og.LonLat(long, lat, 20000)]);
                update = true;
            }
            oldLong = long;
            oldLat = lat;
        }
    };
    http.open("GET", "http://api.open-notify.org/iss-now.json", true);
    http.send(null);

    setTimeout(f, 1000);
};
f();

document.getElementById("setCam").onclick = () => {
    globus.planet.camera.flyLonLat(new og.LonLat(long, lat));
};