const target = document.getElementById("vis");
const container = document.getElementById("container");

function onViewability({ onChange, target = document.body, ignoreInitial = true } = {}) {
  const options = {
      root: null,
      rootMargin: "0px",
      threshold: [0, 0.5, 1]
  };
  let timeout, hasIgnoredInitial = false;
  const handleIntersect = entries => {
      let latestEntry = null;
      entries.forEach(entry => {
          if (!latestEntry || entry.time > latestEntry.time) {
              latestEntry = entry;
          }
      });
      if (latestEntry) {
          let status = "hidden",
              ratio = 0;
          const { intersectionRatio } = latestEntry;
          if (intersectionRatio > 0) {
              status = "visible";
              ratio = intersectionRatio;
          }
          if (ratio === 0 && ignoreInitial && !hasIgnoredInitial) {
              hasIgnoredInitial = true;
              return;
          }
          timeout = setTimeout(() => {
              onChange({ status, ratio });
          }, 0);
      }
  };
  const observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(target);
  return {
      remove: () => {
          observer.disconnect();
          clearTimeout(timeout);
      }
  };
}

// Measure viewability
let timer;
const update = info => {
   let newStatus = `
      Visible: ${info.status === "visible" ? "yes" : "no"}<br />
      In-view: ${info.ratio >= 0.5 ? "yes" : "no"}<br />
      Ratio: ${(info.ratio * 100).toFixed(1)}%<br />
   `;
   if (info.iabViewable) {
      newStatus += `<strong>IAB viewable</strong> (1 second >= 50%)<br />`
   }
   document.getElementById("stats").innerHTML = newStatus;
};
onViewability({
   target,
   ignoreInitial: false,
   onChange: info => {
      update(info);
      clearTimeout(timer);
      if (info.ratio >= 0.5) {
         timer = setTimeout(() => {
            update(Object.assign(info, {
               iabViewable: true
            }));
         }, 1000);
      }
   }
});
