const productsFilterButtons = document.querySelectorAll(".products-filter");

const productsFilterCards = document.querySelectorAll(".products-filter__item");
console.log(productsFilterButtons);


productsFilterButtons.forEach(button => {

    button.addEventListener("click", () => {

        productsFilterButtons.forEach(btn =>
            btn.classList.remove("is-active")
        );

        button.classList.add("is-active");

        const filter = button.dataset.filter;

        productsFilterCards.forEach(card => {

            const category = card.dataset.category;

            const shouldShow =
                filter === "all" || category === filter;

            card.classList.toggle("is-hidden", !shouldShow);

        });

    });

});
