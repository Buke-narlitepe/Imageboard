// IIFE
(function () {
    Vue.component("image-component", {
        template: "#image-component",
        props: ["id"],
        data: function () {
            return {
                url: "",
                title: "",
                description: "",
                username: "",
                created_at: "",
            };
        },
        mounted() {
            axios
                .get("/images/" + this.id)
                .then((res) => {
                    console.log(res);
                    this.url = res.data.url;
                    this.title = res.data.title;
                    this.description = res.data.description;
                    this.username = res.data.username;
                    this.created_at = res.data.created_at;
                })
                .catch((err) => {
                    console.log("error on getting image by id: ", err);
                });
        },
        methods: {
            closeModal() {
                this.$emit("close-the-component");
            },
        },
    });
    Vue.component("comment-component", {
        template: "#comment-component",
        props: ["id"],
        data: function () {
            return {
                comments: [],
                username: "",
                comment: "",
            };
        },
        mounted() {
            axios
                .get("/comments/" + this.id)
                .then((res) => {
                    this.comments = res.data;
                })
                .catch((err) => {
                    console.log("error on getting comment by imageId: ", err);
                });
        },
        methods: {
            handleSubmit() {
                axios
                    .post("/comments", {
                        comment: this.comment,
                        username: this.username,
                        image_id: this.id,
                    })
                    .then((res) => {
                        this.comments.unshift(res.data);
                    });
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            form: {
                title: "",
                description: "",
                username: "",
                file: "",
            },
            error: false,
            id: null,
            hasMore: true,
            comments: [],
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
        methods: {
            handleSubmit() {
                this.error = false;

                console.log("UPDATED", this.form);

                const formData = new FormData();
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);
                formData.append("file", this.form.file);

                axios
                    .post("/upload", formData)
                    .then((res) => {
                        this.images.unshift(res.data[0]);
                    })
                    .catch(() => {
                        this.error = true;
                    });
            },
            openModal(id) {
                this.id = id;
            },
            closingComponent() {
                this.id = null;
            },

            handleFile(e) {
                console.log("handleFile", e.target.files[0]);
                this.form.file = e.target.files[0];
            },
            loadMore() {
                axios
                    .get(`/images?id=${[...this.images].pop().id}`)
                    .then((res) => {
                        if (res.data.length < 6) {
                            this.hasMore = false;
                        }
                        this.images.push(...res.data);
                    });
            },
        },
    });
})();
