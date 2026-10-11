const mahoorCollections =
    document.querySelector(".mahoor-collections");


if (mahoorCollections) {

    const collectionsObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.18
            }
        );


    collectionsObserver.observe(
        mahoorCollections
    );

}