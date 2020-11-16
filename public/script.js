// IIFE
(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
        },
        mounted() {
            axios
                .get("/images")
                .then((res) => {
                    this.images = res.data;
                })
                .catch((err) => {
                    console.log("error on getting images: ", err);
                });
        },
        updated() {
            console.log("UPDATED");
        },
        methods: {
            addHamburg() {
                this.cities.push({
                    name: "Hamburg",
                    country: "DE",
                });
            },
        },
    });
})();
