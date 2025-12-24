const globe = Globe()(document.getElementById("globe"))
  .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
  .atmosphereColor("cyan")
  .atmosphereAltitude(0.25);

// Fetch attack data from backend
fetch("/api/attacks")
  .then((res) => res.json())
  .then((attacks) => {
    let visible = [];

    const start = Date.now();

    const timer = setInterval(() => {
      const now = Date.now();

      attacks.forEach((attack) => {
        if (new Date(attack.timestamp).getTime() <= now && !visible.includes(attack)) {
          visible.push(attack);
        }
      });

      // fading attacks after 4s
      const filtered = visible.filter((attack) => {
        return (now - new Date(attack.timestamp).getTime()) < 4000;
      });

      updateDashboard(filtered);

      globe
        .pointsData(filtered)
        .pointLat((d) => d.lat)
        .pointLng((d) => d.lng)
        .pointColor((d) => {
          if (d.riskLevel === "HIGH") return "red";
          if (d.riskLevel === "MEDIUM") return "orange";
          return "green";
        })
        .pointAltitude((d) => {
          if (d.riskLevel === "HIGH") return 0.3;
          if (d.riskLevel === "MEDIUM") return 0.15;
          return 0.07;
        })
        .pointRadius(0.2)
        .pointLabel(
          (d) => `
            <div class="globe-tooltip">
                <b>${d.ip}</b><br/>
                ${d.country}<br/>
                RPS: ${d.requestsPerSecond}<br/>
                Failed: ${d.failedRequests}<br/>
                <span class="${d.riskLevel.toLowerCase()}">${d.riskLevel} RISK</span>
            </div>
          `
        );

      if (now - start > 12000) {
        clearInterval(timer);
      }
    }, 1000);
  });

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  document.getElementById('clock').innerText = time;
}

setInterval(updateClock, 1000);
updateClock();

function updateDashboard(attacks) {
  document.getElementById('totalAttacks').innerText = attacks.length;
  
  const high = [];
  const medium = [];
  const low = [];

  attacks.forEach(a => {
    if (a.riskLevel === 'HIGH') high.push(a);
    else if (a.riskLevel === 'MEDIUM') medium.push(a);
    else low.push(a);
  });

  document.getElementById('highCount').innerText = high.length;
  document.getElementById('mediumCount').innerText = medium.length;
  document.getElementById('lowCount').innerText = low.length;

  const countryMap = {};
  attacks.forEach(a => {
    countryMap[a.country] = (countryMap[a.country] || 0) + 1;
  });

  const tableBody = document.querySelector('#countryTable tbody');
  tableBody.innerHTML = '';
  Object.entries(countryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([country, count]) => {
      tableBody.innerHTML += `<tr><td>${country}</td><td>${count}</td></tr>`;
    });

  const list = document.getElementById('highRiskList');
  list.innerHTML = '';
  high.slice(0, 5).forEach(a => {
    list.innerHTML += `<li>${a.ip} (${a.country})</li>`;
  });
}