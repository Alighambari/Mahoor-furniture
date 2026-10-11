const aboutEditorial = document.querySelector(".about-editorial");

if (aboutEditorial) {
  const aboutObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  aboutObserver.observe(aboutEditorial);
}

/* =========================================================
   MAHOOR — ABOUT SCROLL ANIMATION
   ========================================================= */

// (function () {

//     "use strict";


//     const aboutSection = document.querySelector(".mahoor-about");


//     if (!aboutSection) {
//         return;
//     }


//     const observer =
//         new IntersectionObserver(
//             function (entries) {

//                 entries.forEach(function (entry) {

//                     if (entry.isIntersecting) {

//                         aboutSection.classList.add("is-visible");

//                         observer.unobserve(aboutSection);
//                     }

//                 });

//             },
//             {
//                 threshold: 0.25
//             }
//         );


//     observer.observe(aboutSection);

// })();
/* =========================================================
   MAHOOR — ABOUT SCROLL REVEAL
   ========================================================= */

(function () {
  "use strict";

  const aboutSection = document.querySelector(".mahoor-about");

  if (!aboutSection) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          aboutSection.classList.add("is-visible");
          observer.unobserve(aboutSection);
        }
      });
    },
    {
      threshold: 0.15, // کمی زودتر فعال شود
    }
  );

  observer.observe(aboutSection);
})();